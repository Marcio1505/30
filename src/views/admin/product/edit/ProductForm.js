import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Input, Label, FormGroup, CustomInput } from 'reactstrap';
import Select from 'react-select';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import Slider from 'rc-slider';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import TextField from '../../../../components/inputs/TextField';
import { formatMoney, getMonetaryValue } from '../../../../utils/formaters';
import { showCompany } from '../../../../services/apis/company.api';
import PermissionGate from '../../../../PermissionGate';

const PercentualValueSlider = Slider.createSliderWithTooltip(Slider);

const ProductForm = ({ formik }) => {
  const [initialized, setInitialized] = useState(false);
  const [company, setCompany] = useState({});
  const intl = useIntl();
  const { product_id: productId } = useParams();
  const productTypes = [
    {
      value: 1,
      label: 'Produto',
    },
    {
      value: 2,
      label: 'Serviço',
    },
    {
      value: 3,
      label: 'Split (Produto e Serviço)',
    },
  ];
  const priceView = [
    {
      value: 0,
      label: 'Valor do produto',
    },
    {
      value: 1,
      label: 'Valor pago pelo cliente',
    },
  ];

  const fetchData = async () => {
    let dataCompany = {};
    if (formik.values.company_id) {
      const res = await showCompany({ id: formik.values.company_id });
      dataCompany = res.data;
    }

    setCompany(dataCompany);
    setInitialized(true);
  };

  let permission = 'companies.products.store';

  if (productId) {
    permission = 'products.show';
  }

  useEffect(() => {
    fetchData();
  }, [formik.values.company_id]);

  return (
    <>
      <PermissionGate permissions={permission}>
        <Row>
          {Boolean(productId) && (
            <Col className="mt-1" sm="12">
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
                    {intl.formatMessage({ id: 'products.status' })}
                  </span>
                </CustomInput>
              </FormGroup>
            </Col>
          )}
          <Col md="12" sm="12">
            <TextField
              id="name"
              required
              onBlur={formik.handleBlur}
              onChange={(e) => formik.setFieldValue('name', e.target.value)}
              value={formik.values.name}
              label={intl.formatMessage({
                id: 'products.name',
              })}
              error={formik.touched.name && formik.errors.name}
            />
          </Col>
          <Col md="12" sm="12">
            <TextField
              id="code"
              onBlur={formik.handleBlur}
              onChange={(e) => formik.setFieldValue('code', e.target.value)}
              value={formik.values.code}
              label={intl.formatMessage({
                id: 'products.code',
              })}
              error={formik.touched.code && formik.errors.code}
            />
          </Col>
          <Col md="12" sm="12">
            <TextField
              id="description"
              onBlur={formik.handleBlur}
              onChange={(e) =>
                formik.setFieldValue('description', e.target.value)
              }
              value={formik.values.description}
              label={intl.formatMessage({
                id: 'products.description',
              })}
              error={formik.touched.description && formik.errors.description}
            />
          </Col>
          <Col md="12" sm="12">
            <FormGroup>
              <Label for="price">
                <FormattedMessage id="products.price" /> *
              </Label>
              <Input
                id="price"
                required
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
          <Col md="12">
            <FormGroup>
              <Label for="price_view">
                <FormattedMessage id="products.price_view" /> *
              </Label>
              <Select
                options={priceView}
                className="React"
                classNamePrefix="select"
                id="price_view"
                onBlur={formik.handleBlur}
                defaultValue={priceView.filter(
                  (productType) =>
                    productType.value === formik.initialValues.price_view
                )}
                onChange={(opt) => {
                  formik.setFieldValue('price_view', opt.value);
                }}
              />
              {formik.errors.price_view && formik.touched.price_view ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.price_view}
                </div>
              ) : null}
            </FormGroup>
          </Col>

          <Col md="12" className="mt-1 mb-2">
            <FormGroup>
              <Label for="percentage_price" className="mb-5">
                <FormattedMessage id="products.percentage_price" /> *
              </Label>
              <PercentualValueSlider
                id="percentage_price"
                defaultValue={50}
                trackStyle={{ backgroundColor: '#36BBA4', height: 10 }}
                handleStyle={{
                  borderColor: '#36BBA4',
                  height: 28,
                  width: 28,
                  marginLeft: -0,
                  marginTop: -9,
                  backgroundColor: 'black',
                }}
                railStyle={{ backgroundColor: '#CCC', height: 10 }}
                min={1}
                max={100}
                value={formik.values.percentage_price}
                onChange={(value) => {
                  formik.setFieldValue('percentage_price', value);
                }}
                tipFormatter={(value) => (
                  <>
                    <span className="text-success">{value}%</span>
                  </>
                )}
              />
            </FormGroup>
          </Col>

          {company.integrations?.cademi_status == 1 &&
            company.integrations?.cademi_token && (
              <Col md="12">
                <FormGroup>
                  <CustomInput
                    type="switch"
                    id="cademi_status"
                    name="cademi_status"
                    inline
                    defaultChecked={formik.values.cademi_status}
                    onBlur={formik.handleBlur}
                    onChange={() =>
                      formik.setFieldValue(
                        'cademi_status',
                        !formik.values.cademi_status
                      )
                    }
                    value={formik.values.cademi_status}
                  >
                    <span className="switch-label">
                      {intl.formatMessage({ id: 'products.cademi_status' })}
                    </span>
                  </CustomInput>
                </FormGroup>
              </Col>
            )}

          {company.integrations?.cademi_status == 1 &&
            company.integrations?.cademi_token &&
            Boolean(formik.values.cademi_status) && (
              <Col md="12" sm="12">
                <TextField
                  id="cademi_id_product"
                  required
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue('cademi_id_product', e.target.value)
                  }
                  value={formik.values.cademi_id_product}
                  label={intl.formatMessage({
                    id: 'products.cademi_id_product',
                  })}
                  error={
                    formik.touched.cademi_id_product &&
                    formik.errors.cademi_id_product
                  }
                />
              </Col>
            )}

          <Col md="12">
            <FormGroup>
              <Label for="product_type">
                <FormattedMessage id="products.product_type" /> *
              </Label>
              <Select
                options={productTypes}
                className="React"
                classNamePrefix="select"
                id="product_type"
                onBlur={formik.handleBlur}
                defaultValue={productTypes.filter(
                  (productType) =>
                    productType.value === formik.initialValues.product_type
                )}
                onChange={(opt) => {
                  formik.setFieldValue('product_type', opt.value);
                }}
              />
              {formik.errors.product_type && formik.touched.product_type ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.product_type}
                </div>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
      </PermissionGate>
    </>
  );
};

ProductForm.propTypes = {
  formik: PropTypes.object.isRequired,
};

ProductForm.defaultProps = {};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(ProductForm);
