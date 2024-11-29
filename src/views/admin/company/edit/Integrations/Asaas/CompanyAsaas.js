import React from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

const CompanyAsaas = ({ formik }) => {
  const intl = useIntl();

  return (
    <Row className="mt-1">
      <Col md="12" sm="12" className="mt-2">
        <CustomInput
          type="switch"
          id="asaas_status"
          name="asaas_status"
          inline
          defaultChecked={formik.values.integrations?.asaas_status}
          onBlur={formik.handleBlur}
          onChange={() =>
            formik.setFieldValue(
              'integrations.asaas_status',
              !formik.values.integrations?.asaas_status
            )
          }
          value={formik.values.integrations?.asaas_status}
        >
          <span className="switch-label">
            Habilitar Conta IULI
            {/* {intl.formatMessage({ id: 'company?.asaas_status' })} */}
          </span>
        </CustomInput>
      </Col>
      {Boolean(formik.values.integrations?.asaas_status) && (
        <>
          <Col className="mt-2" md="6" sm="12">
            <TextField
              id="asaas_email"
              onBlur={formik.handleBlur}
              readOnly={
                formik.values.integrations?.asaas_email &&
                formik.values.integrations?.asaas_api_key
              }
              onChange={(e) =>
                formik.setFieldValue('integrations.asaas_email', e.target.value)
              }
              value={formik.values.integrations?.asaas_email}
              placeholder={intl.formatMessage({
                id: 'company.placeholder.asaas_email',
              })}
              label={intl.formatMessage({
                id: 'company.asaas_email',
              })}
            />
          </Col>
        </>
      )}
    </Row>
    // {/* </Form> */}
  );
};

CompanyAsaas.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyAsaas.defaultProps = {};

export default CompanyAsaas;
