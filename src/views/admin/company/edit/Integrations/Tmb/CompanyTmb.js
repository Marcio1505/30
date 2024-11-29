import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyTmb = ({ formik }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [tmbDataVisible, setTmbDataVisible] = useState(false);

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="tmb_status"
          name="tmb_status"
          inline
          defaultChecked={formik.values.integrations?.tmb_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.tmb_status',
              !formik.values.integrations?.tmb_status
            )
          }
          value={formik.values.integrations?.tmb_status}
        >
          <span className="switch-label">
            Integrar com Tmb
            {/* {intl.formatMessage({ id: 'company?.tmb_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.tmb_status) && (
        <>
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Webhook Token Tmb</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={tmbDataVisible ? 'text' : 'password'}
                  id="tmb_webhook_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.tmb_webhook_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.tmb_webhook_token}
                  placeholder={intl.formatMessage({
                    id: 'company.tmb_webhook_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.tmb_webhook_token',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setTmbDataVisible(!tmbDataVisible)}
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

CompanyTmb.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyTmb.defaultProps = {};

export default CompanyTmb;
