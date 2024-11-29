import React from 'react';
import propTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';
import AliquotField from '../../../../../../components/inputs/AliquotField';

const CompanyEnotasForm = ({ formik }) => {
  const intl = useIntl();

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row className="mt-1">
        <Col className="mt-1" sm="12">
          <h3 className="mb-1 text-primary">
            <span className="align-middle">Dados Municipais</span>
          </h3>
        </Col>
        {formik.values.integrations?.enotas_status && (
          <>
            <Col md="6" sm="12">
              <TextField
                id="municipal_service"
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.municipal_service}
                placeholder={intl.formatMessage({
                  id: 'company.municipal_service',
                })}
                label={intl.formatMessage({ id: 'company.municipal_service' })}
                error={
                  formik.touched.municipal_service &&
                  formik.errors.municipal_service
                }
              />
            </Col>
            <Col md="6" sm="12">
              <AliquotField
                required
                id="aliquot"
                formik={formik}
                label={intl.formatMessage({
                  id: 'company.aliquot',
                })}
              />
            </Col>
            <Col md="12" sm="12">
              <TextField
                id="description_service"
                type="textarea"
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description_service}
                // placeholder={intl.formatMessage({id: !formik.values.person_type || formik.values.person_type === 2 ? 'company.name' : 'company.company_name'})}
                label={intl.formatMessage({
                  id: 'company.description_service',
                })}
                error={
                  formik.touched.description_service &&
                  formik.errors.description_service
                }
              />
            </Col>
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Sequenciais NFs</span>
              </h3>
              <h5 className="mb-1">
                <span className="align-middle">NFs de Serviço</span>
              </h5>
            </Col>
            <Col md="4" sm="12">
              <TextField
                id="enotas_nfs_rps"
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue(
                    'integrations.enotas_nfs_rps',
                    e.target.value
                  )
                }
                value={formik.values.integrations.enotas_nfs_rps}
                placeholder={intl.formatMessage({
                  id: 'company.placeholder.enotas_nfs_rps',
                })}
                label={intl.formatMessage({
                  id: 'company.enotas_nfs_rps',
                })}
                error={
                  formik.touched.enotas_nfs_rps && formik.errors.enotas_nfs_rps
                }
              />
            </Col>
            <Col md="4" sm="12">
              <TextField
                id="enotas_nfs_serie"
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue(
                    'integrations.enotas_nfs_serie',
                    e.target.value
                  )
                }
                value={formik.values.integrations.enotas_nfs_serie}
                placeholder={intl.formatMessage({
                  id: 'company.placeholder.enotas_nfs_serie',
                })}
                label={intl.formatMessage({
                  id: 'company.enotas_nfs_serie',
                })}
                error={
                  formik.touched.enotas_nfs_serie &&
                  formik.errors.enotas_nfs_serie
                }
              />
            </Col>
            <Col md="4" sm="12">
              <TextField
                id="enotas_nfs_batch"
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue(
                    'integrations.enotas_nfs_batch',
                    e.target.value
                  )
                }
                value={formik.values.integrations.enotas_nfs_batch}
                placeholder={intl.formatMessage({
                  id: 'company.placeholder.enotas_nfs_batch',
                })}
                label={intl.formatMessage({
                  id: 'company.enotas_nfs_batch',
                })}
                error={
                  formik.touched.enotas_nfs_batch &&
                  formik.errors.enotas_nfs_batch
                }
              />
            </Col>
            <Col className="mt-1" sm="12">
              <h5 className="mb-1">
                <span className="align-middle">NFs de Produto</span>
              </h5>
            </Col>
            <Col md="4" sm="12">
              <TextField
                id="enotas_nfe_sequential"
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue(
                    'integrations.enotas_nfe_sequential',
                    e.target.value
                  )
                }
                value={formik.values.integrations.enotas_nfe_sequential}
                placeholder={intl.formatMessage({
                  id: 'company.placeholder.enotas_nfe_sequential',
                })}
                label={intl.formatMessage({
                  id: 'company.enotas_nfe_sequential',
                })}
                error={
                  formik.touched.enotas_nfe_sequential &&
                  formik.errors.enotas_nfe_sequential
                }
              />
            </Col>
            <Col md="4" sm="12">
              <TextField
                id="enotas_nfe_series"
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue(
                    'integrations.enotas_nfe_series',
                    e.target.value
                  )
                }
                value={formik.values.integrations.enotas_nfe_series}
                placeholder={intl.formatMessage({
                  id: 'company.placeholder.enotas_nfe_series',
                })}
                label={intl.formatMessage({
                  id: 'company.enotas_nfe_series',
                })}
                error={
                  formik.touched.enotas_nfe_series &&
                  formik.errors.enotas_nfe_series
                }
              />
            </Col>
            <Col md="4" sm="12">
              <TextField
                id="enotas_nfe_batch"
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  formik.setFieldValue(
                    'integrations.enotas_nfe_batch',
                    e.target.value
                  )
                }
                value={formik.values.integrations.enotas_nfe_batch}
                placeholder={intl.formatMessage({
                  id: 'company.placeholder.enotas_nfe_batch',
                })}
                label={intl.formatMessage({
                  id: 'company.enotas_nfe_batch',
                })}
                error={
                  formik.touched.enotas_nfe_batch &&
                  formik.errors.enotas_nfe_batch
                }
              />
            </Col>
          </>
        )}
      </Row>
    </Form>
  );
};

CompanyEnotasForm.propTypes = {
  formik: propTypes.object.isRequired,
};

CompanyEnotasForm.defaultProps = {};

export default CompanyEnotasForm;
