import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyKiwify = ({ formik }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [kiwifyDataVisible, setKiwifyDataVisible] = useState(false);

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="kiwify_status"
          name="kiwify_status"
          inline
          defaultChecked={formik.values.integrations?.kiwify_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.kiwify_status',
              !formik.values.integrations?.kiwify_status
            )
          }
          value={formik.values.integrations?.kiwify_status}
        >
          <span className="switch-label">
            Integrar com Kiwify
            {/* {intl.formatMessage({ id: 'company?.kiwify_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.kiwify_status) && (
        <>
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Webhook Token Kiwify</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={kiwifyDataVisible ? 'text' : 'password'}
                  id="kiwify_webhook_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.kiwify_webhook_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.kiwify_webhook_token}
                  placeholder={intl.formatMessage({
                    id: 'company.kiwify_webhook_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.kiwify_webhook_token',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setKiwifyDataVisible(!kiwifyDataVisible)}
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

CompanyKiwify.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyKiwify.defaultProps = {};

export default CompanyKiwify;
