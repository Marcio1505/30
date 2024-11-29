import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Form, Input, Label, FormGroup } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  showCostCenter,
  updateCostCenter,
  createCostCenter,
} from '../../../../services/apis/cost_center.api';

const CostCenterForm = ({ currentCompanyId }) => {
  const history = useHistory();
  const intl = useIntl();
  const { cost_center_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [costCenter, setCostCenter] = useState({});

  const mountPayload = () => ({
    costCenter: {
      ...(cost_center_id && { id: cost_center_id }),
      name: formik.values.name,
      abbreviation: formik.values.abbreviation,
      description: formik.values.description,
    },
  });

  const onSubmit = async () => {
    if (cost_center_id) {
      await updateCostCenter(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Centro de custo atualizado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/cost-center/list');
    } else {
      await createCostCenter(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Centro de custo criado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/cost-center/list');
    }
  };

  const initialValues = {
    name: costCenter.name || '',
    abbreviation: costCenter.abbreviation || '',
    description: costCenter.description || '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    abbreviation: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    description: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      let dataCostCenter = {};
      if (cost_center_id) {
        const res = await showCostCenter({ id: cost_center_id });
        dataCostCenter = res.data;
      }

      setCostCenter(dataCostCenter);
      setInitialized(true);
    };
    fetchData();
  }, [cost_center_id]);

  useEffect(() => {
    if (costCenter?.company_id && currentCompanyId !== costCenter.company_id) {
      history.push(`/admin/cost-center/list`);
    }
  }, [currentCompanyId]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      {initialized && (
        <Row className="mt-1">
          <Col className="mt-1" md={{ size: 6, offset: 3 }} sm="12">
            <Row>
              <Col md="8" sm="12">
                <FormGroup>
                  <Label for="name">
                    <FormattedMessage id="cost_centers.name" />
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({
                      id: 'cost_centers.name',
                    })}
                  />
                  {formik.errors.name && formik.touched.name ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
              <Col md="4" sm="12">
                <FormGroup>
                  <Label for="abbreviation">
                    <FormattedMessage id="cost_centers.abbreviation" />
                  </Label>
                  <Input
                    type="text"
                    id="abbreviation"
                    onBlur={formik.handleBlur}
                    value={formik.values.abbreviation}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({
                      id: 'cost_centers.abbreviation',
                    })}
                  />
                  {formik.errors.abbreviation && formik.touched.abbreviation ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.abbreviation}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label for="description">
                    <FormattedMessage id="cost_centers.description" />
                  </Label>
                  <Input
                    id="description"
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({
                      id: 'cost_centers.description',
                    })}
                  />
                  {formik.errors.description && formik.touched.description ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.description}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col
            className="d-flex justify-content-end flex-wrap"
            md={{ size: 6, offset: 3 }}
            sm="12"
          >
            <Button.Ripple
              className="mt-1"
              color="primary"
              disabled={!(formik.isValid && formik.dirty)}
            >
              <FormattedMessage id="button.save" />
            </Button.Ripple>
          </Col>
        </Row>
      )}
    </Form>
  );
};

CostCenterForm.propTypes = {};

CostCenterForm.defaultProps = {};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(CostCenterForm);
