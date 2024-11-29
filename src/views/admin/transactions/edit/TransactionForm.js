import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Row,
  Col,
  Button,
  Label,
  Form,
  FormGroup,
  CustomInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from 'reactstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import Flatpickr from 'react-flatpickr';
import { get } from 'lodash';
import moment from 'moment';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import { useHistory } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import AlertIcon from '../../../../components/alerts/AlertIcon';
import Radio from '../../../../components/@vuexy/radio/RadioVuexy';
import TextField from '../../../../components/inputs/TextField';
import AddProjects from '../../../../components/add-items/AddProjects';
import AddCostCenters from '../../../../components/add-items/AddCostCenters';
import ExternalTextLink from '../../../../components/links/ExternalTextLink';
import TransactionDropzone from './TransactionDropzone';
import ListFiles from '../../files/ListFiles';

import { fetchSelectClients } from '../../../../services/apis/client.api';
import { unbindReconciledTransaction } from '../../../../services/apis/transaction.api';
import { destroyTransactionReceipt } from '../../../../services/apis/transaction_receipt.api';

import { applicationActions } from '../../../../new.redux/actions';
import { store } from '../../../../redux/storeConfig/store';

import {
  formatMoney,
  getMonetaryValue,
  getOnlyNumbers,
} from '../../../../utils/formaters';
import { transactionFrequencies } from '../../../../utils/transactions';

import PermissionGate from '../../../../PermissionGate';

