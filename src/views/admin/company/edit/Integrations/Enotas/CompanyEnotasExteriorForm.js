import React from 'react';
import propTypes from 'prop-types';
import { Row, Col, Form, FormGroup, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';

const CompanyEnotasExteriorForm = ({ formik }) => {
  const intl = useIntl();

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row className="mt-1">
        <Col className="mt-1" sm="12">
          <h3 className="mb-1 text-primary">
            <span className="align-middle">NFs Exterior</span>
          </h3>
        </Col>
        {(formik.values.integrations?.enotas_status || true) && (
          <>
            <Col className="mt-1" sm="12">
              <FormGroup>
                <CustomInput
                  type="switch"
                  id="exterior_hotmart_invoice"
                  name="exterior_hotmart_invoice"
                  inline
                  defaultChecked={formik.values.exterior_hotmart_invoice}
                  onBlur={formik.handleBlur}
                  onChange={() =>
                    formik.setFieldValue(
                      'exterior_hotmart_invoice',
                      !formik.values.exterior_hotmart_invoice
                    )
                  }
                  value={formik.values.exterior_hotmart_invoice}
                >
                  <span className="switch-label">
                    {intl.formatMessage({
                      id: 'company.exterior_hotmart_invoice',
                    })}
                  </span>
                </CustomInput>
              </FormGroup>
            </Col>
          </>
        )}
      </Row>
    </Form>
  );
};

CompanyEnotasExteriorForm.propTypes = {
  formik: propTypes.shape.isRequired,
};

CompanyEnotasExteriorForm.defaultProps = {};

export default CompanyEnotasExteriorForm;
