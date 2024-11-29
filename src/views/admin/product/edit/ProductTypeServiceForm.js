import React from 'react';
import { Row, Col, FormGroup, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../components/inputs/TextField';
import AliquotField from '../../../../components/inputs/AliquotField';

const ProductTypeServiceForm = ({ formik }) => {
  const intl = useIntl();
  return (
    <>
      <Row className="mt-1">
        <Col className="mt-1" sm="12">
          <h3 className="mb-1 text-primary">
            <span className="align-middle">NF de Serviço</span>
          </h3>
        </Col>
      </Row>

      <Row className="mt-1">
        <Col md="6" sm="12">
          <TextField
            id="municipal_service"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('municipal_service', e.target.value)
            }
            value={formik.values.municipal_service}
            label={intl.formatMessage({
              id: 'products.municipal_service',
            })}
            error={
              formik.touched.municipal_service &&
              formik.errors.municipal_service
            }
          />
        </Col>
        <Col md="6" sm="12">
          <AliquotField
            id="aliquot"
            formik={formik}
            label={intl.formatMessage({
              id: 'products.aliquot',
            })}
          />
        </Col>
        <Col md="12" sm="12">
          <TextField
            id="description_service"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('description_service', e.target.value)
            }
            value={formik.values.description_service}
            label={intl.formatMessage({
              id: 'products.description_service',
            })}
            error={
              formik.touched.description_service &&
              formik.errors.description_service
            }
          />
        </Col>
      </Row>
      <Row className="mt-1">
        <Col md="6" sm="12">
          <TextField
            id="cnae"
            onBlur={formik.handleBlur}
            onChange={(e) => formik.setFieldValue('cnae', e.target.value)}
            value={formik.values.cnae}
            label={intl.formatMessage({
              id: 'products.cnae',
            })}
            error={formik.touched.cnae && formik.errors.cnae}
          />
        </Col>
        <Col md="6" sm="12">
          <TextField
            id="service_list_item"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue('service_list_item', e.target.value)
            }
            value={formik.values.service_list_item}
            label={intl.formatMessage({
              id: 'products.service_list_item',
            })}
            error={
              formik.touched.service_list_item &&
              formik.errors.service_list_item
            }
          />
        </Col>
      </Row>
      <Row className="mt-1">
        <Col className="mt-1" sm="12">
          <FormGroup>
            <CustomInput
              type="switch"
              id="iss_withholding"
              name="iss_withholding"
              inline
              defaultChecked={formik.values.iss_withholding}
              onBlur={formik.handleBlur}
              onChange={() =>
                formik.setFieldValue(
                  'iss_withholding',
                  !formik.values.iss_withholding
                )
              }
              value={formik.values.iss_withholding}
            >
              <span className="switch-label">
                {intl.formatMessage({ id: 'products.iss_withholding' })}
              </span>
            </CustomInput>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

ProductTypeServiceForm.propTypes = {};

ProductTypeServiceForm.defaultProps = {};

export default ProductTypeServiceForm;
