import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  CustomInput,
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';

import { exit } from 'yargs';
import BudgetCategoriesTable from './BudgetCategoriesTable';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  showBudget,
  updateBudget,
  createBudget,
} from '../../../../services/apis/budget.api';

import { fetchProjectsList } from '../../../../services/apis/project.api';

import { fetchCategoriesList } from '../../../../services/apis/category.api';

import { formatDateToString } from '../../../../utils/formaters';

import { activeInactiveStatus } from '../../../../data/generalStatus';
import { budgetTypes } from '../../../../data/budget';

import PermissionGate from '../../../../PermissionGate';

const BudgetForm = ({ currentCompanyId, currentCompany }) => {
  const history = useHistory();
  const intl = useIntl();
  const { budget_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [budget, setBudget] = useState({});
  const [projects, setProjects] = useState({});
  const [categories, setCategories] = useState({});

  const budgetStatus = activeInactiveStatus;

  let permissionButton = '';

  if (budget_id) {
    permissionButton = 'budgets.update';
  } else {
    permissionButton = 'companies.budgets.store';
  }

  const mountPayload = () => {
    const payload_categories = formik.values.categories.map((category) => {
      const dataCategory = categories.find((cat) => cat.id === category.id);
      return {
        ...category,
        category_id: dataCategory.category_id,
        dre_category_id: dataCategory.dre_category_id,
        transaction_category_id: dataCategory.transaction_category_id,
        type: dataCategory.type,
      };
    });
    return {
      budget: {
        ...(budget_id && { id: budget_id }),
        name: formik.values.name,
        description: formik.values.description,
        start_date:
          typeof formik.values.start_date === 'string'
            ? formik.values.start_date
            : formatDateToString(formik.values.start_date[0]),
        end_date:
          typeof formik.values.end_date === 'string'
            ? formik.values.end_date
            : formatDateToString(formik.values.end_date[0]),
        type: formik.values.type,
        project_id: formik.values.project_id,
        status: formik.values.status,
        categories: payload_categories,
      },
    };
  };

  const onSubmit = async () => {
    if (budget_id) {
      await updateBudget(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Orçamento atualizado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/budget/list');
    } else {
      await createBudget(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Orçamento criado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/budget/list');
    }
  };

  const initialValues = {
    name: budget.name || '',
    description: budget.description || '',
    start_date: budget.start_date || '',
    end_date: budget.end_date || '',
    type: budget.type || '',
    project_id: budget.project_id || '',
    status: budget.status || 1,
    categories: (
      budget.transaction_subcategories ||
      budget.categories ||
      []
    ).map((category) => ({
      ...category,
      rowId: category.id,
    })),
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    description: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    start_date: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    end_date: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    type: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      let dataBudget = {};
      if (budget_id) {
        const res = await showBudget({ id: budget_id });
        dataBudget = res.data;
      }
      setBudget(dataBudget);

      const { data: dataProjects } = await fetchProjectsList();
      setProjects(
        dataProjects.map((project) => ({
          value: project.id,
          label: project.name,
        }))
      );

      const { data: dataCategories } = await fetchCategoriesList();
      setCategories(
        dataCategories.map((category) => ({
          ...category,
          value: category.id,
          label: category.name,
        }))
      );

      setInitialized(true);
    };
    fetchInitialData();
  }, [budget_id]);

  useEffect(() => {
    if (budget?.company_id && currentCompanyId !== budget.company_id) {
      history.push(`/admin/budget/list`);
    }
  }, [currentCompanyId]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      {initialized && (
        <Row className="mt-1">
          <Col className="mt-1" md={{ size: 6, offset: 3 }} sm="12">
            <Row>
              <Col md="12" sm="12">
                <FormGroup>
                  <Label for="name">
                    <FormattedMessage id="budgets.name" /> *
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({ id: 'budgets.name' })}
                  />
                  {formik.errors.name && formik.touched.name ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label for="description">
                    <FormattedMessage id="budgets.description" /> *
                  </Label>
                  <Input
                    id="description"
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder={intl.formatMessage({
                      id: 'budgets.description',
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
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label className="d-block" for="start_date">
                    <FormattedMessage id="budgets.start_date" /> *
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
                    onChange={(date) =>
                      formik.setFieldValue('start_date', date)
                    }
                  />
                  {formik.errors.start_date && formik.touched.start_date ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.start_date}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label className="d-block" for="end_date">
                    <FormattedMessage id="budgets.end_date" /> *
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
              </Col>
            </Row>
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="type">
                    <FormattedMessage id="budgets.type" /> *
                  </Label>
                  <Select
                    options={budgetTypes}
                    className="React"
                    classNamePrefix="select"
                    id="type"
                    onBlur={formik.handleBlur}
                    defaultValue={budgetTypes.filter(
                      (type) => type.value === formik.initialValues.type
                    )}
                    onChange={(opt) => {
                      formik.setFieldValue('type', opt.value);
                    }}
                  />
                  {formik.errors.type && formik.touched.type ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.type}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
              {formik.values.type === 2 && (
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="project">
                      <FormattedMessage id="budgets.project" /> *
                    </Label>
                    <Select
                      options={projects}
                      className="React"
                      classNamePrefix="select"
                      id="project"
                      onBlur={formik.handleBlur}
                      defaultValue={projects.filter(
                        (project) =>
                          project.value === formik.initialValues.project_id
                      )}
                      onChange={(opt) => {
                        formik.setFieldValue('project_id', opt.value);
                      }}
                    />
                    {formik.errors.type && formik.touched.type ? (
                      <div className="invalid-tooltip mt-25">
                        {formik.errors.type}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
              )}
            </Row>
            <Row>
              <Col sm="12" className="my-2">
                <BudgetCategoriesTable
                  formik={formik}
                  categories={categories}
                />
              </Col>
            </Row>
            {Boolean(budget_id) && (
              <Row>
                <Col md="6" sm="12">
                  <FormGroup>
                    <CustomInput
                      type="switch"
                      id="status"
                      name="status"
                      inline
                      defaultChecked={formik.values.status}
                      onBlur={formik.handleBlur}
                      onChange={(e) =>
                        formik.setFieldValue('status', !formik.values.status)
                      }
                      value={formik.values.status}
                    >
                      <span className="switch-label">
                        {intl.formatMessage({ id: 'budgets.status' })}
                      </span>
                    </CustomInput>
                  </FormGroup>
                </Col>
              </Row>
            )}
            <Row>
              <Col
                className="d-flex justify-content-end flex-wrap"
                md={{ size: 6, offset: 6 }}
                sm="12"
              >
                <PermissionGate permissions={permissionButton}>
                  <Button.Ripple className="mt-1" color="primary">
                    <FormattedMessage id="button.save" />
                  </Button.Ripple>
                </PermissionGate>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </Form>
  );
};

BudgetForm.propTypes = {};

BudgetForm.defaultProps = {};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  currentCompany: state.companies.currentCompany,
});

export default connect(mapStateToProps)(BudgetForm);
