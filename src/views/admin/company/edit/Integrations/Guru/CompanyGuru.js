import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyGuru = ({ formik }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [guruDataVisible, setGuruDataVisible] = useState(false);

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="guru_status"
          name="guru_status"
          inline
          defaultChecked={formik.values.integrations?.guru_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.guru_status',
              !formik.values.integrations?.guru_status
            )
          }
          value={formik.values.integrations?.guru_status}
        >
          <span className="switch-label">
            Integrar com Guru
            {/* {intl.formatMessage({ id: 'company?.guru_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.guru_status) && (
        <>
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Credenciais Guru</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={guruDataVisible ? 'text' : 'password'}
                  id="guru_account_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.guru_account_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.guru_account_token}
                  placeholder={intl.formatMessage({
                    id: 'company.guru_account_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.guru_account_token',
                  })}
                  rightIcon={
                    <Eye onClick={() => setGuruDataVisible(!guruDataVisible)} />
                  }
                />
              </Col>
            </>
          )}
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Webhook Token Guru</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12">
                <TextField
                  type={guruDataVisible ? 'text' : 'password'}
                  id="guru_webhook_token"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'integrations.guru_webhook_token',
                      e.target.value
                    )
                  }
                  value={formik.values.integrations?.guru_webhook_token}
                  placeholder={intl.formatMessage({
                    id: 'company.guru_webhook_token',
                  })}
                  label={intl.formatMessage({
                    id: 'company.guru_webhook_token',
                  })}
                  rightIcon={
                    <Eye onClick={() => setGuruDataVisible(!guruDataVisible)} />
                  }
                />
              </Col>
            </>
          )}

          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Gateway no Guru</span>
              </h3>
            </Col>
          )}
          {formik.values.person_type && (
            <>
              <Col md="12" sm="12" className="mt-2">
                <CustomInput
                  type="switch"
                  id="guru_pagarme_status"
                  name="guru_pagarme_status"
                  inline
                  defaultChecked={
                    formik.values.integrations?.guru_pagarme_status
                  }
                  onBlur={formik.handleBlur}
                  onChange={() =>
                    formik.setFieldValue(
                      'integrations.guru_pagarme_status',
                      !formik.values.integrations?.guru_pagarme_status
                    )
                  }
                  value={formik.values.integrations?.guru_pagarme_status}
                >
                  <span className="switch-label">
                    Pagarme
                    {}
                  </span>
                </CustomInput>
                
                <CustomInput
                  type="switch"
                  id="guru2_pagarme2_status"
                  name="guru2_pagarme2_status"
                  inline
                  defaultChecked={
                    formik.values.integrations?.guru2_pagarme2_status
                  }
                  onBlur={formik.handleBlur}
                  onChange={() =>
                    formik.setFieldValue(
                      'integrations.guru2_pagarme2_status',
                      !formik.values.integrations?.guru2_pagarme2_status
                    )
                  }
                  value={formik.values.integrations?.guru2_pagarme2_status}
                >
                  <span className="switch-label">
                    Pagarme 2.0
                    {}
                  </span>
                </CustomInput>

                {/* <CustomInput
                  type="switch"
                  id="guru_eduzz_status"
                  name="guru_eduzz_status"
                  inline
                  defaultChecked={formik.values.integrations?.guru_eduzz_status}
                  onBlur={formik.handleBlur}
                  onChange={() =>
                    formik.setFieldValue(
                      'integrations.guru_eduzz_status',
                      !formik.values.integrations?.guru_eduzz_status
                    )
                  }
                  value={formik.values.integrations?.guru_eduzz_status}
                >
                  <span className="switch-label">
                    Eduzz
                    {}
                  </span>
                </CustomInput> */}
              </Col>
            </>
          )}
        </>
      )}
    </Row>
    // {/* </Form> */}
  );
};

CompanyGuru.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyGuru.defaultProps = {};

export default CompanyGuru;
