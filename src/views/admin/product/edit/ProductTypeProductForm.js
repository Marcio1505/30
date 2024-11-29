import React from 'react';
import { Row, Col, Input, Label, FormGroup } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../components/inputs/TextField';

import { formatAliquot, getAliquotValue } from '../../../../utils/formaters';

const ProductTypeProductForm = ({ formik }) => {
  const intl = useIntl();
  return (
    <>
      <Row className="mt-1">
        <Col className="mt-1" sm="12">
          <h3 className="mb-1 text-primary">
            <span className="align-middle">NF de Produto</span>
          </h3>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col md="6" sm="12">
          <TextField
            id="fiscal_code"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('fiscal_code', e.target.value)
            }
            value={formik.values.fiscal_code}
            label={intl.formatMessage({
              id: 'products.fiscal_code',
            })}
            error={formik.touched.fiscal_code && formik.errors.fiscal_code}
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="fiscal_origin"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('fiscal_origin', e.target.value)
            }
            value={formik.values.fiscal_origin}
            label={intl.formatMessage({
              id: 'products.fiscal_origin',
            })}
            error={formik.touched.fiscal_origin && formik.errors.fiscal_origin}
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="ncm"
            required
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue('ncm', e.target.value)}
            value={formik.values.ncm}
            label={intl.formatMessage({
              id: 'products.ncm',
            })}
            error={formik.touched.ncm && formik.errors.ncm}
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="measurement_unit"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('measurement_unit', e.target.value)
            }
            value={formik.values.measurement_unit}
            label={intl.formatMessage({
              id: 'products.measurement_unit',
            })}
            error={
              formik.touched.measurement_unit && formik.errors.measurement_unit
            }
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="icms_cst"
            required
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue('icms_cst', e.target.value)}
            value={formik.values.icms_cst}
            label={intl.formatMessage({
              id: 'products.icms_cst',
            })}
            error={formik.touched.icms_cst && formik.errors.icms_cst}
          />
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label for="icms_aliquot">
              <FormattedMessage id="products.icms_aliquot" />
            </Label>
            <Input
              id="icms_aliquot"
              onBlur={formik.handleBlur}
              value={formatAliquot(formik.values.icms_aliquot)}
              onChange={(e) =>
                formik.setFieldValue(
                  'icms_aliquot',
                  getAliquotValue(e.target.value)
                )
              }
              placeholder="0,0000"
            />
            {formik.errors.icms_aliquot && formik.touched.icms_aliquot ? (
              <div className="invalid-tooltip mt-25">
                {formik.errors.icms_aliquot}
              </div>
            ) : null}
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="pis_cst"
            required
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue('pis_cst', e.target.value)}
            value={formik.values.pis_cst}
            label={intl.formatMessage({
              id: 'products.pis_cst',
            })}
            error={formik.touched.pis_cst && formik.errors.pis_cst}
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="pis_aliquot"
            onBlur={formik.handleBlur}
            value={formatAliquot(formik.values.pis_aliquot)}
            onChange={(e) =>
              formik.setFieldValue(
                'pis_aliquot',
                getAliquotValue(e.target.value)
              )
            }
            placeholder="0,0000"
            label={intl.formatMessage({
              id: 'products.pis_aliquot',
            })}
            error={formik.touched.pis_aliquot && formik.errors.pis_aliquot}
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="cofins_cst"
            required
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue('cofins_cst', e.target.value)}
            value={formik.values.cofins_cst}
            label={intl.formatMessage({
              id: 'products.cofins_cst',
            })}
            error={formik.touched.cofins_cst && formik.errors.cofins_cst}
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="cofins_aliquot"
            onBlur={formik.handleBlur}
            value={formatAliquot(formik.values.cofins_aliquot)}
            onChange={(e) =>
              formik.setFieldValue(
                'cofins_aliquot',
                getAliquotValue(e.target.value)
              )
            }
            placeholder="0,0000"
            label={intl.formatMessage({
              id: 'products.cofins_aliquot',
            })}
            error={
              formik.touched.cofins_aliquot && formik.errors.cofins_aliquot
            }
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="ipi_cst"
            required
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue('ipi_cst', e.target.value)}
            value={formik.values.ipi_cst}
            label={intl.formatMessage({
              id: 'products.ipi_cst',
            })}
            error={formik.touched.ipi_cst && formik.errors.ipi_cst}
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="ipi_aliquot"
            onBlur={formik.handleBlur}
            value={formatAliquot(formik.values.ipi_aliquot)}
            onChange={(e) =>
              formik.setFieldValue(
                'ipi_aliquot',
                getAliquotValue(e.target.value)
              )
            }
            placeholder="0,0000"
            label={intl.formatMessage({
              id: 'products.ipi_aliquot',
            })}
            error={formik.touched.ipi_aliquot && formik.errors.ipi_aliquot}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="12">
          <TextField
            id="ipi_code"
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue('ipi_code', e.target.value)}
            value={formik.values.ipi_code}
            label={intl.formatMessage({
              id: 'products.ipi_code',
            })}
            error={formik.touched.ipi_code && formik.errors.ipi_code}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="12">
          <TextField
            id="fiscal_source"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('fiscal_source', e.target.value)
            }
            value={formik.values.fiscal_source}
            label={intl.formatMessage({
              id: 'products.fiscal_source',
            })}
            error={formik.touched.fiscal_source && formik.errors.fiscal_source}
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="simplified_tax_percentage"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('simplified_tax_percentage', e.target.value)
            }
            value={formik.values.simplified_tax_percentage}
            label={intl.formatMessage({
              id: 'products.simplified_tax_percentage',
            })}
            error={
              formik.touched.simplified_tax_percentage &&
              formik.errors.simplified_tax_percentage
            }
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="12">
          <TextField
            id="cfop_in_state"
            required
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('cfop_in_state', e.target.value)
            }
            value={formik.values.cfop_in_state}
            label={intl.formatMessage({
              id: 'products.cfop_in_state',
            })}
            error={formik.touched.cfop_in_state && formik.errors.cfop_in_state}
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="return_cfop_in_state"
            required
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('return_cfop_in_state', e.target.value)
            }
            value={formik.values.return_cfop_in_state}
            label={intl.formatMessage({
              id: 'products.return_cfop_in_state',
            })}
            error={
              formik.touched.return_cfop_in_state &&
              formik.errors.return_cfop_in_state
            }
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="12">
          <TextField
            id="cfop_out_state"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('cfop_out_state', e.target.value)
            }
            value={formik.values.cfop_out_state}
            label={intl.formatMessage({
              id: 'products.cfop_out_state',
            })}
            error={
              formik.touched.cfop_out_state && formik.errors.cfop_out_state
            }
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="return_cfop_out_state"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('return_cfop_out_state', e.target.value)
            }
            value={formik.values.return_cfop_out_state}
            label={intl.formatMessage({
              id: 'products.return_cfop_out_state',
            })}
            error={
              formik.touched.return_cfop_out_state &&
              formik.errors.return_cfop_out_state
            }
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="12">
          <TextField
            id="cfop_international"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('cfop_international', e.target.value)
            }
            value={formik.values.cfop_international}
            label={intl.formatMessage({
              id: 'products.cfop_international',
            })}
            error={
              formik.touched.cfop_international &&
              formik.errors.cfop_international
            }
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="return_cfop_international"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('return_cfop_international', e.target.value)
            }
            value={formik.values.return_cfop_international}
            label={intl.formatMessage({
              id: 'products.return_cfop_international',
            })}
            error={
              formik.touched.return_cfop_international &&
              formik.errors.return_cfop_international
            }
          />
        </Col>
      </Row>
      <Row>
        <Col md="12" sm="12">
          <TextField
            id="tax_benefit_code"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('tax_benefit_code', e.target.value)
            }
            value={formik.values.tax_benefit_code}
            label={intl.formatMessage({
              id: 'products.tax_benefit_code',
            })}
            error={
              formik.touched.tax_benefit_code && formik.errors.tax_benefit_code
            }
          />
        </Col>
        <Col md="12" sm="12">
          <TextField
            id="aditional_info"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('aditional_info', e.target.value)
            }
            value={formik.values.aditional_info}
            label={intl.formatMessage({
              id: 'products.aditional_info',
            })}
            error={
              formik.touched.aditional_info && formik.errors.aditional_info
            }
          />
        </Col>
        <Col md="12" sm="12">
          <TextField
            id="item_description"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('item_description', e.target.value)
            }
            value={formik.values.item_description}
            label={intl.formatMessage({
              id: 'products.item_description',
            })}
            error={
              formik.touched.item_description && formik.errors.item_description
            }
          />
        </Col>
      </Row>
    </>
  );
};

ProductTypeProductForm.propTypes = {};

ProductTypeProductForm.defaultProps = {};

export default ProductTypeProductForm;
