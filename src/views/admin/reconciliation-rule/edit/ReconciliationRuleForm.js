import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Row, Col, Label, FormGroup, CustomInput } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useIntl, FormattedMessage } from 'react-intl';

import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';
import { fetchSuppliersList } from '../../../../services/apis/supplier.api';
import { fetchClientsList } from '../../../../services/apis/client.api';

import { fetchCategoriesList } from '../../../../services/apis/category.api';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../components/inputs/TextField';
import AddReconciliationConditions from '../../../../components/add-items/AddReconciliationConditions';

const ProductLinkForm = ({ formik, reconciliationRule }) => {
  const intl = useIntl();
  const [payableCategories, setPayableCategories] = useState([]);
  const [receivableCategories, setReceivableCategories] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [clients, setClients] = useState([]);

  const animatedComponents = makeAnimated();

  const ofxTransactionTypes = [
    {
      label: 'Conta a Receber',
      value: 'TRANSACTION_RECEIVED',
    },
    {
      label: 'Conta a Pagar',
      value: 'TRANSACTION_PAID',
    },
    {
      label: 'Transferência Recebida',
      value: 'TRANSFER_RECEIVED',
    },
    {
      label: 'Transferência Enviada',
      value: 'TRANSFER_PAID',
    },
  ];

  const conditionsCriterias = [
    {
      label: 'Todos',
      value: 'AND',
    },
    {
      label: 'Pelo menos um',
      value: 'OR',
    },
  ];

  const priorities = [
    {
      label: '1',
      value: 1,
    },
    {
      label: '2',
      value: 2,
    },
    {
      label: '3',
      value: 3,
    },
    {
      label: '4',
      value: 4,
    },
    {
      label: '5',
      value: 5,
    },
  ];

  const reconciliationTypes = [
    {
      label: 'Sugestão',
      value: 'SUGGESTION',
    },
    {
      label: 'Automática',
      value: 'AUTOMATIC',
    },
  ];

  const getCategories = async (isPayable, callback) => {
    const params = isPayable ? '?type=2' : '?type=1';
    const respCategoriesList = await fetchCategoriesList({ params });
    const dataCategories = respCategoriesList.data || [];
    callback(
      dataCategories.map((category) => ({
        ...category,
        label: category.name,
        value: category.id,
      }))
    );
  };

  const getPayableCategories = async () =>
    getCategories(true, setPayableCategories);

  const getReceivableCategories = async () =>
    getCategories(false, setReceivableCategories);

  const getBankAccounts = async () => {
    const { data: dataBankAccounts } = await fetchBankAccountsList();
    setBankAccounts(
      dataBankAccounts.map((bankAccount) => ({
        ...bankAccount,
        label: bankAccount.name,
        value: bankAccount.id,
      }))
    );
  };

  const getClients = async () => {
    const { data: dataClients } = await fetchClientsList();
    setClients(
      dataClients.map((client) => ({
        ...client,
        label: client.trading_name,
        value: client.id,
      }))
    );
  };

  const getSuppliers = async () => {
    const { data: dataSuppliers } = await fetchSuppliersList();
    setSuppliers(
      dataSuppliers.map((supplier) => ({
        ...supplier,
        label: supplier.trading_name,
        value: supplier.id,
      }))
    );
  };

  const fetchData = async () => {
    await Promise.all([getBankAccounts(), getClients(), getSuppliers()]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    switch (formik.values.ofx_transaction_type) {
      case 'TRANSACTION_PAID':
        if (!payableCategories.lenght) {
          getPayableCategories();
        }
        if (!suppliers.lenght) {
          getSuppliers();
        }
        break;
      case 'TRANSACTION_RECEIVED':
        if (!receivableCategories.lenght) {
          getReceivableCategories();
        }
        if (!clients.lenght) {
          getClients();
        }
        break;
      case 'TRANSFER_RECEIVED':
      case 'TRANSFER_PAID':
        if (!bankAccounts.lenght) {
          getBankAccounts();
        }
        break;
      default:
        break;
    }
  }, [formik.values.ofx_transaction_type]);

  return (
    <Row className="mt-1">
      <Col className="mt-1" md={{ size: 8, offset: 2 }} sm="12">
        <Row>
          {Boolean(reconciliationRule.id) && (
            <Col md="12" sm="12">
              <FormGroup>
                <CustomInput
                  type="switch"
                  id="status"
                  name="status"
                  inline
                  defaultChecked={formik.values.status}
                  onBlur={formik.handleBlur}
                  onChange={() =>
                    formik.setFieldValue('status', !formik.values.status)
                  }
                  value={formik.values.status}
                >
                  <span className="switch-label">
                    {intl.formatMessage({
                      id: 'reconciliation_rules.status',
                    })}
                  </span>
                </CustomInput>
              </FormGroup>
            </Col>
          )}
          <Col md="12" sm="12">
            <FormGroup>
              <Label for="bankAccounts">
                <FormattedMessage id="reconciliation_rules.bank_accounts" /> *
              </Label>
              <Select
                isMulti
                options={bankAccounts}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="bankAccounts"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.bank_accounts_ids}
                closeMenuOnSelect={false}
                onChange={(selectedBankAccounts) => {
                  formik.setFieldValue(
                    'bank_accounts_ids',
                    selectedBankAccounts || []
                  );
                }}
              />
              {formik.errors.bank_accounts_ids &&
              formik.touched.bank_accounts_ids ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.bank_accounts_ids}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col md="12" sm="12">
            <TextField
              id="name"
              required
              onBlur={formik.handleBlur}
              onChange={(e) => formik.setFieldValue('name', e.target.value)}
              value={formik.values.name}
              label={intl.formatMessage({
                id: 'reconciliation_rules.name',
              })}
              error={formik.touched.name && formik.errors.name}
            />
          </Col>
          <Col md="12" sm="12">
            <TextField
              id="description"
              required
              onBlur={formik.handleBlur}
              onChange={(e) =>
                formik.setFieldValue('description', e.target.value)
              }
              value={formik.values.description}
              label={intl.formatMessage({
                id: 'reconciliation_rules.description',
              })}
              error={formik.touched.description && formik.errors.description}
            />
          </Col>
          <Col md="12" sm="12">
            <FormGroup>
              <Label for="ofxTransactionType">
                <FormattedMessage id="reconciliation_rules.ofx_transaction_type" />{' '}
                *
              </Label>
              <Select
                options={ofxTransactionTypes}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="ofxTransactionType"
                onBlur={formik.handleBlur}
                value={ofxTransactionTypes.filter(
                  (_ofxTransactionType) =>
                    _ofxTransactionType.value ===
                    formik.values.ofx_transaction_type
                )}
                onChange={(selectedOfxTransactionType) => {
                  formik.setFieldValue('action.company_id', '');
                  formik.setFieldValue('action.category_id', '');
                  formik.setFieldValue(
                    'ofx_transaction_type',
                    selectedOfxTransactionType.value
                  );
                }}
              />
              {formik.errors.ofx_transaction_type &&
              formik.touched.ofx_transaction_type ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.ofx_transaction_type}
                </div>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
        {formik.values.ofx_transaction_type === 'TRANSACTION_RECEIVED' && (
          <Row>
            <Col md="12" sm="12">
              <FormGroup>
                <Label for="company_id">
                  <FormattedMessage id="reconciliation_rules.client_id" /> *
                </Label>
                <Select
                  options={clients}
                  className="React"
                  classNamePrefix="select"
                  id="company_id"
                  name="company_id"
                  onBlur={formik.handleBlur}
                  value={clients.find(
                    (client) =>
                      client.value === formik.values.action?.company_id
                  )}
                  defaultValue={clients.filter(
                    (client) =>
                      client.value === formik.initialValues.action?.company_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('action.company_id', opt.value);
                  }}
                />
                {formik.errors.action?.company_id &&
                formik.touched.action?.company_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.action?.company_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="12" sm="12">
              <FormGroup>
                <Label for="receivable_category_id">
                  <FormattedMessage id="reconciliation_rules.category_id" /> *
                </Label>
                <Select
                  options={receivableCategories}
                  className="React"
                  classNamePrefix="select"
                  id="receivable_category_id"
                  name="receivable_category_id"
                  onBlur={formik.handleBlur}
                  value={receivableCategories.find(
                    (receivableCategory) =>
                      receivableCategory.value ===
                      formik.values.action?.category_id
                  )}
                  defaultValue={receivableCategories.filter(
                    (receivableCategory) =>
                      receivableCategory.value ===
                      formik.initialValues.action?.category_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('action.category_id', opt.value);
                  }}
                />
                {formik.errors.action?.category_id &&
                formik.touched.action?.category_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.action?.category_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        )}
        {formik.values.ofx_transaction_type === 'TRANSACTION_PAID' && (
          <Row>
            <Col md="12" sm="12">
              <FormGroup>
                <Label for="company_id">
                  <FormattedMessage id="reconciliation_rules.supplier_id" /> *
                </Label>
                <Select
                  options={suppliers}
                  className="React"
                  classNamePrefix="select"
                  id="company_id"
                  name="company_id"
                  onBlur={formik.handleBlur}
                  value={suppliers.find(
                    (supplier) =>
                      supplier.value === formik.values.action?.company_id
                  )}
                  defaultValue={suppliers.filter(
                    (supplier) =>
                      supplier.value === formik.initialValues.action?.company_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('action.company_id', opt.value);
                  }}
                />
                {formik.errors.action?.company_id &&
                formik.touched.action?.company_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.action?.company_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="12" sm="12">
              <FormGroup>
                <Label for="payable_category_id">
                  <FormattedMessage id="reconciliation_rules.category_id" /> *
                </Label>
                <Select
                  options={payableCategories}
                  className="React"
                  classNamePrefix="select"
                  id="payable_category_id"
                  name="payable_category_id"
                  onBlur={formik.handleBlur}
                  value={payableCategories.find(
                    (payableCategory) =>
                      payableCategory.value ===
                      formik.values.action?.category_id
                  )}
                  defaultValue={payableCategories.filter(
                    (payableCategory) =>
                      payableCategory.value ===
                      formik.initialValues.action?.category_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('action.category_id', opt.value);
                  }}
                />
                {formik.errors.action?.category_id &&
                formik.touched.action?.category_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.action?.category_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        )}
        {['TRANSFER_PAID', 'TRANSFER_RECEIVED'].includes(
          formik.values.ofx_transaction_type
        ) && (
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="bank_account_id">
                  <FormattedMessage id="reconciliation_rules.bank_account_id" />{' '}
                  *
                </Label>
                <Select
                  options={bankAccounts}
                  className="React"
                  classNamePrefix="select"
                  id="bank_account_id"
                  name="bank_account_id"
                  onBlur={formik.handleBlur}
                  value={bankAccounts.find(
                    (bankAccount) =>
                      bankAccount.value === formik.values.action.bank_account_id
                  )}
                  defaultValue={bankAccounts.filter(
                    (bankAccount) =>
                      bankAccount.value ===
                      formik.initialValues.action.bank_account_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('action.bank_account_id', opt.value);
                  }}
                />
                {formik.errors.action?.bank_account_id &&
                formik.touched.action?.bank_account_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.bank_account_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="to_bank_account_id">
                  <FormattedMessage id="reconciliation_rules.to_bank_account_id" />{' '}
                  *
                </Label>
                <Select
                  options={bankAccounts}
                  className="React"
                  classNamePrefix="select"
                  id="to_bank_account_id"
                  name="to_bank_account_id"
                  onBlur={formik.handleBlur}
                  value={bankAccounts.find(
                    (bankAccount) =>
                      bankAccount.value ===
                      formik.values.action.to_bank_account_id
                  )}
                  defaultValue={bankAccounts.filter(
                    (bankAccount) =>
                      bankAccount.value ===
                      formik.initialValues.to_bank_account_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue(
                      'action.to_bank_account_id',
                      opt.value
                    );
                  }}
                />
                {formik.errors.action?.to_bank_account_id &&
                formik.touched.action?.to_bank_account_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.action?.to_bank_account_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        )}
        <Row>
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="reconciliationType">
                <FormattedMessage id="reconciliation_rules.reconciliation_type" />{' '}
                *
              </Label>
              <Select
                options={reconciliationTypes}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="reconciliationType"
                onBlur={formik.handleBlur}
                value={reconciliationTypes.filter(
                  (_reconciliationType) =>
                    _reconciliationType.value ===
                    formik.values.action.reconciliation_type
                )}
                onChange={(selectedreconciliationType) => {
                  formik.setFieldValue(
                    'action.reconciliation_type',
                    selectedreconciliationType.value
                  );
                }}
              />
              {formik.errors.action?.reconciliation_type &&
              formik.touched.action?.reconciliation_type ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.action?.reconciliation_type}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="priority">
                <FormattedMessage id="reconciliation_rules.priority" /> *
              </Label>
              <Select
                options={priorities}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="priority"
                onBlur={formik.handleBlur}
                value={priorities.filter(
                  (_priority) => _priority.value === formik.values.priority
                )}
                onChange={(selectedPriority) => {
                  formik.setFieldValue('priority', selectedPriority.value);
                }}
              />
              {formik.errors.priority && formik.touched.priority ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.priority}
                </div>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12" sm="12">
            <FormGroup>
              <Label for="conditionsCriteria">
                <FormattedMessage id="reconciliation_rules.conditions_criteria" />{' '}
                *
              </Label>
              <Select
                options={conditionsCriterias}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="conditionsCriteria"
                onBlur={formik.handleBlur}
                value={conditionsCriterias.filter(
                  (_conditionsCriteria) =>
                    _conditionsCriteria.value ===
                    formik.values.conditions_criteria
                )}
                onChange={(selectedConditionsCriteria) => {
                  formik.setFieldValue(
                    'conditions_criteria',
                    selectedConditionsCriteria.value
                  );
                }}
              />
              {formik.errors.conditions_criteria &&
              formik.touched.conditions_criteria ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.conditions_criteria}
                </div>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm="12" className="my-2">
            <AddReconciliationConditions formik={formik} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

ProductLinkForm.propTypes = {
  formik: PropTypes.object.isRequired,
  reconciliationRule: PropTypes.object.isRequired,
};

export default ProductLinkForm;
