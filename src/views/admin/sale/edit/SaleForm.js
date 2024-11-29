import React, { useEffect, useCallback, useRef } from 'react';
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
} from 'reactstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import Flatpickr from 'react-flatpickr';
import { get } from 'lodash';
import moment from 'moment';
import debounce from 'lodash/debounce';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import AlertIcon from '../../../../components/alerts/AlertIcon';
import TextField from '../../../../components/inputs/TextField';
import AddProjects from '../../../../components/add-items/AddProjects';
import AddCostCenters from '../../../../components/add-items/AddCostCenters';
import ExternalTextLink from '../../../../components/links/ExternalTextLink';

import {
  formatMoney,
  getMonetaryValue,
  formatDateToString,
} from '../../../../utils/formaters';
import { fetchSelectClients } from '../../../../services/apis/client.api';
import { fetchSelectSuppliers } from '../../../../services/apis/supplier.api';

import PermissionGate from '../../../../PermissionGate';

const SaleForm = ({
  saleId,
  sale,
  isSourceName,
  isAsaasSale,
  formik,
  bankAccounts,
  products,
  transactionSubcategories,
  paymentTypes,
  paymentMethods,
  availableStatus,
}) => {
  const isSourceDisabled =
    isSourceName === 'HOTMART' ||
    isSourceName === 'GURUPAGARME' ||
    isSourceName === 'GURU2PAGARME2' ||
    isSourceName === 'GURUEDUZZ' ||
    isSourceName === 'PROVI' ||
    isSourceName === 'EDUZZ' ||
    isSourceName === 'TICTO' ||
    isSourceName === 'KIWIFY' ||
    isSourceName === 'HUBLA' ||
    isSourceName === 'DOMINIO' ||
    isSourceName === 'TMB';

  const isSaleClosed = sale.id && !sale.is_editable;

  const intl = useIntl();
  const firstLoadDueDate = useRef(true);
  const firstLoadCompetencyDate = useRef(true);

  const installmentNumbers = [];
  for (let i = 2; i <= 36; i++) {
    installmentNumbers.push({
      value: i,
      label: i,
    });
  }

  const optionsOcurrences = [];
  for (let i = 2; i <= 36; i++) {
    optionsOcurrences.push({
      value: i,
      label: i,
    });
  }

  let permissionForm = 'companies.sales.store';
  let permissionButton = 'companies.sales.store';

  if (sale.id) {
    permissionForm = 'sales.show';
    permissionButton = 'sales.update.unico';
  }

  useEffect(() => {
    if (!firstLoadCompetencyDate.current) {
      for (let i = 1; i <= formik.values.installment_number; i++) {
        formik.setFieldValue(
          `installments[${i}].competency_date`,
          formatDateToString(
            formik.values.installments?.[0]?.competency_date?.[0]
          )
        );
      }
    } else {
      firstLoadCompetencyDate.current = false;
    }
  }, [formik.values.installments?.[0]?.competency_date]);

  useEffect(() => {
    if (!firstLoadDueDate.current) {
      for (let i = 1; i <= formik.values.installment_number; i++) {
        formik.setFieldValue(
          `installments[${i}].due_date`,
          moment(
            formatDateToString(formik.values.installments?.[0]?.due_date?.[0])
          )
            .add(i, 'month')
            .format('YYYY-MM-DD')
        );
      }
    } else {
      firstLoadDueDate.current = false;
    }
  }, [formik.values.installments?.[0]?.due_date]);

  useEffect(() => {
    formik.setFieldValue(
      'total_value',
      formik.values.quantity * formik.values.product_price
      // formik.values.quantity * formik.values.total_value //-> importação allan
    );
  }, [formik.values.quantity, formik.values.product_price]);
  // }, [formik.values.quantity, formik.values.total_value]);  //-> importação allan

  useEffect(() => {
    const installmentNumber = formik.values.installment_number;
    // const totalValue = formik.values.total_value;
    const finalValue = formik.values.final_value;
    if (finalValue && installmentNumber) {
      for (let index = 0; index <= installmentNumber; index++) {
        formik.setFieldValue(
          `installments[${index}].transaction_value`,
          (finalValue / installmentNumber).toFixed(2)
        );
      }
    }
  }, [formik.values.installment_number, formik.values.total_value]);

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

  const getAsyncOptionsSuppliers = async (inputValue) => {
    const { data: dataSuppliers } = await fetchSelectSuppliers({
      params: `?name_or_document=${inputValue}`,
    });
    return new Promise((resolve) => setTimeout(resolve, 1, dataSuppliers));
  };

  const loadOptionsSupplier = useCallback(
    debounce((inputText, callback) => {
      getAsyncOptionsSuppliers(inputText).then((options) => callback(options));
    }, 1000),
    []
  );

  return (
    <>
      <PermissionGate permissions={permissionForm}>
        <Form onSubmit={formik.handleSubmit}>
          <Row className="mt-1">
            {sale.is_accrual_period_closed && (
              <Col className="mt-1" sm="12">
                <AlertIcon type="warning">
                  Esta venda não pode ser alterada, pois ele possui uma data de
                  competência e conta bancária em que o período foi encerrado.
                </AlertIcon>
              </Col>
            )}
            {sale.is_cash_period_closed && (
              <Col className="mt-1" sm="12">
                <AlertIcon type="warning">
                  Esta venda não pode ser alterada, pois ele possui uma data de
                  pagamento e conta bancária em que o período foi encerrado.
                </AlertIcon>
              </Col>
            )}
            <Col className="mt-1" md="6" sm="12">
              <FormGroup>
                <Label for="client">
                  <FormattedMessage id="sales.client_id" /> *
                </Label>
                <AsyncSelect
                  className="React"
                  classNamePrefix="select"
                  id="client"
                  isDisabled={isSaleClosed || isSourceDisabled}
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
                          value: formik.values.client_id,
                        }
                      : {}
                  }
                  onChange={(opt) => {
                    formik.setFieldValue('client_id', opt.value);
                    if (opt.category_id) {
                      formik.setFieldValue('category_id', opt.category_id);
                    }
                  }}
                />
                {formik.errors.client_id && formik.touched.client_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.client_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col className="mt-1" md="6" sm="12">
              <FormGroup>
                <Label for="bank_account_id">
                  <FormattedMessage id="sales.bank_account_id" /> *
                </Label>
                <Select
                  isDisabled={isSaleClosed || isAsaasSale || isSourceDisabled}
                  options={bankAccounts}
                  className="React"
                  classNamePrefix="select"
                  id="bank_account_id"
                  onBlur={formik.handleBlur}
                  defaultValue={bankAccounts.filter(
                    (bank_account) =>
                      bank_account.value ===
                      formik.initialValues.bank_account_id
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
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="sales.product_id">
                  <FormattedMessage id="sales.product_id" /> *
                </Label>
                <Select
                  isDisabled={isSaleClosed || isAsaasSale || isSourceDisabled}
                  options={products}
                  className="React"
                  classNamePrefix="select"
                  id="product_id"
                  name="product_id"
                  onBlur={formik.handleBlur}
                  value={products.find(
                    (transactionSubcategory) =>
                      transactionSubcategory.value === formik.values.product_id
                  )}
                  defaultValue={products.filter(
                    (transactionSubcategory) =>
                      transactionSubcategory.value ===
                      formik.initialValues.product_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('product_id', opt.value);
                  }}
                />
                {formik.errors.product_id && formik.touched.product_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.product_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <TextField
                readOnly={isSaleClosed || isAsaasSale || isSourceDisabled}
                id="quantity"
                type="number"
                required
                onBlur={formik.handleBlur}
                onChange={async (e) => {
                  await formik.setFieldValue('quantity', e.target.value);
                }}
                value={formik.values.quantity}
                placeholder={`${intl.formatMessage({
                  id: 'sales.quantity',
                })} *`}
                label={intl.formatMessage({ id: 'sales.quantity' })}
                error={
                  get(formik.touched, 'quantity') &&
                  get(formik.errors, 'quantity')
                }
              />
            </Col>
            <Col md="6" sm="12">
              <TextField
                readOnly={isSaleClosed || isAsaasSale || isSourceDisabled}
                id="product_price"
                required
                onBlur={formik.handleBlur}
                value={formatMoney(formik.values.product_price)}
                onChange={async (e) => {
                  await formik.setFieldValue(
                    'product_price',
                    getMonetaryValue(e.target.value)
                  );
                }}
                placeholder="0,00"
                label={intl.formatMessage({
                  id: 'sales.product_price',
                })}
                error={
                  get(formik.touched, 'product_price') &&
                  get(formik.errors, 'product_price')
                }
              />
            </Col>
            <Col md="3" sm="12">
              <TextField
                id="total_value"
                required
                readOnly
                value={formatMoney(
                  formik.values.product_price * formik.values.quantity
                  // formik.values.total_value * formik.values.quantity  //-> importação allan
                )}
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue(
                    'total_value',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
                label={intl.formatMessage({
                  id: 'sales.total_value',
                })}
                error={
                  get(formik.touched, 'total_value') &&
                  get(formik.errors, 'total_value')
                }
              />
            </Col>
            <Col md="3" sm="12">
              <TextField
                id="final_value"
                required
                readOnly
                value={formatMoney(
                  formik.values.final_value * formik.values.quantity
                  // ver com Flavio porque final_value é o preço final pago e não deveria multiplicar pela quantidade
                )}
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue(
                    'final_value',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
                label={`${intl.formatMessage({
                  id: 'sales.total_value',
                })} com Juros`}
                error={
                  get(formik.touched, 'total_value') &&
                  get(formik.errors, 'total_value')
                }
              />
            </Col>
            <Col md="6" sm="12">
              <TextField
                readOnly={isSaleClosed || isAsaasSale || isSourceDisabled}
                id="plataform_value"
                onBlur={formik.handleBlur}
                value={formatMoney(formik.values.plataform_value)}
                onChange={(e) =>
                  formik.setFieldValue(
                    'plataform_value',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
                label={intl.formatMessage({
                  id: 'sales.plataform_value',
                })}
                error={
                  get(formik.touched, 'plataform_value') &&
                  get(formik.errors, 'plataform_value')
                }
              />
            </Col>
            <Col md="6" sm="12">
              {Boolean(formik.values.plataform_value) && (
                <FormGroup>
                  <Label for="supplier_plataform">
                    <FormattedMessage id="sales.supplier_plataform_id" /> *
                  </Label>
                  <AsyncSelect
                    isDisabled={isSaleClosed}
                    className="React"
                    classNamePrefix="select"
                    id="supplier_plataform"
                    onBlur={formik.handleBlur}
                    loadOptions={loadOptionsSupplier}
                    defaultValue={
                      formik.values.supplier_plataform?.company_name
                        ? {
                            label: `${
                              formik.values.supplier_plataform?.company_name
                            }${
                              formik.values.supplier_plataform?.document
                                ? ` - ${formik.values.supplier_plataform?.document}`
                                : ''
                            }`,
                            value: formik.values.supplier_plataform_id,
                          }
                        : {}
                    }
                    onChange={(opt) =>
                      formik.setFieldValue('supplier_plataform_id', opt.value)
                    }
                  />
                  {formik.errors.supplier_plataform_id &&
                  formik.touched.supplier_plataform_id ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.supplier_plataform_id}
                    </div>
                  ) : null}
                </FormGroup>
              )}
            </Col>
            <Col md="6" sm="12">
              <TextField
                readOnly={isSaleClosed || isAsaasSale || isSourceDisabled}
                id="advance_value"
                onBlur={formik.handleBlur}
                value={formatMoney(formik.values.advance_value)}
                onChange={(e) =>
                  formik.setFieldValue(
                    'advance_value',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
                label={intl.formatMessage({
                  id: 'sales.advance_value',
                })}
                error={
                  get(formik.touched, 'advance_value') &&
                  get(formik.errors, 'advance_value')
                }
              />
            </Col>
            <Col md="6" sm="12">
              {Boolean(formik.values.advance_value) && (
                <FormGroup>
                  <Label for="supplier_advance">
                    <FormattedMessage id="sales.supplier_advance_id" /> *
                  </Label>
                  <AsyncSelect
                    isDisabled={isSaleClosed}
                    className="React"
                    classNamePrefix="select"
                    id="supplier_advance"
                    onBlur={formik.handleBlur}
                    loadOptions={loadOptionsSupplier}
                    defaultValue={
                      formik.values.supplier_advance?.company_name
                        ? {
                            label: `${
                              formik.values.supplier_advance?.company_name
                            }${
                              formik.values.supplier_advance?.document
                                ? ` - ${formik.values.supplier_advance?.document}`
                                : ''
                            }`,
                            value: formik.values.supplier_advance_id,
                          }
                        : {}
                    }
                    onChange={(opt) =>
                      formik.setFieldValue('supplier_advance_id', opt.value)
                    }
                  />
                  {formik.errors.supplier_advance_id &&
                  formik.touched.supplier_advance_id ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.supplier_advance_id}
                    </div>
                  ) : null}
                </FormGroup>
              )}
            </Col>
            <Col md="6" sm="12">
              <TextField
                readOnly={isSaleClosed || isAsaasSale || isSourceDisabled}
                id="streaming_value"
                onBlur={formik.handleBlur}
                value={formatMoney(formik.values.streaming_value)}
                onChange={(e) =>
                  formik.setFieldValue(
                    'streaming_value',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
                label={intl.formatMessage({
                  id: 'sales.streaming_value',
                })}
                error={
                  get(formik.touched, 'streaming_value') &&
                  get(formik.errors, 'streaming_value')
                }
              />
            </Col>
            <Col md="6" sm="12">
              {Boolean(formik.values.streaming_value) && (
                <FormGroup>
                  <Label for="supplier_streaming">
                    <FormattedMessage id="sales.supplier_streaming_id" /> *
                  </Label>
                  <AsyncSelect
                    isDisabled={isSaleClosed}
                    className="React"
                    classNamePrefix="select"
                    id="supplier_streaming"
                    onBlur={formik.handleBlur}
                    loadOptions={loadOptionsSupplier}
                    defaultValue={
                      formik.values.supplier_streaming?.company_name
                        ? {
                            label: `${
                              formik.values.supplier_streaming?.company_name
                            }${
                              formik.values.supplier_streaming?.document
                                ? ` - ${formik.values.supplier_streaming?.document}`
                                : ''
                            }`,
                            value: formik.values.supplier_streaming_id,
                          }
                        : {}
                    }
                    onChange={(opt) =>
                      formik.setFieldValue('supplier_streaming_id', opt.value)
                    }
                  />
                  {formik.errors.supplier_streaming_id &&
                  formik.touched.supplier_streaming_id ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.supplier_streaming_id}
                    </div>
                  ) : null}
                </FormGroup>
              )}
            </Col>
            <Col md="6" sm="12">
              <TextField
                readOnly={isSaleClosed || isAsaasSale || isSourceDisabled}
                id="commission_value"
                onBlur={formik.handleBlur}
                value={formatMoney(formik.values.commission_value)}
                onChange={(e) =>
                  formik.setFieldValue(
                    'commission_value',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
                label={intl.formatMessage({
                  id: 'sales.commission_value',
                })}
                error={
                  get(formik.touched, 'commission_value') &&
                  get(formik.errors, 'commission_value')
                }
              />
            </Col>
            <Col md="6" sm="12">
              {Boolean(formik.values.commission_value) && (
                <FormGroup>
                  <Label for="supplier_commission">
                    <FormattedMessage id="sales.supplier_commission_id" /> *
                  </Label>
                  <AsyncSelect
                    isDisabled={isSaleClosed}
                    className="React"
                    classNamePrefix="select"
                    id="supplier_commission"
                    onBlur={formik.handleBlur}
                    loadOptions={loadOptionsSupplier}
                    defaultValue={
                      formik.values.supplier_commission?.company_name
                        ? {
                            label: `${
                              formik.values.supplier_commission?.company_name
                            }${
                              formik.values.supplier_commission?.document
                                ? ` - ${formik.values.supplier_commission?.document}`
                                : ''
                            }`,
                            value: formik.values.supplier_commission_id,
                          }
                        : {}
                    }
                    onChange={(opt) =>
                      formik.setFieldValue('supplier_commission_id', opt.value)
                    }
                  />
                  {formik.errors.supplier_commission_id &&
                  formik.touched.supplier_commission_id ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.supplier_commission_id}
                    </div>
                  ) : null}
                </FormGroup>
              )}
            </Col>
            <Col md="6" sm="12">
              <TextField
                id="net_value"
                required
                readOnly
                onBlur={formik.handleBlur}
                value={
                  // formatMoney(formik.values.net_value)}  //-> importação allan
                  formik.values.final_value > 0
                    ? formatMoney(
                        formik.values.final_value -
                          (formik.values.plataform_value +
                            formik.values.advance_value +
                            formik.values.streaming_value +
                            // formik.values.commission_value_coproduct +
                            formik.values.commission_value)
                      )
                    : formatMoney(
                        formik.values.product_price * formik.values.quantity -
                          (formik.values.plataform_value +
                            formik.values.advance_value +
                            formik.values.streaming_value +
                            // formik.values.commission_value_coproduct +
                            formik.values.commission_value)
                      )
                }
                onChange={(e) =>
                  formik.setFieldValue(
                    'net_value',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
                label={intl.formatMessage({
                  id: 'sales.net_value',
                })}
                error={
                  get(formik.touched, 'net_value') &&
                  get(formik.errors, 'net_value')
                }
              />
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="status">
                  <FormattedMessage id="sales.status" /> *
                </Label>
                <Select
                  isDisabled={isSaleClosed || isAsaasSale || isSourceDisabled}
                  options={availableStatus}
                  className="React"
                  classNamePrefix="select"
                  id="status"
                  name="status"
                  onBlur={formik.handleBlur}
                  value={availableStatus.find(
                    (status) => status.value === formik.values.status
                  )}
                  defaultValue={availableStatus.filter(
                    (status) => status.value === formik.initialValues.status
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('status', opt.value);
                  }}
                />
                {formik.errors.status && formik.touched.status ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.status}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="transaction_subcategory">
                  <FormattedMessage id="sales.transaction_category_id" /> *
                </Label>
                <Select
                  isDisabled={isSaleClosed}
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
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="payment_method_id">
                  <FormattedMessage id="sales.payment_method_id" /> *
                </Label>
                <Select
                  isDisabled={isSaleClosed || isAsaasSale || isSourceDisabled}
                  options={paymentMethods}
                  className="React"
                  classNamePrefix="select"
                  id="payment_method_id"
                  name="payment_method_id"
                  onBlur={formik.handleBlur}
                  value={paymentMethods.find(
                    (transactionSubcategory) =>
                      transactionSubcategory.value ===
                      formik.values.payment_method_id
                  )}
                  defaultValue={paymentMethods.filter(
                    (transactionSubcategory) =>
                      transactionSubcategory.value ===
                      formik.initialValues.payment_method_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('payment_method_id', opt.value);
                  }}
                />
                {formik.errors.payment_method_id &&
                formik.touched.payment_method_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.payment_method_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="3" sm="12">
              <FormGroup>
                <TextField
                  id="source"
                  readOnly
                  value={isSourceName}
                  label="Origem da venda"
                />
              </FormGroup>
            </Col>
            <Col md="3" sm="12">
              <FormGroup>
                <Label for="payment_type_id">
                  <FormattedMessage id="sales.payment_type" /> *
                </Label>
                <Select
                  isDisabled={isSaleClosed || isAsaasSale || isSourceDisabled}
                  options={paymentTypes}
                  className="React"
                  classNamePrefix="select"
                  id="payment_type_id"
                  name="payment_type_id"
                  onBlur={formik.handleBlur}
                  value={paymentTypes.find(
                    (transactionSubcategory) =>
                      transactionSubcategory.value ===
                      formik.values.payment_type_id
                  )}
                  defaultValue={paymentTypes.filter(
                    (transactionSubcategory) =>
                      transactionSubcategory.value ===
                      formik.initialValues.payment_type_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('payment_type_id', opt.value);
                  }}
                />
                {formik.errors.payment_type_id &&
                formik.touched.payment_type_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.payment_type_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              {formik.values.payment_type_id === 2 && (
                // <TextField
                //   id="installment_number"
                //   name="installment_number"
                //   type="number"
                //   required
                //   onBlur={formik.handleBlur}
                //   onChange={async (e) => {
                //     const installment_number = parseInt(e.target.value);
                //     await formik.setFieldValue(
                //       'installment_number',
                //       installment_number >= 36 ? 36 : installment_number
                //     );
                //     // handleTotalValueChange();
                //   }}
                //   value={formik.values.installment_number}
                //   placeholder={`${intl.formatMessage({
                //     id: 'sales.installment_number',
                //   })} *`}
                //   label={intl.formatMessage({ id: 'sales.installment_number' })}
                //   error={
                //     get(formik.touched, 'installment_number') &&
                //     get(formik.errors, 'installment_number')
                //   }
                // />
                <FormGroup>
                  <Label for="installment_number">
                    <FormattedMessage id="sales.installment_number" /> *
                  </Label>
                  <Select
                    isDisabled={isSaleClosed || isAsaasSale || isSourceDisabled}
                    options={installmentNumbers}
                    className="React"
                    classNamePrefix="select"
                    id="installment_number"
                    name="installment_number"
                    onBlur={formik.handleBlur}
                    value={installmentNumbers.find(
                      (transactionSubcategory) =>
                        transactionSubcategory.value ===
                        formik.values.installment_number
                    )}
                    defaultValue={installmentNumbers.filter(
                      (transactionSubcategory) =>
                        transactionSubcategory.value ===
                        formik.initialValues.installment_number
                    )}
                    onChange={(opt) => {
                      formik.setFieldValue('installment_number', opt.value);
                    }}
                  />
                  {formik.errors.installment_number &&
                  formik.touched.installment_number ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.installment_number}
                    </div>
                  ) : null}
                </FormGroup>
              )}
              {formik.values.payment_type_id === 3 && (
                // <TextField
                //   id="ocurrences"
                //   type="number"
                //   required
                //   onBlur={formik.handleBlur}
                //   onChange={async (e) => {
                //     await formik.setFieldValue('ocurrences', e.target.value);
                //     // handleTotalValueChange();
                //   }}
                //   value={formik.values.ocurrences}
                //   placeholder={`${intl.formatMessage({
                //     id: 'sales.ocurrences',
                //   })} *`}
                //   label={intl.formatMessage({ id: 'sales.ocurrences' })}
                //   error={
                //     get(formik.touched, 'ocurrences') &&
                //     get(formik.errors, 'ocurrences')
                //   }
                // />
                <FormGroup>
                  <Label for="ocurrences">
                    <FormattedMessage id="sales.ocurrences" /> *
                  </Label>
                  <Select
                    isDisabled={isSaleClosed || isAsaasSale || isSourceDisabled}
                    options={optionsOcurrences}
                    className="React"
                    classNamePrefix="select"
                    id="ocurrences"
                    name="ocurrences"
                    onBlur={formik.handleBlur}
                    value={optionsOcurrences.find(
                      (transactionSubcategory) =>
                        transactionSubcategory.value ===
                        formik.values.ocurrences
                    )}
                    defaultValue={optionsOcurrences.filter(
                      (transactionSubcategory) =>
                        transactionSubcategory.value ===
                        formik.initialValues.ocurrences
                    )}
                    onChange={(opt) => {
                      formik.setFieldValue('ocurrences', opt.value);
                    }}
                  />
                  {formik.errors.ocurrences && formik.touched.ocurrences ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.ocurrences}
                    </div>
                  ) : null}
                </FormGroup>
              )}
            </Col>
            {Boolean(
              formik.values.payment_type_id === 2 &&
                formik.values.installment_number
            ) && (
              <>
                <Col sm="12" className="mb-2">
                  <hr />
                </Col>
                {[...Array(formik.values.installment_number).keys()].map(
                  (index) => (
                    <>
                      <Col sm="12" className={`mb-2 ${index ? 'mt-4' : ''}`}>
                        <h5>{`Parcela ${index + 1}`}</h5>
                        {Boolean(
                          sale.payment_type_id === 2 &&
                            formik.values.installments?.[index]?.id
                        ) && (
                          <ExternalTextLink
                            url={`/admin/receivable/edit/${formik.values.installments?.[index]?.id}`}
                            text="Visualizar Conta a Receber"
                          />
                        )}
                      </Col>
                      <Col md="4" sm="12">
                        <FormGroup>
                          <Label className="d-block" for="due_date">
                            <FormattedMessage id="sales.installments.due_date" />{' '}
                            *
                          </Label>
                          <Flatpickr
                            disabled={isSaleClosed}
                            id={`installments_due_date_${index}`}
                            className="form-control"
                            options={{
                              dateFormat: 'Y-m-d',
                              altFormat: 'd/m/Y',
                              altInput: true,
                            }}
                            onBlur={() => formik.handleBlur}
                            value={
                              formik.values.installments?.[index]?.due_date
                            }
                            onChange={(date) =>
                              formik.setFieldValue(
                                `installments[${index}].due_date`,
                                date
                              )
                            }
                          />
                          {formik.errors.installments?.[index]?.due_date &&
                          formik.errors.installments?.[index]?.due_date ? (
                            <div className="invalid-tooltip mt-25">
                              {formik.errors.due_date}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4" sm="12">
                        <FormGroup>
                          <Label
                            className="d-block"
                            for={`competency_date_${index}`}
                          >
                            <FormattedMessage id="sales.installments.competency_date" />{' '}
                            *
                          </Label>
                          <Flatpickr
                            disabled={isSaleClosed}
                            id={`installments_competency_date_${index}`}
                            className="form-control"
                            options={{
                              dateFormat: 'Y-m-d',
                              altFormat: 'd/m/Y',
                              altInput: true,
                            }}
                            onBlur={() => formik.handleBlur}
                            value={
                              formik.values.installments?.[index]
                                ?.competency_date
                            }
                            onChange={(date) =>
                              formik.setFieldValue(
                                `installments[${index}].competency_date`,
                                date
                              )
                            }
                          />
                          {formik.errors.installments?.[index]
                            ?.competency_date &&
                          formik.touched.installments?.[index]
                            ?.competency_date ? (
                            <div className="invalid-tooltip mt-25">
                              {
                                formik.errors.installments?.[index]
                                  ?.competency_date
                              }
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4" sm="12">
                        <TextField
                          readOnly={isSaleClosed}
                          id={`installments_value_${index}`}
                          required
                          onBlur={formik.handleBlur}
                          value={formatMoney(
                            formik.values.installments?.[index]
                              ?.transaction_value || 0
                          )}
                          onChange={(e) =>
                            formik.setFieldValue(
                              `installments[${index}].transaction_value`,
                              getMonetaryValue(e.target.value)
                            )
                          }
                          placeholder="0,00"
                          label={intl.formatMessage({
                            id: 'sales.installments.transaction_value',
                          })}
                          error={
                            get(
                              formik.touched,
                              'installments?.[index]?.transaction_value'
                            ) &&
                            get(
                              formik.errors,
                              'installments?.[index]?.transaction_value'
                            )
                          }
                        />
                      </Col>
                      <Col sm="12" className="mb-1">
                        <CustomInput
                          disabled={isSaleClosed}
                          type="switch"
                          id={`payed_${index}`}
                          name="payed"
                          inline
                          checked={formik.values.installments?.[index]?.payed}
                          onBlur={formik.handleBlur}
                          onChange={(e) =>
                            formik.setFieldValue(
                              `installments[${index}].payed`,
                              !formik.values.installments?.[index]?.payed
                            )
                          }
                          value={formik.values.installments?.[index]?.payed}
                        >
                          <span className="switch-label">
                            {intl.formatMessage({
                              id: 'sales.payed',
                            })}
                          </span>
                        </CustomInput>
                      </Col>
                      {Boolean(formik.values.installments?.[index]?.payed) && (
                        <>
                          <Col md="4" sm="12">
                            <FormGroup>
                              <Label className="d-block" for="payment_date">
                                <FormattedMessage id="sales.payment_date" />
                              </Label>
                              <Flatpickr
                                disabled={isSaleClosed}
                                id={`payment_date${index}`}
                                className="form-control"
                                options={{
                                  dateFormat: 'Y-m-d',
                                  altFormat: 'd/m/Y',
                                  maxDate: moment().format('YYYY-MM-DD'),
                                  altInput: true,
                                }}
                                onBlur={() => formik.handleBlur}
                                value={
                                  formik.values.installments?.[index]
                                    ?.payment_date
                                }
                                onChange={(date) =>
                                  formik.setFieldValue(
                                    `installments?.[${index}]?.payment_date`,
                                    date
                                  )
                                }
                              />
                              {formik.errors.installments?.[index]
                                ?.payment_date &&
                              formik.touched.installments?.[index]
                                ?.payment_date ? (
                                <div className="invalid-tooltip mt-25">
                                  {
                                    formik.errors.installments?.[index]
                                      ?.payment_date
                                  }
                                </div>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col md="4" sm="12">
                            <TextField
                              readOnly={isSaleClosed}
                              id={`payed_value_${index}`}
                              required
                              onBlur={formik.handleBlur}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `installments[${index}].payed_value`,
                                  getMonetaryValue(e.target.value)
                                )
                              }
                              value={formatMoney(
                                formik.values.installments?.[index]
                                  ?.payed_value || 0
                              )}
                              placeholder={intl.formatMessage({
                                id: 'sales.payed_value',
                              })}
                              label={intl.formatMessage({
                                id: 'sales.payed_value',
                              })}
                              error={
                                get(
                                  formik.touched,
                                  `installments?.[${index}]?.payed_value`
                                ) &&
                                get(
                                  formik.errors,
                                  `installments?.[${index}]?.payed_value`
                                )
                              }
                            />
                          </Col>
                          <Col md="4" sm="12">
                            <TextField
                              readOnly={isSaleClosed}
                              id={`interest_value_${index}`}
                              inputProps={{
                                readOnly: true,
                              }}
                              onBlur={formik.handleBlur}
                              value={formatMoney(
                                formik.values.installments?.[index]
                                  ?.payed_value -
                                  formik.values.installments?.[index]
                                    ?.transaction_value
                              )}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `installments[${index}].payed_value`,
                                  getMonetaryValue(e.target.value)
                                )
                              }
                              placeholder="0,00"
                              label={intl.formatMessage({
                                id: 'sales.interest_value',
                              })}
                              error={
                                get(
                                  formik.touched,
                                  `installments?.[${index}]?.interest_value`
                                ) &&
                                get(
                                  formik.errors,
                                  `installments?.[${index}]?.interest_value`
                                )
                              }
                            />
                          </Col>
                        </>
                      )}
                    </>
                  )
                )}
                <Col sm="12" className="mb-2">
                  <hr />
                </Col>
              </>
            )}
            {Boolean(
              sale.payment_type_id === 1 && formik.values.installments?.[0]?.id
            ) && (
              <Col className="mb-2" sm="12">
                <ExternalTextLink
                  url={`/admin/receivable/edit/${formik.values.installments?.[0]?.id}`}
                  text="Visualizar Conta a Receber"
                />
              </Col>
            )}
            {Boolean(formik.values.payment_type_id !== 2) && (
              <>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label className="d-block" for="due_date">
                      <FormattedMessage id="sales.due_date" /> *
                    </Label>
                    <Flatpickr
                      id="due_date"
                      className="form-control"
                      options={{
                        dateFormat: 'Y-m-d',
                        altFormat: 'd/m/Y',
                        altInput: true,
                      }}
                      disabled={isSourceDisabled}
                      onBlur={() => formik.handleBlur}
                      value={formik.values.due_date}
                      onChange={(date) =>
                        formik.setFieldValue(`due_date`, date)
                      }
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
                      <FormattedMessage id="sales.competency_date" /> *
                    </Label>
                    <Flatpickr
                      id="competency_date"
                      className="form-control"
                      options={{
                        dateFormat: 'Y-m-d',
                        altFormat: 'd/m/Y',
                        altInput: true,
                      }}
                      disabled={isSourceDisabled}
                      onBlur={() => formik.handleBlur}
                      value={formik.values.competency_date}
                      onChange={(date) =>
                        formik.setFieldValue(`competency_date`, date)
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
              </>
            )}
            <Col md="6" sm="12">
              <TextField
                id="description"
                required
                readOnly={isSourceDisabled}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description}
                placeholder={`${intl.formatMessage({
                  id: 'sales.description',
                })} *`}
                label={intl.formatMessage({ id: 'sales.description' })}
                error={
                  get(formik.touched, 'description') &&
                  get(formik.errors, 'description')
                }
              />
            </Col>
            <Col md="6" sm="12">
              <TextField
                id="fiscal_document_text"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.fiscal_document_text}
                placeholder={intl.formatMessage({
                  id: 'sales.fiscal_document_text',
                })}
                label={intl.formatMessage({
                  id: 'sales.fiscal_document_text',
                })}
                error={
                  get(formik.touched, 'fiscal_document_text') &&
                  get(formik.errors, 'fiscal_document_text')
                }
              />
            </Col>
            {saleId && (
              <>
                <Col md="6" sm="12">
                  <TextField
                    id="transaction_external_id"
                    readOnly={saleId}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.transaction_external_id}
                    placeholder={intl.formatMessage({
                      id: 'sales.transaction_external_id',
                    })}
                    label={intl.formatMessage({
                      id: 'sales.transaction_external_id',
                    })}
                    error={
                      get(formik.touched, 'transaction_external_id') &&
                      get(formik.errors, 'transaction_external_id')
                    }
                  />
                </Col>
                <Col md="6" sm="12">
                  <TextField
                    id="transaction_key"
                    readOnly={saleId}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.transaction_key}
                    placeholder={intl.formatMessage({
                      id: 'sales.transaction_key',
                    })}
                    label={intl.formatMessage({ id: 'sales.transaction_key' })}
                    error={
                      get(formik.touched, 'transaction_key') &&
                      get(formik.errors, 'transaction_key')
                    }
                  />
                </Col>
              </>
            )}
            <Col md="12" sm="12">
              <TextField
                id="observations"
                readOnly={isSourceDisabled}
                rows="3"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.observations}
                placeholder={intl.formatMessage({
                  id: 'sales.observations',
                })}
                label={intl.formatMessage({
                  id: 'sales.observations',
                })}
                error={
                  get(formik.touched, 'observations') &&
                  get(formik.errors, 'observations')
                }
              />
            </Col>
            <Col sm="12" className="my-2">
              <AddProjects formik={formik} />
            </Col>
            <Col sm="12" className="my-2">
              <AddCostCenters formik={formik} />
            </Col>
            <PermissionGate permissions={permissionButton}>
              <Col className="d-flex justify-content-end flex-wrap" sm="12">
                <Button.Ripple
                  className="mt-1"
                  color="primary"
                  disabled={isSaleClosed || formik.isSubmitting}
                >
                  <FormattedMessage id="button.save" />
                </Button.Ripple>
              </Col>
            </PermissionGate>
          </Row>
        </Form>
      </PermissionGate>
    </>
  );
};

SaleForm.propTypes = {
  sale: PropTypes.func,
  saleId: PropTypes.string || PropTypes.number,
  isSourceName: PropTypes.bool.isRequired,
  isAsaasSale: PropTypes.bool.isRequired,
  formik: PropTypes.func.isRequired,
  bankAccounts: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  transactionSubcategories: PropTypes.array.isRequired,
  paymentTypes: PropTypes.array.isRequired,
  paymentMethods: PropTypes.array.isRequired,
  availableStatus: PropTypes.array.isRequired,
};

SaleForm.defaultProps = {
  saleId: null,
  sale: {},
};

export default SaleForm;