const TransactionForm = ({
  transactionId,
  transaction,
  ofxTransaction,
  saleId,
  transactionType,
  formik,
  showModal,
  toggleModal,
  submitForm,
  suppliers,
  bankAccounts,
  iuliBankAccountId,
  transactionSubcategories,
}) => {
  const [bankAccountInfo, setBankAccountInfo] = useState(null);
  const [payedValueInfo, setPayedValueInfo] = useState(null);
  const [showModalDesvinculed, setShowModalDesvinculed] = useState(false);
  const [desvinculedOfxTransaction, setDesvinculedOfxTransaction] =
    useState(null);
  const [showModalDeleteReceipt, setShowModalDeleteReceipt] = useState(false);
  const [receiptIdToDelete, setReceiptIdToDelete] = useState(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(null);

  const isConciliating = Boolean(ofxTransaction?.id);
  const intl = useIntl();
  const history = useHistory();

  const transactionOrSaleSource =
    formik.initialValues.source || transaction.sale?.source;

  const disableSubmitButton = formik.isSubmitting || isUploadingReceipt;
  const isAsaasTransaction = transaction.is_asaas;
  const isTransactionClosed = transaction.is_closed;
  const canNotUpdateMainAttributes =
    transaction.id && !transaction.can_update_main_attributes;

  const availableBankAccounts = bankAccounts.filter((bankAccount) => {
    if (!isAsaasTransaction) {
      return bankAccount.id !== iuliBankAccountId;
    }
    return true;
  });

  const isReceivedAsaasTransaction = isAsaasTransaction && formik.values.payed;

  const statusAsaasCanBeChangedToReceivedInCash = [
    null,
    1,
    2,
    3,
    4,
    5,
    7,
    8,
    9,
  ].includes(transaction.sale?.status);

  const onChangeBankAccount = (selectedOption) => {
    if (
      transactionType === 'receivable' &&
      isAsaasTransaction &&
      formik.initialValues.bank_account_id === iuliBankAccountId &&
      formik.initialValues.bank_account_id !== selectedOption.value
    ) {
      setBankAccountInfo(
        'Atenção! Ao selecionar uma conta bancária diferente da conta IULI, a cobrança desta conta a receber será excluída.'
      );
    } else {
      setBankAccountInfo(null);
    }
    formik.setFieldValue('bank_account_id', selectedOption.value);
  };

  const handlePayedValueChange = (e) => {
    const monetaryValue = getMonetaryValue(e.target.value);
    if (isConciliating && monetaryValue !== ofxTransaction.margem_value) {
      setPayedValueInfo(
        'Atenção! O valor informado é diferente do esperado para a conciliação bancária.'
      );
    } else {
      setPayedValueInfo(null);
    }
    formik.setFieldValue('payed_value', monetaryValue);
  };

  const getAsyncOptions = async (inputValue) => {
    const { data: dataClients } = await fetchSelectClients({
      params: `?name_or_document=${inputValue}`,
    });
    return new Promise((resolve) => setTimeout(resolve, 1, dataClients));
  };

  const loadOptions = useCallback(
    debounce((inputText, callback) => {
      getAsyncOptions(inputText).then((options) => callback(options));
    }, 1000),
    []
  );

  let permissionForm = '';
  let permissionButton = '';
  let permissionToDeleteFiles = 'receivables.destroy';

  if (transactionType === 'payable') {
    permissionToDeleteFiles = 'payables.destroy';
    if (transactionId) {
      permissionForm = 'payables.show';
      permissionButton = 'payables.update';
    } else {
      permissionForm = 'companies.payables.store';
      permissionButton = 'companies.payables.store';
    }
  } else if (transactionType === 'receivable') {
    if (transactionId) {
      permissionForm = 'receivables.show';
      permissionButton = 'receivables.update';
    } else {
      permissionForm = 'companies.receivables.store';
      permissionButton = 'companies.receivables.store';
    }
  }

  const submitDesvinculed = async () => {
    setShowModalDesvinculed(false);

    const respUnbindReconciledTransaction = await unbindReconciledTransaction({
      id: desvinculedOfxTransaction,
    });

    if (respUnbindReconciledTransaction.statusText === 'OK') {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Transação desconciliada com sucesso',
          hasTimeout: true,
        })
      );
      history.push(`/admin/${transactionType}/list`);
    }
  };

  const handleDeleteReceipt = (receiptId) => {
    setReceiptIdToDelete(receiptId);
    setShowModalDeleteReceipt(true);
  };

  const submitDeleteFile = async () => {
    setShowModalDeleteReceipt(false);
    const respDestroyTransactionFile = await destroyTransactionReceipt({
      id: receiptIdToDelete,
    });
    if (respDestroyTransactionFile.status === 200) {
      const newTransactionReceipts = formik.values.transaction_receipts.filter(
        (transactionReceipt) => transactionReceipt.id !== receiptIdToDelete
      );
      formik.setFieldValue('transaction_receipts', newTransactionReceipts);
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Arquivo excluído com sucesso',
          hasTimeout: true,
        })
      );
    }
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row className="mt-1">
        <Modal
          isOpen={showModal}
          toggle={toggleModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={toggleModal}>Editar</ModalHeader>
          <ModalBody>
            <FormGroup>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Editar este e todos os futuros"
                  name="edit_all"
                  id="edit_all"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value
                />
              </div>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Editar somente este"
                  defaultChecked
                  name="edit_all"
                  id="edit_all"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={false}
                />
              </div>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => submitForm(true)}>
              Editar
            </Button>{' '}
          </ModalFooter>
        </Modal>
        {saleId && (
          <Col className="my-1" sm="12">
            <ExternalTextLink
              url={`/admin/sale/edit/${saleId}`}
              text="Visualizar Venda"
            />
          </Col>
        )}
        {transaction.is_accrual_period_closed && (
          <Col className="mt-1" sm="12">
            <AlertIcon type="warning">
              Esta transação não pode ser alterada, pois ele possui uma data de
              competência e conta bancária em que o período foi encerrado.
            </AlertIcon>
          </Col>
        )}
        {transaction.is_cash_period_closed && (
          <Col className="mt-1" sm="12">
            <AlertIcon type="warning">
              Esta transação não pode ser alterada, pois ele possui uma data de
              pagamento e conta bancária em que o período foi encerrado.
            </AlertIcon>
          </Col>
        )}
        {Boolean(transactionType === 'receivable') && (
          <PermissionGate permissions={permissionForm}>
            <Col className="mt-1" md="6" sm="12">
              <FormGroup>
                <Label for="to_company">
                  <FormattedMessage id="transactions.client" /> *
                </Label>
                <AsyncSelect
                  isDisabled={canNotUpdateMainAttributes}
                  className="React"
                  classNamePrefix="select"
                  id="to_company"
                  onBlur={formik.handleBlur}
                  loadOptions={loadOptions}
                  defaultValue={
                    formik.values.client?.company_name
                      ? {
                          label: `${formik.values.client?.company_name}${
                            formik.values.client?.document
                              ? ` - ${formik.values.client?.document}`
                              : ''
                          }`,
                          value: formik.values.to_company,
                        }
                      : {}
                  }
                  onChange={(opt) => {
                    console.log({ opt });
                    formik.setFieldValue('to_company_id', opt.value);
                    if (opt.category_id) {
                      formik.setFieldValue('category_id', opt.category_id);
                    }
                  }}
                />
                {formik.errors.to_company_id && formik.touched.to_company_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.to_company_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </PermissionGate>
        )}
        {Boolean(transactionType === 'payable') && (
          <PermissionGate permissions={permissionForm}>
            <Col className="mt-1" md="6" sm="12">
              <FormGroup>
                <Label for="to_company">
                  <FormattedMessage id="transactions.supplier" /> *
                </Label>
                <Select
                  isDisabled={canNotUpdateMainAttributes}
                  options={suppliers}
                  className="React"
                  classNamePrefix="select"
                  id="to_company"
                  onBlur={formik.handleBlur}
                  defaultValue={suppliers.filter(
                    (supplier) =>
                      supplier.value === formik.initialValues.to_company_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('to_company_id', opt.value);
                    console.log({ opt });
                    if (opt.category_id) {
                      formik.setFieldValue('category_id', opt.category_id);
                    }
                  }}
                />
                {formik.errors.to_company_id && formik.touched.to_company_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.to_company_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </PermissionGate>
        )}
        <Col className="mt-1" md="6" sm="12">
          <FormGroup>
            <Label for="bank_account_id">
              <FormattedMessage id="transactions.bank_account" /> *
            </Label>
            <Select
              isDisabled={
                isTransactionClosed ||
                isReceivedAsaasTransaction ||
                (isAsaasTransaction &&
                  !statusAsaasCanBeChangedToReceivedInCash) ||
                formik.values.reconciled
              }
              options={availableBankAccounts}
              className="React"
              classNamePrefix="select"
              id="bank_account_id"
              onBlur={formik.handleBlur}
              defaultValue={availableBankAccounts.find(
                (bank_account) =>
                  bank_account.value === formik.initialValues.bank_account_id
              )}
              onChange={(opt) => onChangeBankAccount(opt)}
            />
            {formik.errors.bank_account_id && formik.touched.bank_account_id ? (
              <div className="invalid-tooltip mt-25">
                {formik.errors.bank_account_id}
              </div>
            ) : null}
            {Boolean(bankAccountInfo) && (
              <div className="text-warning mt-25">{bankAccountInfo}</div>
            )}
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label for="transaction_subcategory">
              <FormattedMessage id="transactions.transaction_category" /> *
            </Label>
            <Select
              isDisabled={isTransactionClosed}
              options={transactionSubcategories}
              className="React"
              classNamePrefix="select"
              id="category_id"
              name="category_id"
              onBlur={formik.handleBlur}
              value={transactionSubcategories.find(
                (transactionSubcategory) =>
                  transactionSubcategory.value === formik.values.category_id
              )}
              defaultValue={transactionSubcategories.filter(
                (transactionSubcategory) =>
                  transactionSubcategory.value ===
                  formik.initialValues.category_id
              )}
              onChange={(opt) => {
                formik.setFieldValue('category_id', opt.value);
              }}
            />
            {formik.errors.category_id && formik.touched.category_id ? (
              <div className="invalid-tooltip mt-25">
                {formik.errors.category_id}
              </div>
            ) : null}
          </FormGroup>
        </Col>
        <Col md={formik.values.external_id ? '3' : '6'} sm="12">
          <FormGroup>
            <TextField
              id="source"
              readOnly
              value={
                transactionOrSaleSource === 'UNDEFINED'
                  ? 'NÃO DEFINIDA'
                  : transactionOrSaleSource
              }
              label={intl.formatMessage({
                id: 'transactions.source',
              })}
            />
          </FormGroup>
        </Col>
        {formik.values.external_id && (
          <Col md="3" sm="12">
            <FormGroup>
              <TextField
                id="external_id"
                readOnly
                value={formik.values.external_id}
                placeholder={intl.formatMessage({
                  id: 'transactions.external_id',
                })}
                label={intl.formatMessage({
                  id: 'transactions.external_id',
                })}
              />
            </FormGroup>
          </Col>
        )}
        <Col md="6" sm="12">
          <FormGroup>
            <Label className="d-block" for="due_date">
              <FormattedMessage id="transactions.due_date" /> *
            </Label>
            <Flatpickr
              disabled={canNotUpdateMainAttributes}
              id="due_date"
              className="form-control"
              options={{
                dateFormat: 'Y-m-d',
                altFormat: 'd/m/Y',
                altInput: true,
              }}
              onBlur={() => formik.handleBlur}
              value={formik.values.due_date}
              onChange={(date) => formik.setFieldValue('due_date', date)}
            />
            {formik.errors.due_date && formik.touched.due_date ? (
              <div className="invalid-tooltip mt-25">
                {formik.errors.due_date}
              </div>
            ) : null}
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label className="d-block" for="competency_date">
              <FormattedMessage id="transactions.competency_date" /> *
            </Label>
            <Flatpickr
              id="competency_date"
              className="form-control"
              options={{
                dateFormat: 'Y-m-d',
                altFormat: 'd/m/Y',
                altInput: true,
              }}
              disabled={isTransactionClosed}
              onBlur={() => formik.handleBlur}
              value={formik.values.competency_date}
              onChange={(date) => formik.setFieldValue('competency_date', date)}
            />
            {formik.errors.competency_date && formik.touched.competency_date ? (
              <div className="invalid-tooltip mt-25">
                {formik.errors.competency_date}
              </div>
            ) : null}
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <TextField
            readOnly={canNotUpdateMainAttributes}
            id="transaction_value"
            required
            onBlur={formik.handleBlur}
            value={formatMoney(formik.values.transaction_value)}
            onChange={(e) =>
              formik.setFieldValue(
                'transaction_value',
                getMonetaryValue(e.target.value)
              )
            }
            placeholder="0,00"
            label={intl.formatMessage({
              id: 'transactions.transaction_value',
            })}
            error={
              get(formik.touched, 'transaction_value') &&
              get(formik.errors, 'transaction_value')
            }
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            readOnly={canNotUpdateMainAttributes}
            id="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            placeholder={intl.formatMessage({
              id: 'transactions.description',
            })}
            label={intl.formatMessage({ id: 'transactions.description' })}
            error={
              get(formik.touched, 'description') &&
              get(formik.errors, 'description')
            }
          />
        </Col>
        <Col md="12" sm="12">
          <TextField
            readOnly={canNotUpdateMainAttributes}
            id="fiscal_document_text"
            required
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.fiscal_document_text}
            placeholder={`${intl.formatMessage({
              id: 'transactions.fiscal_document_text',
            })} *`}
            label={intl.formatMessage({
              id: 'transactions.fiscal_document_text',
            })}
            error={
              get(formik.touched, 'fiscal_document_text') &&
              get(formik.errors, 'fiscal_document_text')
            }
          />
        </Col>
        <Col md="12" sm="12">
          <TextField
            readOnly={canNotUpdateMainAttributes}
            id="payment_info"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.payment_info}
            placeholder={`${intl.formatMessage({
              id: 'transactions.payment_info',
            })}`}
            label={intl.formatMessage({
              id: 'transactions.payment_info',
            })}
            error={
              get(formik.touched, 'payment_info') &&
              get(formik.errors, 'payment_info')
            }
          />
        </Col>
        {Boolean(!transactionId) && (
          <>
            <Col sm="12" className="mb-1">
              <CustomInput
                type="switch"
                id="repeat"
                name="repeat"
                inline
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue('repeat', !formik.values.repeat)
                }
                value={formik.values.repeat}
              >
                <span className="switch-label">
                  {intl.formatMessage({ id: 'transactions.repeat' })}
                </span>
              </CustomInput>
            </Col>
            {Boolean(formik.values.repeat) && (
              <>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="frequency">
                      <FormattedMessage id="transactions.frequency" /> *
                    </Label>
                    <Select
                      options={transactionFrequencies}
                      className="React"
                      classNamePrefix="select"
                      id="frequency"
                      onBlur={formik.handleBlur}
                      defaultValue={transactionFrequencies.filter(
                        (frequency) =>
                          frequency.value === formik.initialValues.frequency
                      )}
                      onChange={(opt) => {
                        formik.setFieldValue('frequency', opt.value);
                      }}
                    />
                    {formik.errors.frequency && formik.touched.frequency ? (
                      <div className="invalid-tooltip mt-25">
                        {formik.errors.frequency}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <TextField
                    id="occurrences"
                    onBlur={formik.handleBlur}
                    onChange={(e) =>
                      formik.setFieldValue(
                        'occurrences',
                        getOnlyNumbers(e.target.value)
                      )
                    }
                    value={getOnlyNumbers(formik.values.occurrences)}
                    placeholder={intl.formatMessage({
                      id: 'transactions.occurrences',
                    })}
                    label={intl.formatMessage({
                      id: 'transactions.occurrences',
                    })}
                    error={
                      get(formik.touched, 'occurrences') &&
                      get(formik.errors, 'occurrences')
                    }
                  />
                </Col>
              </>
            )}
          </>
        )}
        <Col sm="12" className="mb-1">
          <CustomInput
            disabled={canNotUpdateMainAttributes}
            type="switch"
            id="payed"
            name="payed"
            inline
            checked={formik.values.payed}
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('payed', !formik.values.payed)
            }
            value={formik.values.payed}
          >
            <span className="switch-label">
              {intl.formatMessage({
                id:
                  transactionType === 'payable'
                    ? 'transactions.payed_payable'
                    : transactionType === 'receivable'
                    ? 'transactions.payed_receivable'
                    : '',
              })}
            </span>
          </CustomInput>
        </Col>
        <PermissionGate permissions="api.companies.bank_accounts.import-ofx">
          <Col sm="12" className="mb-1">
            <CustomInput
              disabled={
                isTransactionClosed ||
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
                setDesvinculedOfxTransaction(transactionId);
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
        {Boolean(formik.values.payed) && (
          <>
            <Col md="4" sm="12">
              <FormGroup>
                <Label className="d-block" for="payment_date">
                  <FormattedMessage
                    id={
                      transactionType === 'payable'
                        ? 'transactions.payment_date_payable'
                        : transactionType === 'receivable'
                        ? 'transactions.payment_date_receivable'
                        : ''
                    }
                  />
                </Label>
                <Flatpickr
                  id="payment_date"
                  disabled={canNotUpdateMainAttributes}
                  className="form-control"
                  options={{
                    dateFormat: 'Y-m-d',
                    altFormat: 'd/m/Y',
                    maxDate: moment().format('YYYY-MM-DD'),
                    altInput: true,
                  }}
                  onBlur={() => formik.handleBlur}
                  value={formik.values.payment_date}
                  onChange={(date) =>
                    formik.setFieldValue('payment_date', date)
                  }
                />
                {formik.errors.payment_date && formik.touched.payment_date ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.payment_date}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="4" sm="12">
              <TextField
                id="payed_value"
                readOnly={canNotUpdateMainAttributes}
                required
                onBlur={formik.handleBlur}
                onChange={handlePayedValueChange}
                value={formatMoney(formik.values.payed_value)}
                placeholder={intl.formatMessage({
                  id:
                    transactionType === 'payable'
                      ? 'transactions.payed_value_payable'
                      : transactionType === 'receivable'
                      ? 'transactions.payed_value_receivable'
                      : '',
                })}
                label={intl.formatMessage({
                  id:
                    transactionType === 'payable'
                      ? 'transactions.payed_value_payable'
                      : transactionType === 'receivable'
                      ? 'transactions.payed_value_receivable'
                      : '',
                })}
                error={
                  get(formik.touched, 'payed_value') &&
                  get(formik.errors, 'payed_value')
                }
                warning={payedValueInfo}
              />
            </Col>
            <Col md="4" sm="12">
              <TextField
                id="interest_value"
                readOnly
                inputProps={{
                  readOnly: true,
                }}
                onBlur={formik.handleBlur}
                value={formatMoney(
                  formik.values.payed_value - formik.values.transaction_value
                )}
                onChange={(e) =>
                  formik.setFieldValue(
                    'interest_value',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
                label={intl.formatMessage({
                  id: 'transactions.interest_value',
                })}
                error={
                  get(formik.touched, 'interest_value') &&
                  get(formik.errors, 'interest_value')
                }
              />
            </Col>
          </>
        )}
        <Col sm="12" className="mb-1">
          <CustomInput
            disabled={isTransactionClosed}
            type="switch"
            id="show_dfc"
            name="show_dfc"
            inline
            onBlur={formik.handleBlur}
            onChange={() =>
              formik.setFieldValue('show_dfc', !formik.values.show_dfc)
            }
            checked={formik.values.show_dfc}
            value={formik.values.show_dfc}
          >
            <span className="switch-label">
              {intl.formatMessage({ id: 'transactions.show_dfc' })}
            </span>
          </CustomInput>
        </Col>
        <Col sm="12" className="mb-1">
          <CustomInput
            disabled={isTransactionClosed}
            type="switch"
            id="show_dre"
            name="show_dre"
            inline
            onBlur={formik.handleBlur}
            onChange={() =>
              formik.setFieldValue('show_dre', !formik.values.show_dre)
            }
            checked={formik.values.show_dre}
            value={formik.values.show_dre}
          >
            <span className="switch-label">
              {intl.formatMessage({ id: 'transactions.show_dre' })}
            </span>
          </CustomInput>
        </Col>
        <Col sm="12" className="my-2">
          <AddProjects formik={formik} />
        </Col>
        <Col sm="12" className="my-2">
          <AddCostCenters formik={formik} />
        </Col>
        <Col sm="12" className="my-2">
          <ListFiles
            allFiles={formik.values.transaction_receipts}
            handleDeleteFile={handleDeleteReceipt}
            canDeleteFiles={!isTransactionClosed}
            permissionToDeleteFiles={permissionToDeleteFiles}
          />
        </Col>
        <Col sm="12" className="my-2">
          <TransactionDropzone
            formik={formik}
            setIsUploadingFile={setIsUploadingReceipt}
          />
        </Col>
        <Col className="d-flex justify-content-end flex-wrap" sm="12">
          <PermissionGate permissions={permissionButton}>
            <Button.Ripple
              className="mt-1"
              color="primary"
              disabled={isTransactionClosed || disableSubmitButton}
            >
              {disableSubmitButton && (
                <div className="d-flex align-items-center">
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    color="white"
                  />
                  <span className="pl-1">Carregando ...</span>
                </div>
              )}
              {Boolean(!disableSubmitButton && !ofxTransaction.id) && (
                <FormattedMessage id="button.save" />
              )}
              {Boolean(!disableSubmitButton && ofxTransaction.id) && (
                <FormattedMessage id="button.save.reconcile" />
              )}
            </Button.Ripple>
          </PermissionGate>
        </Col>
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
        <div className={showModalDeleteReceipt ? 'global-dialog' : ''}>
          <SweetAlert
            showCancel
            reverseButtons={false}
            cancelBtnBsStyle="secondary"
            confirmBtnBsStyle="danger"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            warning
            title="O arquivo será excluído!"
            show={showModalDeleteReceipt}
            onConfirm={submitDeleteFile}
            onClose={() => setShowModalDeleteReceipt(false)}
            onCancel={() => setShowModalDeleteReceipt(false)}
          >
            <h4 className="sweet-alert-text my-2">
              Confirma que deseja excluir este arquivo?
            </h4>
          </SweetAlert>
        </div>
      </Row>
    </Form>
  );
};

TransactionForm.propTypes = {
  transactionId: PropTypes.string || PropTypes.number,
  transaction: PropTypes.object,
  ofxTransaction: PropTypes.object,
  saleId: PropTypes.string || PropTypes.number,
  transactionType: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  suppliers: PropTypes.array.isRequired,
  bankAccounts: PropTypes.array.isRequired,
  iuliBankAccountId: PropTypes.number,
  transactionSubcategories: PropTypes.array.isRequired,
};

TransactionForm.defaultProps = {
  transactionId: null,
  transaction: {},
  ofxTransaction: {},
  saleId: null,
  iuliBankAccountId: null,
};

export default TransactionForm;
