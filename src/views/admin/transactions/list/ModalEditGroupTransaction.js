import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useFormik } from 'formik';
import moment from 'moment';
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
import { FormattedMessage, useIntl } from 'react-intl';

import { updateGroupTransaction } from '../../../../services/apis/transaction.api';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import { formatDateToString } from '../../../../utils/formaters';

const ModalEditGroupTransaction = ({
  isPayable,
  transactionsToEdit,
  showModalEditGroupTransaction,
  setShowModalEditGroupTransaction,
  projects,
  bankAccounts,
  iuliBankAccountId,
  costCenters,
  categories,
  getTransactions,
}) => {
  const intl = useIntl();

  const availableBankAccounts = bankAccounts.filter(
    (bankAccount) => bankAccount.id !== iuliBankAccountId
  );
  const canUpdatePaymentInfo = !transactionsToEdit.some(
    (transaction) => !transaction.can_update_main_attributes
  );
  const hasAsaasTransaction = transactionsToEdit.some(
    (transaction) => transaction.source === 'ASAAS'
  );
  const hasReconciled = transactionsToEdit.some(
    (transaction) => transaction.reconciled == 1 || transaction.reconciled == 2
  );

  const getPayload = () => ({
    data: {
      transactions_ids: transactionsToEdit.map((transaction) => transaction.id),
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
      ...(formik.values.show_dre && {
        show_dre: formik.values.show_dre === 'yes' ? 1 : 0,
      }),
      ...(formik.values.show_dfc && {
        show_dfc: formik.values.show_dfc === 'yes' ? 1 : 0,
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
      ...(formik.values.payment_date && {
        payment_date:
          typeof formik.values.payment_date === 'string'
            ? formik.values.payment_date
            : formik.values.payment_date?.[0]
            ? formatDateToString(formik.values.payment_date?.[0])
            : null,
      }),
      ...((formik.values.paid || formik.values.paid === 0) && {
        paid: formik.values.paid,
      }),
    },
  });

  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      await updateGroupTransaction(getPayload());
      setShowModalEditGroupTransaction(false);
      getTransactions();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    formik.handleReset();
  }, [showModalEditGroupTransaction]);

  return (
    <Modal
      size="lg"
      isOpen={showModalEditGroupTransaction}
      toggle={() =>
        setShowModalEditGroupTransaction(!showModalEditGroupTransaction)
      }
      className="modal-dialog-centered"
    >
      <ModalHeader
        toggle={() =>
          setShowModalEditGroupTransaction(!showModalEditGroupTransaction)
        }
      >
        Editar em Grupo
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col className="mt-1" md="4" sm="12">
            <FormGroup>
              <Label className="d-block" for="due_date">
                <FormattedMessage id="transactions.due_date" />
              </Label>
              <Flatpickr
                disabled={hasAsaasTransaction}
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
                <FormattedMessage id="transactions.competency_date" />
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
                <FormattedMessage id="transactions.transaction_category_id" />
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
        <Row>
          <Col className="mt-1" md="4" sm="12">
            <FormGroup>
              <Label for="bank_account_id">
                <FormattedMessage id="transactions.bank_account_id" />
              </Label>
              <Select
                isDisabled={hasAsaasTransaction || hasReconciled}
                options={availableBankAccounts}
                className="React"
                classNamePrefix="select"
                id="bank_account_id"
                onBlur={formik.handleBlur}
                value={availableBankAccounts.filter(
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
          <Col className="mt-1" md="4" sm="12">
            <FormGroup>
              <Label className="d-block" for="payment_date">
                {intl.formatMessage({
                  id: isPayable
                    ? 'transactions.payment_date_payable'
                    : 'transactions.payment_date_receivable',
                })}
              </Label>
              <Flatpickr
                disabled={!canUpdatePaymentInfo}
                id="payment_date"
                className="form-control"
                options={{
                  dateFormat: 'Y-m-d',
                  altFormat: 'd/m/Y',
                  altInput: true,
                  maxDate: moment().format('YYYY-MM-DD'),
                }}
                onBlur={() => formik.handleBlur}
                value={formik.values?.payment_date}
                onChange={(date) => formik.setFieldValue('payment_date', date)}
              />
              {formik.errors.payment_date && formik.touched.payment_date ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors?.payment_date}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col className="mt-1" md="4" sm="12">
            <FormGroup>
              <Label for="show_dre">
                <FormattedMessage id="transactions.show_dre" />
              </Label>
              <Select
                options={[
                  { value: 0, label: 'Selecione' },
                  { value: 'yes', label: 'Sim' },
                  { value: 'no', label: 'Não' },
                ]}
                className="React"
                classNamePrefix="select"
                id="show_dre"
                onBlur={formik.handleBlur}
                onChange={(opt) => {
                  formik.setFieldValue('show_dre', opt.value);
                }}
              />
              {formik.errors.show_dre && formik.touched.show_dre ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.show_dre}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col className="mt-1" md="4" sm="12">
            <FormGroup>
              <Label for="show_dfc">
                <FormattedMessage id="transactions.show_dfc" />
              </Label>
              <Select
                options={[
                  { value: 0, label: 'Selecione' },
                  { value: 'yes', label: 'Sim' },
                  { value: 'no', label: 'Não' },
                ]}
                className="React"
                classNamePrefix="select"
                id="show_dfc"
                onBlur={formik.handleBlur}
                onChange={(opt) => {
                  formik.setFieldValue('show_dfc', opt.value);
                }}
              />
              {formik.errors.show_dfc && formik.touched.show_dfc ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.show_dfc}
                </div>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          className="text-align-left"
          color="secondary"
          onClick={() =>
            setShowModalEditGroupTransaction(!showModalEditGroupTransaction)
          }
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

ModalEditGroupTransaction.defaultProps = {
  iuliBankAccountId: null,
};

ModalEditGroupTransaction.propTypes = {
  isPayable: PropTypes.bool.isRequired,
  transactionsToEdit: PropTypes.arrayOf(PropTypes.object).isRequired,
  showModalEditGroupTransaction: PropTypes.bool.isRequired,
  setShowModalEditGroupTransaction: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
  bankAccounts: PropTypes.array.isRequired,
  iuliBankAccountId: PropTypes.number,
  costCenters: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  getTransactions: PropTypes.func.isRequired,
};

export default ModalEditGroupTransaction;
