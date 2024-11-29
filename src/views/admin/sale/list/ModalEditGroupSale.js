import React, { useEffect } from 'react';
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
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';

import { updateGroupSale } from '../../../../services/apis/sale.api';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import { formatDateToString } from '../../../../utils/formaters';
import { getSaleSourceOptions } from '../../../../utils/sales';

const ModalEditGroupSale = ({
  salesToEdit,
  showModalEditGroupSale,
  setShowModalEditGroupSale,
  projects,
  bankAccounts,
  costCenters,
  categories,
  getSales,
}) => {
  const hasAsaasSale = salesToEdit.some((sale) => sale.source === 'ASAAS');
  const allSalesWithUndefinedSource = !salesToEdit.some(
    (sale) => sale.source !== 'UNDEFINED'
  );
  const allSalesInCash = !salesToEdit.some((sale) => sale.installments >= 2);

  let saleSourceOptions = getSaleSourceOptions();
  saleSourceOptions = saleSourceOptions.filter(
    (saleSource) => saleSource.value
  );

  const getPayload = () => ({
    sales_ids: salesToEdit.map((sale) => sale.id),
    sale: {
      ...(formik.values.bank_account_id && {
        bank_account_id: formik.values.bank_account_id,
      }),
      ...(formik.values.project_id && {
        project_id: formik.values.project_id,
      }),
      ...(formik.values.cost_center_id && {
        cost_center_id: formik.values.cost_center_id,
      }),
      ...(formik.values.category_id && {
        category_id: formik.values.category_id,
      }),
      ...(formik.values.competency_date && {
        competency_date:
          typeof formik.values.competency_date === 'string'
            ? formik.values.competency_date
            : formik.values.competency_date?.[0]
            ? formatDateToString(formik.values.competency_date?.[0])
            : null,
      }),
      ...(formik.values.due_date && {
        due_date:
          typeof formik.values.due_date === 'string'
            ? formik.values.due_date
            : formik.values.due_date?.[0]
            ? formatDateToString(formik.values.due_date?.[0])
            : null,
      }),
      ...(formik.values.source && {
        source: formik.values.source,
      }),
    },
  });

  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      await updateGroupSale(getPayload());
      setShowModalEditGroupSale(false);
      getSales();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    formik.handleReset();
  }, [showModalEditGroupSale]);

  return (
    <Modal
      size="lg"
      isOpen={showModalEditGroupSale}
      toggle={() => setShowModalEditGroupSale(!showModalEditGroupSale)}
      className="modal-dialog-centered"
    >
      <ModalHeader
        toggle={() => setShowModalEditGroupSale(!showModalEditGroupSale)}
      >
        Editar Vendas em Grupo
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col className="mt-1" md="4" sm="12">
            <FormGroup>
              <Label for="bank_account_id">
                <FormattedMessage id="sales.bank_account_id" />
              </Label>
              <Select
                isDisabled={hasAsaasSale}
                options={bankAccounts}
                className="React"
                classNamePrefix="select"
                id="bank_account_id"
                onBlur={formik.handleBlur}
                value={bankAccounts.filter(
                  (bank_account) =>
                    bank_account.value === formik.values.bank_account_id
                )}
                defaultValue={bankAccounts.filter(
                  (bank_account) =>
                    bank_account.value === formik.initialValues.bank_account_id
                )}
                onChange={(opt) => {
                  formik.setFieldValue('bank_account_id', opt.value);
                }}
              />
              {formik.errors.bank_account_id &&
              formik.touched.bank_account_id ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.bank_account_id}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col className="mt-1" md="4" sm="12">
            <FormGroup>
              <Label for="cost_center_id">
                <FormattedMessage id="cost_center" />
              </Label>
              <Select
                options={costCenters}
                className="React"
                classNamePrefix="select"
                id="cost_center_id"
                onBlur={formik.handleBlur}
                defaultValue={costCenters.filter(
                  (costCenter) =>
                    costCenter.value === formik.initialValues.cost_center_id
                )}
                onChange={(opt) => {
                  formik.setFieldValue('cost_center_id', opt.value);
                }}
              />
              {formik.errors.cost_center_id && formik.touched.cost_center_id ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.cost_center_id}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col className="mt-1" md="4" sm="12">
            <FormGroup>
              <Label for="project_id">
                <FormattedMessage id="project" />
              </Label>
              <Select
                options={projects}
                className="React"
                classNamePrefix="select"
                id="project_id"
                onBlur={formik.handleBlur}
                defaultValue={projects.filter(
                  (project) => project.value === formik.initialValues.project_id
                )}
                onChange={(opt) => {
                  formik.setFieldValue('project_id', opt.value);
                }}
              />
              {formik.errors.project_id && formik.touched.project_id ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.project_id}
                </div>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
        {allSalesInCash && !hasAsaasSale && (
          <Row>
            <Col className="mt-1" md="4" sm="12">
              <FormGroup>
                <Label className="d-block" for="due_date">
                  <FormattedMessage id="sales.due_date" />
                </Label>
                <Flatpickr
                  id="due_date"
                  className="form-control"
                  options={{
                    dateFormat: 'Y-m-d',
                    altFormat: 'd/m/Y',
                    altInput: true,
                  }}
                  onBlur={() => formik.handleBlur}
                  value={formik.values?.due_date}
                  onChange={(date) => formik.setFieldValue('due_date', date)}
                />
                {formik.errors?.due_date && formik.errors?.due_date ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.due_date}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col className="mt-1" md="4" sm="12">
              <FormGroup>
                <Label className="d-block" for="competency_date">
                  <FormattedMessage id="sales.competency_date" />
                </Label>
                <Flatpickr
                  id="competency_date"
                  className="form-control"
                  options={{
                    dateFormat: 'Y-m-d',
                    altFormat: 'd/m/Y',
                    altInput: true,
                  }}
                  onBlur={() => formik.handleBlur}
                  value={formik.values?.competency_date}
                  onChange={(date) =>
                    formik.setFieldValue('competency_date', date)
                  }
                />
                {formik.errors.competency_date &&
                formik.touched.competency_date ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors?.competency_date}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col className="mt-1" md="4" sm="12">
              <FormGroup>
                <Label for="category_id">
                  <FormattedMessage id="sales.transaction_category_id" />
                </Label>
                <Select
                  options={categories}
                  className="React"
                  classNamePrefix="select"
                  id="category_id"
                  onBlur={formik.handleBlur}
                  defaultValue={categories.filter(
                    (subcategory) =>
                      subcategory.value === formik.initialValues.category_id
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('category_id', opt.value);
                  }}
                />
                {formik.errors.category_id && formik.touched.category_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.category_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        )}
        {allSalesWithUndefinedSource && (
          <Row>
            <Col className="mt-1" md="4" sm="12">
              <FormGroup>
                <Label for="source">
                  <FormattedMessage id="sales.source" />
                </Label>
                <Select
                  options={saleSourceOptions}
                  className="React"
                  classNamePrefix="select"
                  id="source"
                  onBlur={formik.handleBlur}
                  defaultValue={saleSourceOptions.filter(
                    (costCenter) =>
                      costCenter.value === formik.initialValues.source
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('source', opt.value);
                  }}
                />
                {formik.errors.source && formik.touched.source ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.source}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          className="text-align-left"
          color="secondary"
          onClick={() => setShowModalEditGroupSale(!showModalEditGroupSale)}
        >
          Cancelar
        </Button>
        <Button color="primary" onClick={formik.handleSubmit}>
          Salvar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ModalEditGroupSale.propTypes = {
  salesToEdit: PropTypes.arrayOf(PropTypes.object).isRequired,
  showModalEditGroupSale: PropTypes.bool.isRequired,
  setShowModalEditGroupSale: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
  bankAccounts: PropTypes.array.isRequired,
  costCenters: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  getSales: PropTypes.func.isRequired,
};

export default ModalEditGroupSale;
