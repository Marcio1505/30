import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyEduzz = ({ formik }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [eduzzDataVisible, setEduzzDataVisible] = useState(false);

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="eduzz_status"
          name="eduzz_status"
          inline
          defaultChecked={formik.values.integrations?.eduzz_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.eduzz_status',
              !formik.values.integrations?.eduzz_status
            )
          }
          value={formik.values.integrations?.eduzz_status}
        >
          <span className="switch-label">
            Integrar com Eduzz
            {/* {intl.formatMessage({ id: 'company?.eduzz_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.eduzz_status) && (
        <>
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Credenciais Eduzz</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="4" sm="12">
                <TextField
                  type={eduzzDataVisible ? 'text' : 'password'}
                  id="eduzz_public_key"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.eduzz_public_key',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.eduzz_public_key}
                  placeholder={intl.formatMessage({
                    id: 'company.eduzz_public_key',
                  })}
                  label={intl.formatMessage({
                    id: 'company.eduzz_public_key',
                  })}
                  rightIcon={
                    <Eye onClick={() => setEduzzDataVisible(!eduzzDataVisible)} />
                  }
                />
              </Col>
              <Col md="4" sm="12">
                <TextField
                  type={eduzzDataVisible ? 'text' : 'password'}
                  id="eduzz_api_key"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.eduzz_api_key',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.eduzz_api_key}
                  placeholder={intl.formatMessage({
                    id: 'company.eduzz_api_key',
                  })}
                  label={intl.formatMessage({
                    id: 'company.eduzz_api_key',
                  })}
                  rightIcon={
                    <Eye onClick={() => setEduzzDataVisible(!eduzzDataVisible)} />
                  }
                />
              </Col>
              <Col md="4" sm="12">
                <TextField
                  type={eduzzDataVisible ? 'text' : 'password'}
                  id="eduzz_email_key"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.eduzz_email_key',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.eduzz_email_key}
                  placeholder={intl.formatMessage({
                    id: 'company.eduzz_email_key',
                  })}
                  label={intl.formatMessage({
                    id: 'company.eduzz_email_key',
                  })}
                  rightIcon={
                    <Eye onClick={() => setEduzzDataVisible(!eduzzDataVisible)} />
                  }
                />
              </Col>
            </>
          )}
          
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Webhook Token Eduzz</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={eduzzDataVisible ? 'text' : 'password'}
                  id="eduzz_webhook_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.eduzz_webhook_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.eduzz_webhook_token}
                  placeholder={intl.formatMessage({
                    id: 'company.eduzz_webhook_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.eduzz_webhook_token',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setEduzzDataVisible(!eduzzDataVisible)}
                    />
                  }
                />
              </Col>
            </>
          )}
        </>
      )}
    </Row>
    // {/* </Form> */}
  );
};

CompanyEduzz.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyEduzz.defaultProps = {};

export default CompanyEduzz;
