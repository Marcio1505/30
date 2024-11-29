import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Card,
  CardBody,
  Button,
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import DfcTable from './DfcTable';

import { fetchCostCentersList } from '../../../../services/apis/cost_center.api';
import { fetchProjectsList } from '../../../../services/apis/project.api';
import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';
import { getDfc } from '../../../../services/apis/statements.api';

import { getStatementExcelFileName } from '../../../../utils/tableUtils';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import PermissionGate from '../../../../PermissionGate';

const DfcPage = ({ currentCompanyId, currentCompany, currentUser }) => {
  const intl = useIntl();
  // const params = queryString.parse(location?.search);
  const params = null;
  const [initialized, setInitialized] = useState(false);
  const [dfcData, setDfcData] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [projects, setProjects] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  const excelFileName = getStatementExcelFileName(
    currentCompany,
    currentUser,
    'DFC'
  );

  const getCostCenters = async () => {
    const { data: costCentersData } = await fetchCostCentersList();
    setCostCenters(
      costCentersData.map((costCenter) => ({
        value: costCenter.id,
        label: costCenter.name,
      }))
    );
  };

  const getProjects = async () => {
    const { data: projectsData } = await fetchProjectsList();
    setProjects(
      projectsData.map((project) => ({
        value: project.id,
        label: project.name,
      }))
    );
  };

  const getBankAccounts = async () => {
    const { data: bankAccountsData } = await fetchBankAccountsList();
    setBankAccounts(
      bankAccountsData.map((bankAccount) => ({
        value: bankAccount.id,
        label: bankAccount.name,
      }))
    );
  };

  const getInitialData = async () => {
    setInitialized(false);
    setDfcData([]);
    await Promise.all([getCostCenters(), getProjects(), getBankAccounts()]);
  };

  useEffect(() => {
    formik.initialValues = initialValues;
    getInitialData();
  }, [currentCompanyId]);

  const loadDfcData = async ({ params = null } = {}) => {
    const newDfcData = await getDfc({
      params,
    });
    setDfcData(newDfcData);
    setInitialized(true);
  };

  const initialValues = {
    statement_type_id: params?.statement_type_id || 1,
    date_range: params?.date_range || [
      moment().format('YYYY-MM-01'),
      moment().format('YYYY-MM-') + moment().daysInMonth(),
    ],
    date_from: params?.date_from || moment().format('YYYY-MM-01'),
    date_to:
      params?.date_to || moment().format('YYYY-MM-') + moment().daysInMonth(),
    project_id: params?.project_id || '',
    cost_center_id: params?.cost_center_id || '',
    bank_account_id: params?.bank_account_id || '',
    projects_ids: params?.projects_ids || [],
    cost_centers_ids: params?.cost_centers_ids || [],
    bank_accounts_ids: params?.bank_accounts_ids || [],
  };

  const validationSchema = Yup.object().shape({
    statement_type_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
  });

  const onSubmit = () => {
    handleSubmitForm();
  };

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  const handleSubmitForm = () => {
    const date_from =
      typeof formik.values.date_range[0] === 'string'
        ? formik.values.date_range[0]
        : moment(formik.values.date_range[0]).format('YYYY-MM-DD');
    const date_to =
      typeof formik.values.date_range[1] === 'string'
        ? formik.values.date_range[1]
        : moment(formik.values.date_range[1]).format('YYYY-MM-DD');

    let params = `?date_from=${date_from}&date_to=${date_to}&statement_type_id=${formik.values.statement_type_id}`;

    params = formik.values.projects_ids.length
      ? `${params}&projects_ids[]=${formik.values.projects_ids.join(
          '&projects_ids[]='
        )}`
      : params;

    params = formik.values.cost_centers_ids.length
      ? `${params}&cost_centers_ids[]=${formik.values.cost_centers_ids.join(
          '&cost_centers_ids[]='
        )}`
      : params;

    params = formik.values.bank_accounts_ids.length
      ? `${params}&bank_accounts_ids[]=${formik.values.bank_accounts_ids.join(
          '&bank_accounts_ids[]='
        )}`
      : params;

    loadDfcData({
      params,
    });
  };

  const dre_types = [
    {
      value: 1,
      label: 'AV',
    },
    {
      value: 2,
      label: 'AH',
    },
  ];

  return (
    <>
      <PermissionGate permissions="api.statements.getDfc">
        <Breadcrumbs breadCrumbTitle="Dfc" breadCrumbActive="Dfc" />
        <Card>
          <CardBody>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="mt-1">
                <Col md="4" sm="12">
                  <FormGroup>
                    <Label className="d-block" for="date_range">
                      <FormattedMessage id="dre.date_range" /> *
                    </Label>
                    <Flatpickr
                      id="date_range"
                      className="form-control"
                      options={{
                        mode: 'range',
                        dateFormat: 'Y-m-d',
                        altFormat: 'd/m/Y',
                        altInput: true,
                      }}
                      onBlur={() => formik.handleBlur}
                      value={formik.values.date_range}
                      onChange={(date) => {
                        if (date.length === 2) {
                          formik.setFieldValue('date_range', date);
                        }
                      }}
                    />
                    {formik.errors.date_range && formik.touched.date_range ? (
                      <div className="invalid-tooltip mt-25">
                        {formik.errors.date_range}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md="2" sm="12">
                  <FormGroup>
                    <Label for="dre_type">
                      <FormattedMessage id="dre.type" /> *
                    </Label>
                    <Select
                      options={dre_types}
                      className="React"
                      classNamePrefix="select"
                      id="dre_type"
                      onBlur={formik.handleBlur}
                      defaultValue={dre_types.filter(
                        (type) =>
                          type.value === formik.initialValues.statement_type_id
                      )}
                      onChange={(type) => {
                        formik.setFieldValue('statement_type_id', type.value);
                      }}
                    />
                    {formik.errors.statement_type_id &&
                    formik.touched.statement_type_id ? (
                      <div className="invalid-tooltip mt-25">
                        {formik.errors.statement_type_id}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="bank_accounts_ids">
                      <FormattedMessage id="bank_accounts" />
                    </Label>
                    <Select
                      isMulti
                      closeMenuOnSelect={false}
                      options={bankAccounts}
                      className="React"
                      classNamePrefix="select"
                      id="bank_accounts_ids"
                      onBlur={formik.handleBlur}
                      defaultValue={formik.initialValues.bank_accounts_ids}
                      onChange={(_bankAccounts) => {
                        formik.setFieldValue(
                          'bank_accounts_ids',
                          (_bankAccounts || []).map(
                            (bankAccount) => bankAccount.value
                          )
                        );
                      }}
                    />
                    {formik.errors.bank_accounts_ids &&
                    formik.touched.bank_accounts_ids ? (
                      <div className="invalid-tooltip mt-25">
                        {formik.errors.bank_accounts_ids}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="projects_ids">
                      <FormattedMessage id="project" />
                    </Label>
                    <Select
                      isMulti
                      closeMenuOnSelect={false}
                      options={projects}
                      className="React"
                      classNamePrefix="select"
                      id="projects_ids"
                      onBlur={formik.handleBlur}
                      defaultValue={formik.initialValues.projects_ids}
                      onChange={(_projects) => {
                        formik.setFieldValue(
                          'projects_ids',
                          (_projects || []).map((project) => project.value)
                        );
                      }}
                    />
                    {formik.errors.projects_ids &&
                    formik.touched.projects_ids ? (
                      <div className="invalid-tooltip mt-25">
                        {formik.errors.projects_ids}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="cost_centers_ids">
                      <FormattedMessage id="cost_center" />
                    </Label>
                    <Select
                      isMulti
                      closeMenuOnSelect={false}
                      options={costCenters}
                      className="React"
                      classNamePrefix="select"
                      id="cost_centers_ids"
                      onBlur={formik.handleBlur}
                      defaultValue={formik.initialValues.cost_centers_ids}
                      onChange={(_cost_centers) => {
                        formik.setFieldValue(
                          'cost_centers_ids',
                          (_cost_centers || []).map(
                            (cost_center) => cost_center.value
                          )
                        );
                      }}
                    />
                    {formik.errors.cost_centers_ids &&
                    formik.touched.cost_centers_ids ? (
                      <div className="invalid-tooltip mt-25">
                        {formik.errors.cost_centers_ids}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-end flex-wrap" sm="12">
                  <Button.Ripple
                    className="mt-1 mb-2"
                    color="primary"
                    type="submit"
                  >
                    <FormattedMessage id="button.load.statement.dfc" />
                  </Button.Ripple>
                </Col>
              </Row>
            </Form>
          </CardBody>
          {initialized && (
            <DfcTable
              formik={formik}
              dfcData={dfcData}
              excelFileName={excelFileName}
            />
          )}
        </Card>
      </PermissionGate>
    </>
  );
};

DfcPage.propTypes = {
  currentCompany: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  currentCompanyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  currentCompany: state.companies.currentCompany,
  currentUser: state.auth?.login?.values?.loggedInUser,
});

export default connect(mapStateToProps)(DfcPage);
