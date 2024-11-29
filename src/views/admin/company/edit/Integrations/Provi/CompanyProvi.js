import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyProvi = ({ formik }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [proviDataVisible, setProviDataVisible] = useState(false);

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="provi_status"
          name="provi_status"
          inline
          defaultChecked={formik.values.integrations?.provi_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.provi_status',
              !formik.values.integrations?.provi_status
            )
          }
          value={formik.values.integrations?.provi_status}
        >
          <span className="switch-label">
            Integrar com Provi
            {/* {intl.formatMessage({ id: 'company?.provi_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.provi_status) && (
        <>
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Credenciais Provi</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={proviDataVisible ? 'text' : 'password'}
                  id="provi_account_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.provi_account_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.provi_account_token}
                  placeholder={intl.formatMessage({
                    id: 'company.provi_account_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.provi_account_token',
                  })}
                  rightIcon={
                    <Eye onClick={() => setProviDataVisible(!proviDataVisible)} />
                  }
                />
              </Col>
            </>
          )}
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Webhook Token Provi</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={proviDataVisible ? 'text' : 'password'}
                  id="provi_webhook_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.provi_webhook_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.provi_webhook_token}
                  placeholder={intl.formatMessage({
                    id: 'company.provi_webhook_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.provi_webhook_token',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setProviDataVisible(!proviDataVisible)}
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

CompanyProvi.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyProvi.defaultProps = {};

export default CompanyProvi;
