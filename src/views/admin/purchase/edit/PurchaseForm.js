import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Row,
  Col,
  Button,
  Label,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { get } from 'lodash';

import TextField from '../../../../components/inputs/TextField';
import AddProjects from '../../../../components/add-items/AddProjects';
import ListFiles from '../../files/ListFiles';
import PurchaseDropzone from './PurchaseDropzone';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import 'flatpickr/dist/themes/light.css';

import { formatMoney, getMonetaryValue } from '../../../../utils/formaters';
import { statusPurchaseOptions } from '../../../../utils/purchases';
import { destroyPurchaseReceipt } from '../../../../services/apis/purchase_receipt.api';
import { applicationActions } from '../../../../new.redux/actions';
import { store } from '../../../../redux/storeConfig/store';

import PermissionGate from '../../../../PermissionGate';

const PurchaseForm = ({
  purchaseId,
  formik,
  showModalApprove,
  toggleModalApprove,
  showModalReprove,
  toggleModalReprove,
  handleApprovePurchase,
  handleReprovePurchase,
  suppliers,
  categories,
  bankAccountOptions,
}) => {
  const [showModalDeleteReceipt, setShowModalDeleteReceipt] = useState(false);
  const [receiptIdToDelete, setReceiptIdToDelete] = useState(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  const intl = useIntl();

  let permissionForm = 'companies.purchases.store';
  let permissionButton = 'companies.purchases.store';

  if (purchaseId) {
    permissionForm = 'purchases.show';
    permissionButton = 'purchases.update';
  }

  const statusOptions = statusPurchaseOptions();
  const isPurchaseEditable = !purchaseId || formik.values.is_editable;

  const handleDeleteReceipt = (receiptId) => {
    setReceiptIdToDelete(receiptId);
    setShowModalDeleteReceipt(true);
  };

  const submitDeleteFile = async () => {
    setShowModalDeleteReceipt(false);
    const respDestroyPurchaseReceipt = await destroyPurchaseReceipt({
      id: receiptIdToDelete,
    });
    if (respDestroyPurchaseReceipt.status === 200) {
      const newPurchaseReceipts = formik.values.purchase_receipts.filter(
        (purchaseReceipt) => purchaseReceipt.id !== receiptIdToDelete
      );
      formik.setFieldValue('purchase_receipts', newPurchaseReceipts);
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Arquivo excluído com sucesso',
          hasTimeout: true,
        })
      );
    }
  };

  return (
    <PermissionGate permissions={permissionForm}>
      <Form onSubmit={formik.handleSubmit}>
        <Row className="mt-1">
          <Modal
            isOpen={showModalReprove}
            toggle={toggleModalReprove}
            className="modal-dialog-centered"
          >
            <ModalHeader toggle={toggleModalReprove}>
              Reprovar Compra
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <TextField
                  id="observation"
                  required
                  onBlur={formik.handleBlur}
                  value={formik.values.observation}
                  onChange={(e) =>
                    formik.setFieldValue('observation', e.target.value)
                  }
                  label={intl.formatMessage({
                    id: 'purchases.observation',
                  })}
                  error={
                    get(formik.touched, 'observation') &&
                    get(formik.errors, 'observation')
                  }
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => handleReprovePurchase()}>
                Reprovar
              </Button>{' '}
            </ModalFooter>
          </Modal>
          <SweetAlert
            showCancel
            reverseButtons={false}
            cancelBtnBsStyle="secondary"
            confirmBtnBsStyle="danger"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            warning
            title="Aprovar Compra!"
            show={showModalApprove}
            onConfirm={handleApprovePurchase}
            onClose={() => toggleModalApprove(false)}
            onCancel={() => toggleModalApprove(false)}
          >
            <h4 className="sweet-alert-text my-2">
              Uma conta a pagar será gerada. Confirma que deseja aprovar esta
              compra?
            </h4>
          </SweetAlert>
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="to_company">
                <FormattedMessage id="purchases.supplier" /> *
              </Label>
              <Select
                options={suppliers}
                className="React"
                classNamePrefix="select"
                id="to_company"
                onBlur={formik.handleBlur}
                defaultValue={suppliers.filter(
                  (supplier) =>
                    supplier.value === formik.initialValues.to_company_id
                )}
                onChange={(opt) => {
                  formik.setFieldValue('to_company_id', opt.value);
                  if (opt.category_id) {
                    formik.setFieldValue('category_id', opt.category_id);
                  }
                }}
              />
              {formik.errors.to_company_id && formik.touched.to_company_id ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.to_company_id}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="bank_account_id">
                <FormattedMessage id="transactions.bank_account" /> *
              </Label>
              <Select
                options={bankAccountOptions}
                className="React"
                classNamePrefix="select"
                id="bank_account_id"
                onBlur={formik.handleBlur}
                defaultValue={bankAccountOptions.find(
                  (bank_account) =>
                    bank_account.value === formik.values.bank_account_id
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
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="category_id">
                <FormattedMessage id="purchases.category_id" /> *
              </Label>
              <Select
                options={categories}
                className="React"
                classNamePrefix="select"
                id="category_id"
                name="category_id"
                onBlur={formik.handleBlur}
                value={categories.find(
                  (purchaseSubcategory) =>
                    purchaseSubcategory.value === formik.values.category_id
                )}
                defaultValue={categories.filter(
                  (purchaseSubcategory) =>
                    purchaseSubcategory.value ===
                    formik.initialValues.category_id
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
          <Col md="6" sm="12" />
          <Col md="6" sm="12">
            <FormGroup>
              <Label className="d-block" for="due_date">
                <FormattedMessage id="purchases.due_date" /> *
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
                value={formik.values.due_date}
                onChange={(date) => formik.setFieldValue('due_date', date)}
              />
              {formik.errors.due_date && formik.touched.due_date ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.due_date}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col md="6" sm="12">
            <FormGroup>
              <Label className="d-block" for="competency_date">
                <FormattedMessage id="purchases.competency_date" /> *
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
                value={formik.values.competency_date}
                onChange={(date) =>
                  formik.setFieldValue('competency_date', date)
                }
              />
              {formik.errors.competency_date &&
              formik.touched.competency_date ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.competency_date}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col md="6" sm="12">
            <TextField
              id="purchase_value"
              required
              onBlur={formik.handleBlur}
              value={formatMoney(formik.values.purchase_value)}
              onChange={(e) =>
                formik.setFieldValue(
                  'purchase_value',
                  getMonetaryValue(e.target.value)
                )
              }
              placeholder="0,00"
              label={intl.formatMessage({
                id: 'purchases.purchase_value',
              })}
              error={
                get(formik.touched, 'purchase_value') &&
                get(formik.errors, 'purchase_value')
              }
            />
          </Col>
          <Col md="6" sm="12">
            <TextField
              id="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
              placeholder={intl.formatMessage({
                id: 'purchases.description',
              })}
              label={intl.formatMessage({ id: 'purchases.description' })}
              error={
                get(formik.touched, 'description') &&
                get(formik.errors, 'description')
              }
            />
          </Col>
          <Col md="12" sm="12">
            <TextField
              id="fiscal_document_text"
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.fiscal_document_text}
              placeholder={`${intl.formatMessage({
                id: 'purchases.fiscal_document_text',
              })} *`}
              label={intl.formatMessage({
                id: 'purchases.fiscal_document_text',
              })}
              error={
                get(formik.touched, 'fiscal_document_text') &&
                get(formik.errors, 'fiscal_document_text')
              }
            />
          </Col>
          <Col md="12" sm="12">
            <TextField
              id="payment_info"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.payment_info}
              placeholder={`${intl.formatMessage({
                id: 'purchases.payment_info',
              })}`}
              label={intl.formatMessage({
                id: 'purchases.payment_info',
              })}
              error={
                get(formik.touched, 'payment_info') &&
                get(formik.errors, 'payment_info')
              }
            />
          </Col>
          {purchaseId && (
            <>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="status">
                    <FormattedMessage id="purchases.status" />
                  </Label>
                  <Select
                    options={statusOptions}
                    isDisabled
                    className="React"
                    classNamePrefix="select"
                    id="status"
                    onBlur={formik.handleBlur}
                    defaultValue={statusOptions.filter(
                      (status) => status.value === formik.initialValues.status
                    )}
                  />
                </FormGroup>
              </Col>
              <Col md="12" sm="12">
                <TextField
                  id="observation"
                  required
                  readOnly
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.observation}
                  placeholder={`${intl.formatMessage({
                    id: 'purchases.observation',
                  })} *`}
                  label={intl.formatMessage({
                    id: 'purchases.observation',
                  })}
                  error={
                    get(formik.touched, 'observation') &&
                    get(formik.errors, 'observation')
                  }
                />
              </Col>
            </>
          )}
          <Col sm="12" className="my-2">
            <AddProjects formik={formik} />
          </Col>
          <Col sm="12" className="my-2">
            <ListFiles
              allFiles={formik.values.purchase_receipts}
              handleDeleteFile={handleDeleteReceipt}
              canDeleteFiles={isPurchaseEditable}
              permissionToDeleteFiles="purchases.destroy"
            />
          </Col>
          {isPurchaseEditable && (
            <Col sm="12" className="my-2">
              <PurchaseDropzone
                formik={formik}
                setIsUploadingFile={setIsUploadingReceipt}
              />
            </Col>
          )}
          <Col className="d-flex justify-content-end flex-wrap" sm="12">
            {isPurchaseEditable && (
              <PermissionGate permissions={permissionButton}>
                <Button.Ripple
                  className="mt-1"
                  color="primary"
                  disabled={isUploadingReceipt}
                >
                  {isUploadingReceipt ? (
                    <div className="d-flex align-items-center">
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        color="white"
                      />
                      <span className="pl-1">Carregando ...</span>
                    </div>
                  ) : (
                    <FormattedMessage id="button.save" />
                  )}
                </Button.Ripple>
              </PermissionGate>
            )}
          </Col>
        </Row>
      </Form>
      <div className={showModalDeleteReceipt ? 'global-dialog' : ''}>
        <SweetAlert
          showCancel
          reverseButtons={false}
          cancelBtnBsStyle="secondary"
          confirmBtnBsStyle="danger"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          warning
          title="O arquivo será excluído!"
          show={showModalDeleteReceipt}
          onConfirm={submitDeleteFile}
          onClose={() => setShowModalDeleteReceipt(false)}
          onCancel={() => setShowModalDeleteReceipt(false)}
        >
          <h4 className="sweet-alert-text my-2">
            Confirma que deseja excluir este arquivo?
          </h4>
        </SweetAlert>
      </div>
    </PermissionGate>
  );
};

PurchaseForm.propTypes = {
  purchaseId: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  showModalApprove: PropTypes.bool.isRequired,
  toggleModalApprove: PropTypes.func.isRequired,
  showModalReprove: PropTypes.bool.isRequired,
  toggleModalReprove: PropTypes.func.isRequired,
  handleApprovePurchase: PropTypes.func.isRequired,
  handleReprovePurchase: PropTypes.func.isRequired,
  suppliers: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  bankAccountOptions: PropTypes.array.isRequired,
};

PurchaseForm.defaultProps = {};

export default PurchaseForm;
