import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Row,
  Col,
  Input,
  Label,
  FormGroup,
  Button,
  CustomInput,
} from 'reactstrap';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { useIntl, FormattedMessage } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../components/inputs/TextField';
import AddProjects from '../../../../components/add-items/AddProjects';
import AddCostCenters from '../../../../components/add-items/AddCostCenters';

import { formatMoney, getMonetaryValue } from '../../../../utils/formaters';

const ProductLinkForm = ({
  formik,
  paymentTypes,
  paymentMethods,
  transactionSubcategories,
  iuliPlans,
  products,
  subscriptionCycles,
  productLinkId,
  currentCompany,
}) => {
  const intl = useIntl();

  const optionsIuliPlans = iuliPlans;

  if (formik.initialValues.iuli_plan_id) {
    optionsIuliPlans.unshift({
      value: null,
      label: 'Nenhum',
    });
  }

  const isProductLinkExpired = moment(formik.values.end_date).isBefore(
    moment().startOf('day')
  );

  return (
    <Row className="mt-1">
      {formik.values.url && (
        <Col className="mt-1" md={{ size: 6, offset: 3 }} sm="12">
          <a target="blank" href={formik.values.url}>
            Link de Pagamento
          </a>
          <CopyToClipboard className="" text={formik.values.url}>
            <Button color="transparent">
              <Copy />
            </Button>
          </CopyToClipboard>
        </Col>
      )}
      <Col className="mt-1" md={{ size: 6, offset: 3 }} sm="12">
        <Row>
          <Col className="mt-1" md="12">
            <FormGroup>
              <Label for="product">
                <FormattedMessage id="product_links.product" /> *
              </Label>
              <Select
                options={products}
                className="React"
                classNamePrefix="select"
                id="product"
                onBlur={formik.handleBlur}
                defaultValue={products.filter(
                  (product) => product.value === formik.initialValues.product_id
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
          <Col md="12" sm="12">
            <TextField
              id="name"
              required
              onBlur={formik.handleBlur}
              onChange={(e) => formik.setFieldValue('name', e.target.value)}
              value={formik.values.name}
              label={intl.formatMessage({
                id: 'product_links.name',
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
                id: 'product_links.description',
              })}
              error={formik.touched.description && formik.errors.description}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12" sm="12">
            <FormGroup>
              <Label for="price">
                <FormattedMessage id="product_links.price" /> *
              </Label>
              <Input
                id="price"
                onBlur={formik.handleBlur}
                value={formatMoney(formik.values.price)}
                onChange={(e) =>
                  formik.setFieldValue(
                    'price',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
              />
              {formik.errors.price && formik.touched.price ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.price}
                </div>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="payment_method">
                <FormattedMessage id="product_links.payment_method" /> *
              </Label>
              <Select
                options={paymentMethods}
                className="React"
                classNamePrefix="select"
                id="payment_method"
                onBlur={formik.handleBlur}
                defaultValue={paymentMethods.filter(
                  (paymentMethod) =>
                    paymentMethod.value ===
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
          {Boolean(
            formik.values.payment_method_id === null ||
              formik.values.payment_method_id === 3
          ) && (
            <Col md="6" sm="12">
              <TextField
                id="due_date_limit_days"
                type="number"
                required
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue('due_date_limit_days', e.target.value)
                }
                value={formik.values.due_date_limit_days}
                label={intl.formatMessage({
                  id: 'product_links.due_date_limit_days',
                })}
                error={
                  formik.touched.due_date_limit_days &&
                  formik.errors.due_date_limit_days
                }
              />
            </Col>
          )}
        </Row>
        <Row>
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="payment_type">
                <FormattedMessage id="product_links.payment_type" /> *
              </Label>
              <Select
                options={paymentTypes}
                className="React"
                classNamePrefix="select"
                id="payment_type"
                onBlur={formik.handleBlur}
                defaultValue={paymentTypes.filter(
                  (paymentType) =>
                    paymentType.value === formik.initialValues.payment_type_id
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
          {formik.values.payment_type_id === 3 && (
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="subscription_cycle">
                  <FormattedMessage id="product_links.subscription_cycle" /> *
                </Label>
                <Select
                  options={subscriptionCycles}
                  className="React"
                  classNamePrefix="select"
                  id="subscription_cycle"
                  onBlur={formik.handleBlur}
                  defaultValue={subscriptionCycles.filter(
                    (subscriptionCycle) =>
                      subscriptionCycle.value ===
                      formik.initialValues.subscription_cycle
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('subscription_cycle', opt.value);
                  }}
                />
                {formik.errors.subscription_cycle &&
                formik.touched.subscription_cycle ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.subscription_cycle}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          )}
          {formik.values.payment_type_id === 2 && (
            <Col md="6" sm="12">
              <TextField
                id="max_installments"
                type="number"
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue('max_installments', e.target.value)
                }
                value={formik.values.max_installments}
                required
                label={intl.formatMessage({
                  id: 'product_links.max_installments',
                })}
                error={
                  formik.touched.max_installments &&
                  formik.errors.max_installments
                }
              />
            </Col>
          )}
          <Col md="12" sm="12">
            <FormGroup>
              <Label for="transaction_subcategory">
                <FormattedMessage id="transactions.transaction_category" /> *
              </Label>
              <Select
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
          <Col sm="12">
            <FormGroup>
              <Label className="d-block" for="end_date">
                <FormattedMessage id="product_links.end_date" />
              </Label>
              <Flatpickr
                id="end_date"
                className="form-control"
                options={{
                  dateFormat: 'Y-m-d',
                  altFormat: 'd/m/Y',
                  altInput: true,
                  minDate: formik.values.end_date ? null : 'today',
                }}
                onBlur={formik.handleBlur}
                value={formik.values.end_date}
                onChange={(date) => formik.setFieldValue('end_date', date)}
              />
              {formik.errors.end_date && formik.touched.end_date ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.end_date}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          {isProductLinkExpired && (
            <Col className="mb-2 text-danger" sm="12">
              <b>Link de Pagamento Expirado</b>
            </Col>
          )}
          {currentCompany.is_iuli_company && (
            <Col md="12" sm="12">
              <FormGroup>
                <Label for="iuli_plan">
                  <FormattedMessage id="product_links.iuli_plan_id" />
                </Label>
                <Select
                  options={optionsIuliPlans}
                  className="React"
                  classNamePrefix="select"
                  id="iuli_plan_id"
                  name="iuli_plan_id"
                  onBlur={formik.handleBlur}
                  value={iuliPlans.find(
                    (iuliPlan) => iuliPlan.value === formik.values.iuli_plan_id
                  )}
                  defaultValue={iuliPlans.filter(
                    (iuliPlan) =>
                      iuliPlan.value === formik.initialValues.iuli_plan_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('iuli_plan_id', opt.value);
                  }}
                />
                {formik.errors.iuli_plan_id && formik.touched.iuli_plan_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.iuli_plan_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          )}
          {Boolean(productLinkId) && (
            <Col sm="12">
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
                    {intl.formatMessage({ id: 'product_links.status' })}
                  </span>
                </CustomInput>
              </FormGroup>
            </Col>
          )}
          <Col sm="12" className="my-2">
            <AddProjects formik={formik} />
          </Col>
          <Col sm="12" className="my-2">
            <AddCostCenters formik={formik} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

ProductLinkForm.propTypes = {
  formik: PropTypes.object.isRequired,
  paymentTypes: PropTypes.array.isRequired,
  paymentMethods: PropTypes.array.isRequired,
  transactionSubcategories: PropTypes.array.isRequired,
  iuliPlans: PropTypes.array,
  products: PropTypes.array.isRequired,
  subscriptionCycles: PropTypes.array.isRequired,
  productLinkId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentCompany: PropTypes.object.isRequired,
};

ProductLinkForm.defaultProps = {
  iuliPlans: [],
  productLinkId: null,
};

const mapStateToProps = (state) => ({
  currentCompany: state.companies.currentCompany,
});

export default connect(mapStateToProps)(ProductLinkForm);
