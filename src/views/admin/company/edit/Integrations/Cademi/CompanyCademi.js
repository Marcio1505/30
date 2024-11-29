import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyCademi = ({ formik }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [cademiDataVisible, setCademiDataVisible] = useState(false);

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="cademi_status"
          name="cademi_status"
          inline
          defaultChecked={formik.values.integrations?.cademi_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.cademi_status',
              !formik.values.integrations?.cademi_status
            )
          }
          value={formik.values.integrations?.cademi_status}
        >
          <span className="switch-label">
            Integrar com Cademi
            {/* {intl.formatMessage({ id: 'company?.cademi_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.cademi_status) && (
        <>
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Credenciais Cademi</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="4" sm="12">
                <TextField
                  type={cademiDataVisible ? 'text' : 'password'}
                  id="cademi_domain"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.cademi_domain',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.cademi_domain}
                  placeholder={intl.formatMessage({
                    id: 'company.cademi_domain',
                  })}
                  label={intl.formatMessage({
                    id: 'company.cademi_domain',
                  })}
                  rightIcon={
                    <Eye onClick={() => setCademiDataVisible(!cademiDataVisible)} />
                  }
                />
              </Col>
              <Col md="4" sm="12">
                <TextField
                  type={cademiDataVisible ? 'text' : 'password'}
                  id="cademi_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.cademi_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.cademi_token}
                  placeholder={intl.formatMessage({
                    id: 'company.cademi_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.cademi_token',
                  })}
                  rightIcon={
                    <Eye onClick={() => setCademiDataVisible(!cademiDataVisible)} />
                  }
                />
              </Col>
              <Col md="4" sm="12">
                <TextField
                  type={cademiDataVisible ? 'text' : 'password'}
                  id="cademi_api_key"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.cademi_api_key',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.cademi_api_key}
                  placeholder={intl.formatMessage({
                    id: 'company.cademi_api_key',
                  })}
                  label={intl.formatMessage({
                    id: 'company.cademi_api_key',
                  })}
                  rightIcon={
                    <Eye onClick={() => setCademiDataVisible(!cademiDataVisible)} />
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

CompanyCademi.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyCademi.defaultProps = {};

export default CompanyCademi;
