import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyHubla = ({ formik }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [hublaDataVisible, setHublaDataVisible] = useState(false);

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="hubla_status"
          name="hubla_status"
          inline
          defaultChecked={formik.values.integrations?.hubla_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.hubla_status',
              !formik.values.integrations?.hubla_status
            )
          }
          value={formik.values.integrations?.hubla_status}
        >
          <span className="switch-label">
            Integrar com Hubla
            {/* {intl.formatMessage({ id: 'company?.hubla_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.hubla_status) && (
        <>
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Webhook Token Hubla</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={hublaDataVisible ? 'text' : 'password'}
                  id="hubla_webhook_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.hubla_webhook_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.hubla_webhook_token}
                  placeholder={intl.formatMessage({
                    id: 'company.hubla_webhook_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.hubla_webhook_token',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setHublaDataVisible(!hublaDataVisible)}
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

CompanyHubla.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyHubla.defaultProps = {};

export default CompanyHubla;
