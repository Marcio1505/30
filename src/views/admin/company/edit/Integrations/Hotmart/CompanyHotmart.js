import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyHotmart = ({ formik }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [hotmartDataVisible, setHotmartDataVisible] = useState(false);

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="hotmart_status"
          name="hotmart_status"
          inline
          defaultChecked={formik.values.integrations?.hotmart_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.hotmart_status',
              !formik.values.integrations?.hotmart_status
            )
          }
          value={formik.values.integrations?.hotmart_status}
        >
          <span className="switch-label">
            Integrar com Hotmart
            {/* {intl.formatMessage({ id: 'company?.hotmart_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.hotmart_status) && (
        <>
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Credenciais Hotmart</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="6" sm="12">
                <TextField
                  type={hotmartDataVisible ? 'text' : 'password'}
                  id="hotmart_client_id"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.hotmart_client_id',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.hotmart_client_id}
                  placeholder={intl.formatMessage({
                    id: 'company.hotmart_client_id',
                  })}
                  label={intl.formatMessage({
                    id: 'company.hotmart_client_id',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setHotmartDataVisible(!hotmartDataVisible)}
                    />
                  }
                />
              </Col>
              <Col md="6" sm="12">
                <TextField
                  type={hotmartDataVisible ? 'text' : 'password'}
                  id="hotmart_client_secret"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.hotmart_client_secret',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.hotmart_client_secret}
                  placeholder={intl.formatMessage({
                    id: 'company.hotmart_client_secret',
                  })}
                  label={intl.formatMessage({
                    id: 'company.hotmart_client_secret',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setHotmartDataVisible(!hotmartDataVisible)}
                    />
                  }
                />
              </Col>
              <Col md="12" sm="12">
                <TextField
                  type={hotmartDataVisible ? 'text' : 'password'}
                  id="hotmart_basic"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.hotmart_basic',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.hotmart_basic}
                  placeholder={intl.formatMessage({
                    id: 'company.hotmart_basic',
                  })}
                  label={intl.formatMessage({
                    id: 'company.hotmart_basic',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setHotmartDataVisible(!hotmartDataVisible)}
                    />
                  }
                />
              </Col>
            </>
          )}
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Webhook Token Hotmart</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={hotmartDataVisible ? 'text' : 'password'}
                  id="hotmart_webhook_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.hotmart_webhook_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.hotmart_webhook_token}
                  placeholder={intl.formatMessage({
                    id: 'company.hotmart_webhook_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.hotmart_webhook_token',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setHotmartDataVisible(!hotmartDataVisible)}
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

CompanyHotmart.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyHotmart.defaultProps = {};

export default CompanyHotmart;
