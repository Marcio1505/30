import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyDominio = ({ formik }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [dominioDataVisible, setDominioDataVisible] = useState(false);

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="dominio_status"
          name="dominio_status"
          inline
          defaultChecked={formik.values.integrations?.dominio_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.dominio_status',
              !formik.values.integrations?.dominio_status
            )
          }
          value={formik.values.integrations?.dominio_status}
        >
          <span className="switch-label">
            Integrar com Dominio
            {/* {intl.formatMessage({ id: 'company?.dominio_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.dominio_status) && (
        <>
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Webhook Token Dominio</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={dominioDataVisible ? 'text' : 'password'}
                  id="dominio_accountant_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.dominio_accountant_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.dominio_accountant_token}
                  placeholder={intl.formatMessage({
                    id: 'company.dominio_accountant_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.dominio_accountant_token',
                  })}
                  rightIcon={
                    <Eye
                      onClick={() => setDominioDataVisible(!dominioDataVisible)}
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

CompanyDominio.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyDominio.defaultProps = {};

export default CompanyDominio;
