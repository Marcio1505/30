import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { useFormik } from 'formik';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Label,
  InputGroup,
  Input,
  InputGroupAddon,
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import moment from 'moment';
import { getTransactionStatusOptions } from '../../../../utils/transactions';
import { getSourceOptions } from '../../../../utils/sourceUtils';

import { setFilters as setFiltersPayable } from '../../../../new.redux/payables/payables.actions';
import { setFilters as setFiltersReceivable } from '../../../../new.redux/receivables/receivables.actions';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

const ModalFilterTransaction = ({
  showModalFilterTransaction,
  setShowModalFilterTransaction,
  transactionType,
  isPayable,
  filter,
  bankAccounts,
  categories,
  costCenters,
  projects,
  onFilterSubmit,
  setFiltersPayable,
  setFiltersReceivable,
}) => {
  const sourceOptions = getSourceOptions();
  const transactionStatusOptions = getTransactionStatusOptions(transactionType);
  const bankAccountOptions = bankAccounts.map((bankAccount) => ({
    ...bankAccount,
  }));
  const categoriesOptions = categories.map((category) => ({
    ...category,
  }));
  const costCenterOptions = costCenters.map((costCenter) => ({
    ...costCenter,
  }));
  const projectOptions = projects.map((project) => ({
    ...project,
  }));

  const {
    filter_due_or_payment_date,
    filter_competency_date,
    filter_computed_status,
    filter_categories_ids,
    filter_bank_accounts_ids,
    filter_sources,
    filter_cost_centers,
    filter_projects,
    filter_transactions_ids,
    filter_externals_ids,
  } = filter;

  const animatedComponents = makeAnimated();

  const setNewStates = () => {
    if (transactionType === 'RECEIVABLE') {
      setFiltersReceivable({
        filters: {
          filter_due_or_payment_date: formik.values.dueOrPaymentDate,
          filter_competency_date: formik.values.competencyDate,
          filter_computed_status: formik.values.status,
          filter_categories_ids: formik.values.categoriesIds,
          filter_bank_accounts_ids: formik.values.bankAccountsIds,
          filter_cost_centers: formik.values.costCenters,
          filter_projects: formik.values.projects,
          filter_transactions_ids: formik.values.transactionsIds,
          filter_externals_ids: formik.values.externalsIds,
          filter_sources: formik.values.sources,
          currentPage: 0,
        },
      });
    }
    if (transactionType === 'PAYABLE') {
      setFiltersPayable({
        filters: {
          filter_due_or_payment_date: formik.values.dueOrPaymentDate,
          filter_competency_date: formik.values.competencyDate,
          filter_computed_status: formik.values.status,
          filter_categories_ids: formik.values.categoriesIds,
          filter_bank_accounts_ids: formik.values.bankAccountsIds,
          filter_cost_centers: formik.values.costCenters,
          filter_projects: formik.values.projects,
          filter_transactions_ids: formik.values.transactionsIds,
          filter_externals_ids: formik.values.externalsIds,
          filter_sources: formik.values.sources,
          currentPage: 0,
        },
      });
    }
  };

  const onSubmit = async () => {
    await setNewStates();
  };

  const initialValues = {
    dueOrPaymentDate: filter_due_or_payment_date || [],
    competencyDate: filter_competency_date || [],
    status: filter_computed_status || '',
    categoriesIds: filter_categories_ids || [],
    bankAccountsIds: filter_bank_accounts_ids || [],
    costCenters: filter_cost_centers || [],
    projects: filter_projects || [],
    transactionsIds: filter_transactions_ids || '',
    externalsIds: filter_externals_ids || '',
    sources: filter_sources || [],
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    formik.setValues({
      ...initialValues,
    });
  }, [showModalFilterTransaction]);

  return (
    <Modal
      size="lg"
      isOpen={showModalFilterTransaction}
      toggle={() => setShowModalFilterTransaction(!showModalFilterTransaction)}
      className="modal-dialog-centered"
    >
      <form onSubmit={formik.handleSubmit}>
        <ModalHeader
          toggle={() =>
            setShowModalFilterTransaction(!showModalFilterTransaction)
          }
        >
          Filtro de {isPayable ? 'Contas a Pagar' : 'Contas a Receber'}
        </ModalHeader>
        <ModalBody>
          <Row className="mb-2">
            <Col lg="4" md="6" sm="12" className="mt-2">
              <FormGroup className="mb-0">
                <Label for="filterDueOrPaymentDate">
                  Data de Vencimento/Pagamento
                </Label>
                <InputGroup>
                  <Flatpickr
                    id="filterDueOrPaymentDate"
                    className="form-control"
                    options={{
                      mode: 'range',
                      dateFormat: 'Y-m-d',
                      altFormat: 'd/m/Y',
                      altInput: true,
                    }}
                    value={formik.values.dueOrPaymentDate}
                    onChange={(date) => {
                      if (date.length === 2) {
                        formik.setFieldValue('dueOrPaymentDate', [
                          moment(date[0]).format('YYYY-MM-DD'),
                          moment(date[1]).format('YYYY-MM-DD'),
                        ]);
                      }
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        formik.setFieldValue('dueOrPaymentDate', []);
                      }}
                    >
                      X
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <FormGroup className="mb-0">
                <Label for="filterCompetencyDate">Data de Competência</Label>
                <InputGroup>
                  <Flatpickr
                    id="filterCompetencyDate"
                    className="form-control"
                    options={{
                      mode: 'range',
                      dateFormat: 'Y-m-d',
                      altFormat: 'd/m/Y',
                      altInput: true,
                    }}
                    value={formik.values.competencyDate}
                    onChange={(date) => {
                      if (date.length === 2) {
                        formik.setFieldValue('competencyDate', [
                          moment(date[0]).format('YYYY-MM-DD'),
                          moment(date[1]).format('YYYY-MM-DD'),
                        ]);
                      }
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        formik.setFieldValue('competencyDate', []);
                      }}
                    >
                      X
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Status</Label>
              <Select
                components={animatedComponents}
                options={transactionStatusOptions}
                value={transactionStatusOptions.filter(
                  (option) => option.value === formik.values.status
                )}
                onChange={(selected) => {
                  formik.setFieldValue('status', selected.value);
                }}
                className="React"
                classNamePrefix="select"
              />
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Categoria</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={categoriesOptions}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="categoriesIds"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.categoriesIds}
                onChange={(selectedCategories) => {
                  formik.setFieldValue('categoriesIds', selectedCategories);
                }}
              />
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Fonte</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={sourceOptions}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="sources"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.sources}
                onChange={(selectedSources) => {
                  formik.setFieldValue('sources', selectedSources);
                }}
              />
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Centro de Custos</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={costCenterOptions}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="sources"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.costCenters}
                onChange={(selectedCostCenters) => {
                  formik.setFieldValue(
                    'costCenters',
                    selectedCostCenters || []
                  );
                }}
              />
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Projetos</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={projectOptions}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="sources"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.projects}
                onChange={(selectedProjects) => {
                  formik.setFieldValue('projects', selectedProjects || []);
                }}
              />
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <FormGroup className="mb-0">
                <Label for="branch">IDs (separados por vírgulas)</Label>
                <Input
                  type="text"
                  id="transactionsIds"
                  onBlur={formik.handleBlur}
                  value={formik.values.transactionsIds}
                  onChange={formik.handleChange}
                  placeholder="1,2,3,4"
                />
                {formik.errors.transactionsIds &&
                formik.touched.transactionsIds ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.transactionsIds}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <FormGroup className="mb-0">
                <Label for="branch">
                  IDs Externos (separados por vírgulas)
                </Label>
                <Input
                  type="text"
                  id="externalsIds"
                  onBlur={formik.handleBlur}
                  value={formik.values.externalsIds}
                  onChange={formik.handleChange}
                  placeholder="ex: HP0012345678, pay_47a6b5iwkdhlny4p_fee"
                />
                {formik.errors.externalsIds && formik.touched.externalsIds ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.externalsIds}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Conta Bancária</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                options={bankAccountOptions}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="bankAccountsIds"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.bankAccountsIds}
                onChange={(selectedBankAccounts) => {
                  formik.setFieldValue('bankAccountsIds', selectedBankAccounts);
                }}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() =>
              setShowModalFilterTransaction(!showModalFilterTransaction)
            }
          >
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Filtrar
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

ModalFilterTransaction.propTypes = {
  showModalFilterTransaction: PropTypes.bool.isRequired,
  setShowModalFilterTransaction: PropTypes.func.isRequired,
  onFilterSubmit: PropTypes.func.isRequired,
  transactionType: PropTypes.oneOf(['RECEIVABLE', 'PAYABLE']).isRequired,
  isPayable: PropTypes.bool.isRequired,
  filter: PropTypes.object.isRequired,
  bankAccounts: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  costCenters: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  setFiltersReceivable: PropTypes.func.isRequired,
  setFiltersPayable: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setFiltersReceivable,
  setFiltersPayable,
};

export default connect(null, mapDispatchToProps)(ModalFilterTransaction);
