import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Button, Form, Input, Label, FormGroup } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  showProject,
  updateProject,
  createProject,
} from '../../../../services/apis/project.api';
import {
  formatDateToString,
  formatMoney,
  getMonetaryValue,
} from '../../../../utils/formaters';

import PermissionGate from "../../../../PermissionGate";

const ProjectForm = ({ currentCompanyId }) => {
  const history = useHistory();
  const intl = useIntl();
  const { project_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [project, setProject] = useState({});

  const initialValues = {
    name: project.name || '',
    abbreviation: project.abbreviation || '',
    description: project.description || '',
    start_date: project.start_date || '',
    end_date: project.end_date || '',
    forecasted_revenues: project.forecasted_revenues || 0,
    forecasted_expenses: project.forecasted_expenses || 0,
  };

  let permissionButton = '';
  if(project_id)
  {
    permissionButton = 'projects.update';
  }
  else
  {
    permissionButton = 'companies.projects.store';
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    abbreviation: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    description: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    start_date: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    end_date: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    forecasted_revenues: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    forecasted_expenses: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
  });

  const onSubmit = async () => {
    if (project_id) {
      await updateProject(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Projeto atualizado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/project/list');
    } else {
      await createProject(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Projeto criado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/project/list');
    }
  };

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  const mountPayload = () => ({
    project: {
      ...(project_id && { id: project_id }),
      name: formik.values.name,
      abbreviation: formik.values.abbreviation,
      description: formik.values.description,
      start_date:
        typeof formik.values.start_date === 'string'
          ? formik.values.start_date
          : formatDateToString(formik.values.start_date[0]),
      end_date:
        typeof formik.values.end_date === 'string'
          ? formik.values.end_date
          : formatDateToString(formik.values.end_date[0]),
      forecasted_revenues: formik.values.forecasted_revenues,
      forecasted_expenses: formik.values.forecasted_expenses,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      let dataProject = {};
      if (project_id) {
        const res = await showProject({ id: project_id });
        dataProject = res.data;
      }

      setProject(dataProject);
      setInitialized(true);
    };
    fetchData();
  }, [project_id]);

  useEffect(() => {
    if (project?.company_id && currentCompanyId !== project.company_id) {
      history.push(`/admin/project/list`);
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
                    <FormattedMessage id="projects.name" />
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({ id: 'projects.name' })}
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
                    <FormattedMessage id="projects.abbreviation" />
                  </Label>
                  <Input
                    type="text"
                    id="abbreviation"
                    onBlur={formik.handleBlur}
                    value={formik.values.abbreviation}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({
                      id: 'projects.abbreviation',
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
                    <FormattedMessage id="projects.description" />
                  </Label>
                  <Input
                    id="description"
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({
                      id: 'projects.description',
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
            <FormGroup>
              <Label className="d-block" for="start_date">
                <FormattedMessage id="projects.start_date" />
              </Label>
              <Flatpickr
                id="start_date"
                className="form-control"
                options={{
                  dateFormat: 'Y-m-d',
                  altFormat: 'd/m/Y',
                  altInput: true,
                }}
                onBlur={formik.handleBlur}
                value={formik.values.start_date}
                onChange={(date) => formik.setFieldValue('start_date', date)}
              />
              {formik.errors.start_date && formik.touched.start_date ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.start_date}
                </div>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label className="d-block" for="end_date">
                <FormattedMessage id="projects.end_date" />
              </Label>
              <Flatpickr
                id="end_date"
                className="form-control"
                options={{
                  dateFormat: 'Y-m-d',
                  altFormat: 'd/m/Y',
                  altInput: true,
                }}
                onBlur={formik.handleBlur}
                value={formik.values.end_date}
                onChange={(date) => formik.setFieldValue('end_date', date)}
              />
              {formik.errors.end_date && formik.touched.end_date ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.end_date}
                </div>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label for="forecasted_revenues">
                <FormattedMessage id="projects.forecasted_revenues" />
              </Label>
              <Input
                id="forecasted_revenues"
                onBlur={formik.handleBlur}
                value={formatMoney(formik.values.forecasted_revenues)}
                onChange={(e) =>
                  formik.setFieldValue(
                    'forecasted_revenues',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
              />
              {formik.errors.forecasted_revenues &&
              formik.touched.forecasted_revenues ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.forecasted_revenues}
                </div>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label for="forecasted_expenses">
                <FormattedMessage id="projects.forecasted_expenses" />
              </Label>
              <Input
                id="forecasted_expenses"
                onBlur={formik.handleBlur}
                value={formatMoney(formik.values.forecasted_expenses)}
                onChange={(e) =>
                  formik.setFieldValue(
                    'forecasted_expenses',
                    getMonetaryValue(e.target.value)
                  )
                }
                placeholder="0,00"
              />
              {formik.errors.forecasted_expenses &&
              formik.touched.forecasted_expenses ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.forecasted_expenses}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col
            className="d-flex justify-content-end flex-wrap"
            md={{ size: 6, offset: 3 }}
            sm="12"
          >
            <PermissionGate permissions={permissionButton}>
              <Button.Ripple
                className="mt-1"
                color="primary"
                disabled={!(formik.isValid && formik.dirty)}
              >
                <FormattedMessage id="button.save" />
              </Button.Ripple>
            </PermissionGate>
          </Col>
        </Row>
      )}
    </Form>
  );
};

ProjectForm.propTypes = {
  currentCompanyId: PropTypes.string || PropTypes.number,
};

ProjectForm.defaultProps = {
  currentCompanyId: null,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(ProjectForm);
