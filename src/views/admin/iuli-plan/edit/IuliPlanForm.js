import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Button, Form, Input, Label, FormGroup } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  showIuliPlan,
  updateIuliPlan,
  createIuliPlan,
} from '../../../../services/apis/iuli_plan.api';

import PermissionGate from '../../../../PermissionGate';

const IuliPlanForm = ({ currentCompanyId }) => {
  const history = useHistory();
  const intl = useIntl();
  const { iuli_plan_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [iuliPlan, setIuliPlan] = useState({});

  const mountPayload = () => ({
    iuliPlan: {
      ...(iuli_plan_id && { id: iuli_plan_id }),
      name: formik.values.name,
      months_credit: formik.values.months_credit,
      invoices_per_month: formik.values.invoices_per_month,
    },
  });

  const onSubmit = async () => {
    if (iuli_plan_id) {
      await updateIuliPlan(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Plano Iuli atualizado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/iuli-plan/list');
    } else {
      await createIuliPlan(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Plano Iuli criado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/iuli-plan/list');
    }
  };

  const initialValues = {
    name: iuliPlan.name || '',
    months_credit: iuliPlan.months_credit || '',
    invoices_per_month: iuliPlan.invoices_per_month || '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    months_credit: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    invoices_per_month: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      let dataIuliPlan = {};
      if (iuli_plan_id) {
        const res = await showIuliPlan({ id: iuli_plan_id });
        dataIuliPlan = res.data;
      }

      setIuliPlan(dataIuliPlan);
      setInitialized(true);
    };
    fetchData();
  }, [iuli_plan_id]);

  useEffect(() => {
    if (iuliPlan?.company_id && currentCompanyId !== iuliPlan.company_id) {
      history.push(`/admin/iuli-plan/list`);
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
                  <Label for="name">
                    <FormattedMessage id="iuli_plans.name" />
                  </Label>
                  <Input
                    id="name"
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({
                      id: 'iuli_plans.name',
                    })}
                  />
                  {formik.errors.name && formik.touched.name ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label for="months_credit">
                    <FormattedMessage id="iuli_plans.months_credit" />
                  </Label>
                  <Input
                    id="months_credit"
                    onBlur={formik.handleBlur}
                    value={formik.values.months_credit}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({
                      id: 'iuli_plans.months_credit',
                    })}
                  />
                  {formik.errors.months_credit &&
                  formik.touched.months_credit ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.months_credit}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="invoices_per_month">
                    <FormattedMessage id="iuli_plans.invoices_per_month" />
                  </Label>
                  <Input
                    id="invoices_per_month"
                    onBlur={formik.handleBlur}
                    value={formik.values.invoices_per_month}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({
                      id: 'iuli_plans.invoices_per_month',
                    })}
                  />
                  {formik.errors.invoices_per_month &&
                  formik.touched.invoices_per_month ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.invoices_per_month}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <PermissionGate permissions="isIuliAdmin">
            <Col
              className="d-flex justify-content-end flex-wrap"
              md={{ size: 6, offset: 3 }}
              sm="12"
            >
              <Button.Ripple
                className="mt-1"
                color="primary"
                disabled={!(formik.isValid && formik.dirty)}
              >
                <FormattedMessage id="button.save" />
              </Button.Ripple>
            </Col>
          </PermissionGate>
        </Row>
      )}
    </Form>
  );
};

IuliPlanForm.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(IuliPlanForm);
