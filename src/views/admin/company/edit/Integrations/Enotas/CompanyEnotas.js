import React from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';

import CompanyEnotasCertificateForm from './CompanyEnotasCertificateForm';
import CompanyEnotasForm from './CompanyEnotasForm';
import CompanyEnotasExteriorForm from './CompanyEnotasExteriorForm';

const CompanyEnotas = ({ formik }) => (
  <Row className="mt-1">
    <Col md="12" sm="12" className="mt-2">
      <CustomInput
        type="switch"
        id="enotas_status"
        name="enotas_status"
        inline
        defaultChecked={formik.values.integrations?.enotas_status}
        onBlur={formik.handleBlur}
        onChange={() =>
          formik.setFieldValue(
            'integrations.enotas_status',
            !formik.values.integrations?.enotas_status
          )
        }
        value={formik.values.integrations?.enotas_status}
      >
        <span className="switch-label">
          Habilitar Emissões de NFs
          {/* {intl.formatMessage({ id: 'company?.enotas_status' })} */}
        </span>
      </CustomInput>
    </Col>
    <Col md="12" sm="12" className="mt-2">
      {Boolean(formik.values.integrations?.enotas_status) && (
        <>
          <CompanyEnotasForm formik={formik} />
          <CompanyEnotasCertificateForm formik={formik} />
          <CompanyEnotasExteriorForm formik={formik} />
        </>
      )}
    </Col>
  </Row>
);
CompanyEnotas.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyEnotas.defaultProps = {};

export default CompanyEnotas;
