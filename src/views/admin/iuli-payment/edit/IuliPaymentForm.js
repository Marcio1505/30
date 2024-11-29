import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Button, Form, Input, Label, FormGroup } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';
import AsyncSelect from 'react-select/async';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import { formatDateToHumanString } from '../../../../utils/formaters';

import {
  showIuliPayment,
  updateIuliPayment,
} from '../../../../services/apis/iuli_payment.api';
import { fetchSelectCompanies } from '../../../../services/apis/company.api';

import PermissionGate from '../../../../PermissionGate';

const IuliPaymentForm = ({ currentCompanyId }) => {
  const history = useHistory();
  const intl = useIntl();
  const { iuli_payment_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [iuliPayment, setIuliPayment] = useState({});
  const [
    selectedCompanyHasAsaasSubscription,
    setSelectedCompanyHasAsaasSubscription,
  ] = useState(false);

  const mountPayload = () => ({
    iuliPayment: {
      id: iuli_payment_id,
      company_id: formik.values.company_id,
    },
  });

  const handleUpdateIuliPayment = async () => {
    await updateIuliPayment(mountPayload());
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: 'Pagamento Iuli atualizado com sucesso',
        hasTimeout: true,
      })
    );
    history.push('/admin/iuli-payment/list');
  };

  const onSubmit = async () => {
    if (selectedCompanyHasAsaasSubscription) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Remover Associação Anterior',
          message:
            'Essa empresa já possui uma assinatura Iuli associada a ela. Ao confirmar a nova associação, a assinatura anterior será removida. Deseja continuar?',
          showCancel: true,
          reverseButtons: false,
          cancelBtnBsStyle: 'danger',
          confirmBtnText: 'Sim',
          cancelBtnText: 'Cancelar',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
            handleUpdateIuliPayment();
          },
        })
      );
    } else {
      handleUpdateIuliPayment();
    }
  };

  const initialValues = {
    competency_date: iuliPayment.sale?.competency_date || '',
    months_credit: iuliPayment.months_credit || '',
    company_id: iuliPayment.company_id || '',
    company: iuliPayment.company || '',
  };

  const validationSchema = Yup.object().shape({
    company_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  const getAsyncOptions = async (inputValue) => {
    const { data: dataCompanies } = await fetchSelectCompanies({
      params: `?name_or_document=${inputValue}`,
    });
    return new Promise((resolve) => setTimeout(resolve, 1, dataCompanies));
  };

  const loadOptions = useCallback(
    debounce((inputText, callback) => {
      getAsyncOptions(inputText).then((options) => callback(options));
    }, 1000),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      let dataIuliPayment = {};
      if (iuli_payment_id) {
        const resShowIuliPayment = await showIuliPayment({
          id: iuli_payment_id,
        });
        dataIuliPayment = resShowIuliPayment.data;
      }
      setIuliPayment(dataIuliPayment);
      setInitialized(true);
    };
    fetchData();
  }, [iuli_payment_id]);

  useEffect(() => {
    if (
      iuliPayment?.company_id &&
      currentCompanyId !== iuliPayment.company_id
    ) {
      history.push(`/admin/iuli-payment/list`);
    }
  }, [currentCompanyId]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      {initialized && (
        <Row className="mt-1">
          <Col className="mt-1" md={{ size: 6, offset: 3 }} sm="12">
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label for="competency_date">
                    <FormattedMessage id="sales.competency_date" />
                  </Label>
                  <Input
                    id="competency_date"
                    value={formatDateToHumanString(
                      formik.values.competency_date
                    )}
                    readOnly
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label for="months_credit">
                    <FormattedMessage id="iuli_payments.months_credit" />
                  </Label>
                  <Input
                    id="months_credit"
                    value={formik.values.months_credit}
                    readOnly
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="company_id">
                    <FormattedMessage id="iuli_payments.company_id" /> *
                  </Label>
                  <AsyncSelect
                    isDisabled={formik.initialValues.company_id}
                    className="React"
                    classNamePrefix="select"
                    id="company_id"
                    onBlur={formik.handleBlur}
                    loadOptions={loadOptions}
                    defaultValue={
                      formik.values.company_id
                        ? {
                            label: `${formik.values.company?.company_name} - ${formik.values.company?.document}}`,
                            value: formik.values.company_id,
                          }
                        : {}
                    }
                    onChange={(opt) => {
                      setSelectedCompanyHasAsaasSubscription(
                        opt.has_asaas_subscription
                      );
                      formik.setFieldValue('company_id', opt.value);
                    }}
                  />
                  {formik.errors.company_id && formik.touched.company_id ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.company_id}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
          </Col>
          {!formik.initialValues.company_id && (
            <PermissionGate permissions="isIuliAdmin">
              <Col
                className="d-flex justify-content-end flex-wrap"
                md={{ size: 6, offset: 3 }}
                sm="12"
              >
                <Button.Ripple className="mt-1" color="primary">
                  <FormattedMessage id="button.save" />
                </Button.Ripple>
              </Col>
            </PermissionGate>
          )}
        </Row>
      )}
    </Form>
  );
};

IuliPaymentForm.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(IuliPaymentForm);
