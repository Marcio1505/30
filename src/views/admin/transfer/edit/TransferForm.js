import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Row,
  Col,
  Button,
  Form,
  Label,
  FormGroup,
  CustomInput,
} from 'reactstrap';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';

import { get } from 'lodash';

import SweetAlert from 'react-bootstrap-sweetalert';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import AlertIcon from '../../../../components/alerts/AlertIcon';
import TextField from '../../../../components/inputs/TextField';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';
import {
  showTransfer,
  updateTransfer,
  createTransfer,
  unbindReconciledTransfer,
} from '../../../../services/apis/transfers.api';

import {
  formatDateToString,
  formatMoney,
  getMonetaryValue,
} from '../../../../utils/formaters';

import PermissionGate from '../../../../PermissionGate';

const TransferForm = ({
  currentCompanyId,
  ofxTransaction,
  margemOfxTransaction,
}) => {
  const isConciliating = Boolean(ofxTransaction?.id);
  const history = useHistory();
  const intl = useIntl();
  const { transfer_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [transfer, setTransfer] = useState({});

  const [payedValueInfo, setPayedValueInfo] = useState(null);
  const [payedValueError, setPayedValueError] = useState(null);
  const [showModalSubmit, setshowModalSubmit] = useState(false);
  const [showModalDesvinculed, setShowModalDesvinculed] = useState(false);
  const [desvinculedOfxTransaction, setDesvinculedOfxTransaction] =
    useState(null);

  const isTransferClosed = transfer.id && !transfer.is_editable;

  const mountPayload = () => ({
    transfer: {
      ...(transfer_id && { id: transfer_id }),
      bank_account_id: formik.values.bank_account_id,
      to_bank_account_id: formik.values.to_bank_account_id,
      competency_date:
        typeof formik.values.competency_date === 'string'
          ? formik.values.competency_date
          : formatDateToString(formik.values.competency_date[0]),
      description: formik.values.description,
      fiscal_document_text: formik.values.fiscal_document_text,
      transfer_value: formik.values.transfer_value,
      reconciled: formik.values.reconciled,
      ofx_transaction_id: formik.values.ofx_transaction_id,
    },
  });

  let permissionButton = 'transfers.store';
  if (transfer_id) {
    permissionButton = 'transfers.update';
  }

  const handlePayedValueChange = (e) => {
    const monetaryValue = getMonetaryValue(e.target.value);
    if (isConciliating && monetaryValue < ofxTransaction.margem_value) {
      setPayedValueError('');
      setPayedValueInfo(
        'Atenção! O valor informado é diferente do esperado para a conciliação bancária.'
      );
    } else if (isConciliating && monetaryValue > ofxTransaction.margem_value) {
      setPayedValueInfo('');
      setPayedValueError(
        `Atenção! Não é permitido adicionar transferências com valor maior que o valor do extrato ou da diferença da conciliação. Valor máximo permitido: ${formatMoney(
          ofxTransaction.margem_value
        )}`
      );
    } else {
      setPayedValueInfo(null);
    }
    formik.setFieldValue('transfer_value', monetaryValue);
  };

  const submitTransfer = async () => {
    setshowModalSubmit(false);

    if (transfer_id) {
      await updateTransfer(mountPayload());

      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Transferência atualizada com sucesso',
          hasTimeout: true,
        })
      );
      history.push(`/admin/transfer/list`);
    } else {
      await createTransfer(mountPayload());

      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Transferência criada com sucesso',
          hasTimeout: true,
        })
      );
      if (isConciliating) {
        history.push(
          `/admin/bank-account/${ofxTransaction.bank_account_id}/reconciliation`
        );
      } else {
        history.push(`/admin/transfer/list`);
      }
    }
  };

  const onSubmit = async () => {
    if (isConciliating) {
      setshowModalSubmit(true);
    } else {
      submitTransfer();
    }
  };

  const submitDesvinculed = async () => {
    setShowModalDesvinculed(false);

    const respUnbindReconciledTransfer = await unbindReconciledTransfer({
      id: desvinculedOfxTransaction,
    });

    if (respUnbindReconciledTransfer.statusText === 'OK') {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Transferência desconciliada com sucesso',
          hasTimeout: true,
        })
      );
      history.push(`/admin/transfer/list`);
    }
  };

  const initialValues = {
    to_bank_account_id:
      (ofxTransaction.type == 3 ? ofxTransaction.bank_account_id : null) ||
      transfer.to_bank_account_id ||
      '',
    bank_account_id:
      (ofxTransaction.type == 4 ? ofxTransaction.bank_account_id : null) ||
      transfer.bank_account_id ||
      '',
    competency_date: ofxTransaction.date || transfer.competency_date || '',
    payment_date: transfer.payment_date || '',
    description: ofxTransaction.description || transfer.description || '',
    transfer_value: margemOfxTransaction || transfer.transfer_value || '',
    reconciled: isConciliating ? 1 : transfer.reconciled || '',
    ofx_transaction_id: ofxTransaction?.id || '',
  };

  const validationSchema = Yup.object().shape({
    to_bank_account_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    bank_account_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    competency_date: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    transfer_value: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    description: Yup.string().required(
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
      const { data: dataBankAccounts } = await fetchBankAccountsList();
      setBankAccounts(
        dataBankAccounts.map((bankAccount) => ({
          value: bankAccount.id,
          label: bankAccount.name,
        }))
      );

      let dataTransfer = {};
      if (transfer_id) {
        const res = await showTransfer({ id: transfer_id });
        dataTransfer = res.data;
      }

      setTransfer(dataTransfer);

      setInitialized(true);
    };
    fetchData();
  }, [transfer_id]);

  useEffect(() => {
    if (transfer?.company_id && currentCompanyId !== transfer.company_id) {
      history.push(`/admin/bank-accounts/list`);
    }
  }, [currentCompanyId]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      {initialized && (
        <Row className="mt-1">
          {transfer.is_accrual_period_closed && (
            <Col className="mt-1" sm="12">
              <AlertIcon type="warning">
                Esta tranferência não pode ser alterada, pois ele possui uma
                data de competência e conta bancária em que o período foi
                encerrado.
              </AlertIcon>
            </Col>
          )}
          {transfer.is_cash_period_closed && (
            <Col className="mt-1" sm="12">
              <AlertIcon type="warning">
                Esta tranferência não pode ser alterada, pois ele possui uma
                data de pagamento e conta bancária em que o período foi
                encerrado.
              </AlertIcon>
            </Col>
          )}
          <Col className="mt-1" md="6" sm="12">
            <FormGroup>
              <Label for="bank_account_id">
                <FormattedMessage id="transfers.bank_account" /> *
              </Label>
              <Select
                isDisabled={
                  isTransferClosed ||
                  (formik.values.reconciled && Boolean(!ofxTransaction.id)) ||
                  ofxTransaction.type == 4
                }
                options={bankAccounts}
                className="React"
                classNamePrefix="select"
                id="bank_account_id"
                onBlur={formik.handleBlur}
                defaultValue={bankAccounts.filter(
                  (bank_account) =>
                    bank_account.value === formik.initialValues.bank_account_id
                )}
                onChange={(opt) => {
                  formik.setFieldValue('bank_account_id', opt.value);
                }}
              />
              {formik.errors.bank_account_id &&
              formik.touched.bank_account_id ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.bank_account_id}
                </div>
              ) : null}
            </FormGroup>
          </Col>

          <Col className="mt-1" md="6" sm="12">
            <FormGroup>
              <Label for="to_bank_account_id">
                <FormattedMessage id="transfers.to_bank_account" /> *
              </Label>
              <Select
                isDisabled={
                  isTransferClosed ||
                  (formik.values.reconciled && Boolean(!ofxTransaction.id)) ||
                  ofxTransaction.type == 3
                }
                options={bankAccounts}
                className="React"
                classNamePrefix="select"
                id="to_bank_account_id"
                onBlur={formik.handleBlur}
                defaultValue={bankAccounts.filter(
                  (bank_account) =>
                    bank_account.value ===
                    formik.initialValues.to_bank_account_id
                )}
                onChange={(opt) => {
                  formik.setFieldValue('to_bank_account_id', opt.value);
                }}
              />
              {formik.errors.to_bank_account_id &&
              formik.touched.to_bank_account_id ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.to_bank_account_id}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col md="6" sm="12">
            <FormGroup>
              <Label className="d-block" for="competency_date">
                <FormattedMessage id="transfers.competency_date" /> *
              </Label>
              <Flatpickr
                disabled={isTransferClosed || formik.values.reconciled}
                id="competency_date"
                className="form-control"
                options={{
                  dateFormat: 'Y-m-d',
                  altFormat: 'd/m/Y',
                  maxDate: moment().format('YYYY-MM-DD'),
                  altInput: true,
                }}
                onBlur={() => formik.handleBlur}
                value={formik.values.competency_date}
                onChange={(date) =>
                  formik.setFieldValue('competency_date', date)
                }
              />
              {formik.errors.competency_date &&
              formik.touched.competency_date ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.competency_date}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col md="6" sm="12">
            <TextField
              readOnly={
                isTransferClosed ||
                (formik.values.reconciled && Boolean(!ofxTransaction.id))
              }
              id="transfer_value"
              required
              onBlur={formik.handleBlur}
              value={formatMoney(formik.values.transfer_value)}
              onChange={handlePayedValueChange}
              placeholder="0,00"
              label={intl.formatMessage({ id: 'transfers.transfer_value' })}
              error={
                (get(formik.touched, 'transfer_value') &&
                  get(formik.errors, 'transfer_value')) ||
                (isConciliating && payedValueError)
              }
              warning={payedValueInfo}
            />
          </Col>
          <Col md="6" sm="12">
            <TextField
              id="description"
              required
              readOnly={isTransferClosed}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
              placeholder={`${intl.formatMessage({
                id: 'transfers.description',
              })} *`}
              label={intl.formatMessage({ id: 'transfers.description' })}
              error={
                get(formik.touched, 'description') &&
                get(formik.errors, 'description')
              }
            />
          </Col>

          <PermissionGate permissions="api.companies.bank_accounts.import-ofx">
            <Col md="3" sm="12" className="mb-1">
              <CustomInput
                disabled={
                  isTransferClosed ||
                  !(Boolean(formik.values.reconciled) && !isConciliating)
                }
                type="switch"
                id="reconciled"
                name="reconciled"
                inline
                checked={formik.values.reconciled}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.setFieldValue('reconciled', !formik.values.reconciled);
                  setDesvinculedOfxTransaction(transfer_id);
                  setShowModalDesvinculed(true);
                }}
                value={formik.values.reconciled}
              >
                <span className="switch-label">
                  {intl.formatMessage({
                    id: 'transactions.reconciled',
                  })}
                </span>
              </CustomInput>
            </Col>
          </PermissionGate>

          <PermissionGate permissions={permissionButton}>
            <Col className="d-flex justify-content-end flex-wrap" sm="12">
              <Button.Ripple
                className="mt-1"
                color="primary"
                disabled={
                  isTransferClosed ||
                  !(formik.isValid && formik.dirty) ||
                  (isConciliating && payedValueError) ||
                  formik.values.transfer_value == 0
                }
              >
                {!ofxTransaction.id ? (
                  <FormattedMessage id="button.save" />
                ) : (
                  <PermissionGate permissions="api.companies.bank_accounts.import-ofx">
                    <FormattedMessage id="button.save.reconcile" />
                  </PermissionGate>
                )}
              </Button.Ripple>
            </Col>
          </PermissionGate>
          <div className={showModalDesvinculed ? 'global-dialog' : ''}>
            <SweetAlert
              showCancel
              reverseButtons={false}
              cancelBtnBsStyle="secondary"
              confirmBtnBsStyle="danger"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              warning
              title="Desvincular Conciliação Bancária!"
              show={showModalDesvinculed}
              onConfirm={submitDesvinculed}
              onClose={() => setShowModalDesvinculed(false)}
              onCancel={() => {
                formik.setFieldValue('reconciled', true);
                setShowModalDesvinculed(false);
              }}
            >
              <h4 className="sweet-alert-text my-2">
                Confirma que deseja desvincular esta conciliação?
              </h4>
            </SweetAlert>
          </div>

          <div className={showModalSubmit ? 'global-dialog' : ''}>
            <SweetAlert
              showCancel
              reverseButtons={false}
              cancelBtnBsStyle="secondary"
              confirmBtnBsStyle="danger"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              warning
              title="Criar!"
              show={showModalSubmit}
              onConfirm={submitTransfer}
              onClose={() => setshowModalSubmit(false)}
              onCancel={() => setshowModalSubmit(false)}
            >
              <h4 className="sweet-alert-text my-2">
                A conciliação bancária será efetuada automaticamente. Deseja
                continuar?
              </h4>
            </SweetAlert>
          </div>
        </Row>
      )}
    </Form>
  );
};

TransferForm.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
  ofxTransaction: PropTypes.object,
  margemOfxTransaction: PropTypes.number,
};

TransferForm.defaultProps = {
  ofxTransaction: {},
  margemOfxTransaction: null,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(TransferForm);
