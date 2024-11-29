import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyTicto = ({ formik }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [tictoDataVisible, setTictoDataVisible] = useState(false);

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="ticto_status"
          name="ticto_status"
          inline
          defaultChecked={formik.values.integrations?.ticto_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.ticto_status',
              !formik.values.integrations?.ticto_status
            )
          }
          value={formik.values.integrations?.ticto_status}
        >
          <span className="switch-label">
            Integrar com Ticto
            {/* {intl.formatMessage({ id: 'company?.ticto_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.ticto_status) && (
        <>
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Webhook Token Ticto</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={tictoDataVisible ? 'text' : 'password'}
                  id="ticto_webhook_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.ticto_webhook_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.ticto_webhook_token}
                  placeholder={intl.formatMessage({
                    id: 'company.ticto_webhook_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.ticto_webhook_token',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setTictoDataVisible(!tictoDataVisible)}
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

CompanyTicto.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyTicto.defaultProps = {};

export default CompanyTicto;
