import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  CustomInput,
} from 'reactstrap';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  updateBankAccount,
  createBankAccount,
} from '../../../../services/apis/bank_account.api';
import {
  formatDateToString,
  formatMoney,
  getMonetaryValue,
} from '../../../../utils/formaters';

import BankAccountApiInter from './Integrations/Inter/BankAccountApiInter';

import PermissionGate from '../../../../PermissionGate';

const BankAccountForm = ({ bankAccount, banks }) => {
  const history = useHistory();
  const intl = useIntl();
  const { bank_account_id } = useParams();
  const bankTypes = [
    {
      value: 1,
      label: 'Conta Corrente',
    },
    {
      value: 2,
      label: 'Conta Poupança',
    },
    {
      value: 3,
      label: 'Conta Caixa',
    },
    {
      value: 4,
      label: 'Conta Investimento',
    },
    {
      value: 5,
      label: 'Conta Cartão de crédito',
    },
  ];

  const updateName = () => {
    // if (!formik.touched.name);
    // const selectedBankType = bankTypes.find(type => type.value === formik.values.type);
    // const selectedBank = banks.find(bank => bank.value === formik.values.bank_id);
    // formik.setFieldValue('name', `${selectedBankType?.label} ${selectedBank?.name}`)
  };

  const mountPayload = () => ({
    bankAccount: {
      ...(bank_account_id && { id: bank_account_id }),
      bank_id: formik.values.bank_id,
      type: formik.values.type,
      name: formik.values.name,
      branch: formik.values.branch,
      branch_digit: formik.values.branch_digit,
      account: formik.values.account,
      account_digit: formik.values.account_digit,
      date_initial_balance:
        typeof formik.values.date_initial_balance === 'string'
          ? formik.values.date_initial_balance
          : formatDateToString(formik.values.date_initial_balance[0]),
      initial_balance: formik.values.initial_balance,
      date_initial_balance_ofx:
        typeof formik.values.date_initial_balance_ofx === 'string'
          ? formik.values.date_initial_balance_ofx
          : formatDateToString(formik.values.date_initial_balance_ofx[0]),
      initial_balance_ofx: formik.values.initial_balance_ofx,
      show_on_dashboard: formik.values.show_on_dashboard,
      show_on_conciliation: formik.values.show_on_conciliation,
      is_default_purchase: formik.values.is_default_purchase,
      api_status: formik.values.api_status,
      api_client_id: formik.values.api_client_id,
      api_client_secret: formik.values.api_client_secret,
      api_file_cert_digital: formik.values.arr_api_file_cert_digital?.[0]?.file_path || formik.values.api_file_cert_digital,
      api_file_ssl_key: formik.values.arr_api_file_ssl_key?.[0]?.file_path || formik.values.api_file_ssl_key,
    },
  });

  const onSubmit = async () => {
    if (bank_account_id) {
      await updateBankAccount(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Conta bancária atualizada com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/bank-account/list');
    } else {
      await createBankAccount(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Conta bancária criada com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/bank-account/list');
    }
  };

  const initialValues = {
    bank_id: bankAccount.bank_id || '',
    type: bankAccount.type || '',
    name: bankAccount.name || '',
    is_iuli: bankAccount.is_iuli || '',
    is_hotmart: bankAccount.is_hotmart || '',
    is_pagarme: bankAccount.is_pagarme || '',
    is_eduzz: bankAccount.is_eduzz || '',
    is_provi: bankAccount.is_provi || '',
    is_ticto: bankAccount.is_ticto || '',
    is_kiwify: bankAccount.is_kiwify || '',
    is_tmb: bankAccount.is_tmb || '',
    is_hubla: bankAccount.is_hubla || '',
    is_platform: bankAccount.is_platform || '',
    branch: parseInt(bankAccount.branch) || '',
    branch_digit: bankAccount.branch_digit || '',
    account: parseInt(bankAccount.account) || '',
    account_digit: bankAccount.account_digit || '',
    date_initial_balance: bankAccount.date_initial_balance || '',
    initial_balance: bankAccount.initial_balance || 0,
    date_initial_balance_ofx: bankAccount.date_initial_balance_ofx || '',
    initial_balance_ofx: bankAccount.initial_balance_ofx || 0,
    show_on_dashboard: bankAccount.show_on_dashboard || 0,
    show_on_conciliation: bankAccount.show_on_conciliation || 0,
    is_default_purchase: bankAccount.is_default_purchase || 0,
    api_status: bankAccount.api_status || 0,
    api_client_id: bankAccount.api_client_id || '',
    api_client_secret: bankAccount.api_client_secret || '',
    api_file_cert_digital: bankAccount.api_file_cert_digital || '',
    api_file_ssl_key: bankAccount.api_file_ssl_key || '',
    arr_api_file_cert_digital: [],
    arr_api_file_ssl_key: [],
  };

  let permissionForm = 'bank-accounts.store';
  let permissionButton = 'bank-accounts.store';
  if (bankAccount.bank_id) {
    permissionForm = 'bank-accounts.show';
    permissionButton = 'bank-accounts.update';
  }

  const validationSchema = Yup.object().shape({
    bank_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    type: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    name: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),

    branch: Yup.string().when('is_platform', {
      is: (is_platform) => !is_platform,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string().nullable(),
    }),

    account: Yup.string().when('is_platform', {
      is: (is_platform) => !is_platform,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string().nullable(),
    }),

    date_initial_balance: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <PermissionGate permissions={permissionForm}>
      <Form onSubmit={formik.handleSubmit}>
        <Row className="mt-1">
          <Col className="mt-1" md={{ size: 6, offset: 3 }} sm="12">
            <FormGroup>
              <Label for="bank">
                <FormattedMessage id="bank-account.bank" />
              </Label>
              <Select
                isDisabled={bankAccount.is_platform}
                options={bankAccount.is_platform ? [] : banks}
                className="React"
                classNamePrefix="select"
                id="bank"
                onBlur={formik.handleBlur}
                defaultValue={banks.filter(
                  (bank) => bank.value === formik.initialValues.bank_id
                )}
                onChange={(opt) => {
                  formik.setFieldValue('bank_id', opt.value);
                  updateName();
                }}
              />
              {formik.errors.bank_id && formik.touched.bank_id ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.bank_id}
                </div>
              ) : null}
            </FormGroup>
            {!bankAccount.is_platform && (
              <>
                <FormGroup>
                  <Label for="type">
                    <FormattedMessage id="bank-account.type" />
                  </Label>
                  <Select
                    options={bankTypes}
                    className="React"
                    classNamePrefix="select"
                    id="type"
                    onBlur={formik.handleBlur}
                    defaultValue={bankTypes.filter(
                      (type) => type.value === formik.initialValues.type
                    )}
                    onChange={(opt) => {
                      formik.setFieldValue('type', opt.value);
                      updateName();
                    }}
                  />
                  {formik.errors.type && formik.touched.type ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.type}
                    </div>
                  ) : null}
                </FormGroup>
                <Row>
                  <Col md="8" sm="12">
                    <FormGroup>
                      <Label for="branch">
                        <FormattedMessage id="bank-account.branch" /> *
                      </Label>
                      <Input
                        type="number"
                        id="branch"
                        onBlur={formik.handleBlur}
                        value={formik.values.branch}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: 'bank-account.branch',
                        })}
                      />
                      {formik.errors.branch && formik.touched.branch ? (
                        <div className="invalid-tooltip mt-25">
                          {formik.errors.branch}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="4" sm="12">
                    <FormGroup>
                      <Label for="branch_digit">
                        <FormattedMessage id="bank-account.branch_digit" />
                      </Label>
                      <Input
                        type="number"
                        id="branch_digit"
                        onBlur={formik.handleBlur}
                        value={formik.values.branch_digit}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: 'bank-account.branch_digit',
                        })}
                      />
                      {formik.errors.branch_digit &&
                      formik.touched.branch_digit ? (
                        <div className="invalid-tooltip mt-25">
                          {formik.errors.branch_digit}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="8" sm="12">
                    <FormGroup>
                      <Label for="account">
                        <FormattedMessage id="bank-account.account" /> *
                      </Label>
                      <Input
                        id="account"
                        onBlur={formik.handleBlur}
                        value={formik.values.account}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: 'bank-account.account',
                        })}
                      />
                      {formik.errors.account && formik.touched.account ? (
                        <div className="invalid-tooltip mt-25">
                          {formik.errors.account}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="4" sm="12">
                    <FormGroup>
                      <Label for="account_digit">
                        <FormattedMessage id="bank-account.account_digit" />
                      </Label>
                      <Input
                        id="account_digit"
                        onBlur={formik.handleBlur}
                        value={formik.values.account_digit}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: 'bank-account.account_digit',
                        })}
                      />
                      {formik.errors.account_digit &&
                      formik.touched.account_digit ? (
                        <div className="invalid-tooltip mt-25">
                          {formik.errors.account_digit}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>
              </>
            )}
            <FormGroup>
              <Label for="name">
                <FormattedMessage id="bank-account.name.label" /> *
              </Label>
              <Input
                id="name"
                readOnly={bankAccount.is_platform}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                onChange={formik.handleChange}
                placeholder={intl.formatMessage({
                  id: 'bank-account.name.placeholder',
                })}
              />
              {formik.errors.name && formik.touched.name ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.name}
                </div>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label className="d-block" for="date_initial_balance">
                <FormattedMessage id="bank-account.balance.initial.data" /> *
              </Label>
              <Flatpickr
                disabled={bankAccount.is_iuli}
                id="date_initial_balance"
                className="form-control"
                options={{
                  dateFormat: 'Y-m-d',
                  altFormat: 'd/m/Y',
                  altInput: true,
                }}
                onBlur={formik.handleBlur}
                value={formik.values.date_initial_balance}
                onChange={(date) =>
                  formik.setFieldValue('date_initial_balance', date)
                }
              />
              {formik.errors.date_initial_balance &&
              formik.touched.date_initial_balance ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.date_initial_balance}
                </div>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label for="initialBalance">
                <FormattedMessage id="bank-account.balance.initial" />
              </Label>
              <Input
                readOnly={bankAccount.is_iuli}
                id="initial_balance"
                onBlur={formik.handleBlur}
                value={formatMoney(formik.values.initial_balance)}
                onChange={(e) =>
                  formik.setFieldValue(
                    'initial_balance',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
              />
              {formik.errors.initial_balance &&
              formik.touched.initial_balance ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.initial_balance}
                </div>
              ) : null}
            </FormGroup>            
            <FormGroup>
              <CustomInput
                disabled={bankAccount.is_platform && !bankAccount.is_hotmart}
                type="switch"
                id="show_on_conciliation"
                name="show_on_conciliation"
                inline
                defaultChecked={formik.values.show_on_conciliation}
                onBlur={formik.handleBlur}
                onChange={() =>
                  formik.setFieldValue(
                    'show_on_conciliation',
                    !formik.values.show_on_conciliation
                  )
                }
                value={formik.values.show_on_conciliation}
              >
                <span className="switch-label">
                  {intl.formatMessage({
                    id: 'bank-account.show_on_conciliation',
                  })}
                </span>
              </CustomInput>
            </FormGroup>

            <FormGroup>
              <Label className="d-block" for="date_initial_balance_ofx">
                <FormattedMessage id="bank-account.balance.initial.dataofx" />
              </Label>
              <Flatpickr
                disabled={bankAccount.is_platform && !bankAccount.is_hotmart}
                id="date_initial_balance_ofx"
                className="form-control"
                options={{
                  dateFormat: 'Y-m-d',
                  altFormat: 'd/m/Y',
                  altInput: true,
                }}
                onBlur={formik.handleBlur}
                value={formik.values.date_initial_balance_ofx}
                onChange={(date) =>
                  formik.setFieldValue('date_initial_balance_ofx', date)
                }
              />
              {formik.errors.date_initial_balance_ofx &&
              formik.touched.date_initial_balance_ofx ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.date_initial_balance_ofx}
                </div>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label for="initialBalanceOfx">
                <FormattedMessage id="bank-account.balance.initialofx" />
              </Label>
              <Input
                readOnly={bankAccount.is_platform && !bankAccount.is_hotmart}
                id="initial_balance_ofx"
                onBlur={formik.handleBlur}
                value={formatMoney(formik.values.initial_balance_ofx)}
                onChange={(e) =>
                  formik.setFieldValue(
                    'initial_balance_ofx',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
              />
              {formik.errors.initial_balance_ofx &&
              formik.touched.initial_balance_ofx ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.initial_balance_ofx}
                </div>
              ) : null}
            </FormGroup>

            <FormGroup>
              <CustomInput
                type="switch"
                id="show_on_dashboard"
                name="show_on_dashboard"
                inline
                defaultChecked={formik.values.show_on_dashboard}
                onBlur={formik.handleBlur}
                onChange={() =>
                  formik.setFieldValue(
                    'show_on_dashboard',
                    !formik.values.show_on_dashboard
                  )
                }
                value={formik.values.show_on_dashboard}
              >
                <span className="switch-label">
                  {intl.formatMessage({ id: 'bank-account.show_on_dashboard' })}
                </span>
              </CustomInput>
            </FormGroup>
            <FormGroup>
              <CustomInput
                disabled={bankAccount.is_platform}
                type="switch"
                id="is_default_purchase"
                name="is_default_purchase"
                inline
                defaultChecked={formik.values.is_default_purchase}
                onBlur={formik.handleBlur}
                onChange={() =>
                  formik.setFieldValue(
                    'is_default_purchase',
                    !formik.values.is_default_purchase
                  )
                }
                value={formik.values.is_default_purchase}
              >
                <span className="switch-label">
                  {intl.formatMessage({
                    id: 'bank-account.is_default_purchase',
                  })}
                </span>
              </CustomInput>
            </FormGroup>
            
            {(formik.values.bank_id == 77 && Boolean(formik.values.show_on_conciliation) && 
              <FormGroup>
                <CustomInput
                  disabled={bankAccount.is_platform}
                  type="switch"
                  id="api_status"
                  name="api_status"
                  inline
                  defaultChecked={formik.values.api_status}
                  onBlur={formik.handleBlur}
                  onChange={() =>
                    formik.setFieldValue(
                      'api_status',
                      !formik.values.api_status
                    )
                  }
                  value={formik.values.api_status}
                >
                  <span className="switch-label">
                    {intl.formatMessage({
                      id: 'bank-account.api_status',
                    })}
                  </span>
                </CustomInput>
              </FormGroup>
            )}
            {formik.values.bank_id == 77 && Boolean(formik.values.api_status) && Boolean(formik.values.show_on_conciliation) && (
              <>
                <BankAccountApiInter 
                  formik={formik} 
                  bank_account_id={bank_account_id}
                />
              </>
            )}
          </Col>
          

          {!bankAccount.is_iuli && (
            <PermissionGate permissions={permissionButton}>
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
      </Form>
    </PermissionGate>
    
  );
};

BankAccountForm.propTypes = {
  bankAccount: PropTypes.object.isRequired,
  banks: PropTypes.array.isRequired,
};

BankAccountForm.defaultProps = {};

export default BankAccountForm;
