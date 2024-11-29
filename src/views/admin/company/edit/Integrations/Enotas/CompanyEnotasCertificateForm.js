import React from 'react';
import propTypes from 'prop-types';
import { Row, Col, Form, FormGroup, Label, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyEnotasCertificateForm = ({ formik }) => {
  const intl = useIntl();

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row className="mt-1">
        <Col className="mt-1" sm="12">
          <h3 className="mb-1 text-primary">
            <span className="align-middle">Certificado Digital</span>
          </h3>
        </Col>
        {(formik.values.integrations?.enotas_status || true) && (
          <>
            <Col md="6" sm="12">
              <TextField
                id="certificate_name"
                disabled
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.certificate_name}
                placeholder={intl.formatMessage({
                  id: 'company.certificate_name',
                })}
                label={intl.formatMessage({ id: 'company.certificate_name' })}
                error={
                  formik.touched.company_name && formik.errors.company_name
                }
              />
            </Col>
            <Col md="6" sm="12">
              <TextField
                id="certificate_valid"
                disabled
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.certificate_valid}
                label={intl.formatMessage({ id: 'company.certificate_valid' })}
                error={
                  formik.touched.certificate_valid &&
                  formik.errors.certificate_valid
                }
              />
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="customFile">
                  {intl.formatMessage({
                    id: 'company.certificate_file',
                  })}{' '}
                  *
                </Label>
                <CustomInput
                  id="certificate_file"
                  type="file"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue('arquivo', e.target.files[0])
                  }
                  placeholder={intl.formatMessage({
                    id: 'company.certificate_file',
                  })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <TextField
                id="certificate_password"
                required
                type="password"
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue('certificate_password', e.target.value)
                }
                value={formik.values.certificate_password}
                label={intl.formatMessage({
                  id: 'company.certificate_password',
                })}
                error={
                  formik.touched.certificate_password &&
                  formik.errors.certificate_password
                }
              />
            </Col>
          </>
        )}
      </Row>
    </Form>
  );
};

CompanyEnotasCertificateForm.propTypes = {
  formik: propTypes.shape.isRequired,
};

CompanyEnotasCertificateForm.defaultProps = {};

export default CompanyEnotasCertificateForm;
