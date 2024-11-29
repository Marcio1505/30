import React from 'react';
import { Row, Col, FormGroup, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../components/inputs/TextField';

const ProductAutomaticSaleInvoiceForm = ({ formik }) => {
  const intl = useIntl();

  return (
    <>
      <Row className="mt-1">
        <Col className="mt-1" sm="12">
          <h3 className="mb-1 text-primary">
            <span className="align-middle">
              {intl.formatMessage({
                id: 'products.automatic_sale_invoice_title',
              })}
            </span>
          </h3>
          <p>
            {intl.formatMessage({
              id: 'products.automatic_sale_invoice_description',
            })}
          </p>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col className="mt-1" sm="12">
          <FormGroup>
            <CustomInput
              type="switch"
              id="automatic_sale_invoice"
              name="automatic_sale_invoice"
              inline
              defaultChecked={formik.values.automatic_sale_invoice}
              onBlur={formik.handleBlur}
              onChange={() =>
                formik.setFieldValue(
                  'automatic_sale_invoice',
                  !formik.values.automatic_sale_invoice
                )
              }
              value={formik.values.automatic_sale_invoice}
            >
              <span className="switch-label">
                {intl.formatMessage({ id: 'products.automatic_sale_invoice' })}
              </span>
            </CustomInput>
          </FormGroup>
        </Col>
      </Row>
      {Boolean(formik.values.automatic_sale_invoice) && (
        <Row>
          <Col md="12" sm="12">
            <TextField
              id="days_sale_invoice"
              required
              onBlur={formik.handleBlur}
              onChange={(e) =>
                formik.setFieldValue('days_sale_invoice', e.target.value)
              }
              value={formik.values.days_sale_invoice}
              label={intl.formatMessage({
                id: 'products.days_sale_invoice',
              })}
              error={
                formik.touched.days_sale_invoice &&
                formik.errors.days_sale_invoice
              }
            />
          </Col>
        </Row>
      )}
    </>
  );
};

ProductAutomaticSaleInvoiceForm.propTypes = {};

ProductAutomaticSaleInvoiceForm.defaultProps = {};

export default ProductAutomaticSaleInvoiceForm;
