import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import { ChevronDown, MoreVertical } from 'react-feather';
import {
  Row,
  Col,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import PurchaseForm from './PurchaseForm';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import AlertIcon from '../../../../components/alerts/AlertIcon';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import { fetchCategoriesList } from '../../../../services/apis/category.api';
import { fetchSuppliersList } from '../../../../services/apis/supplier.api';
import { fetchBankAccountsOptions } from '../../../../services/apis/bank_account.api';
import {
  showPurchase,
  updatePurchase,
  approvePurchase,
  reprovePurchase,
  createPurchase,
} from '../../../../services/apis/purchase.api';
import { formatDateToString, formatCpfCnpj } from '../../../../utils/formaters';

import PermissionGate from '../../../../PermissionGate';

const PurchaseEdit = ({ currentCompanyId, currentCompany }) => {
  const history = useHistory();
  const intl = useIntl();
  const { purchase_id: purchaseId } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [showModalApprove, setShowModalApprove] = useState(false);
  const [showModalReprove, setShowModalReprove] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [bankAccountOptions, setBankAccountOptions] = useState([]);
  const [purchase, setPurchase] = useState({});

  const toggleModalApprove = () => {
    setShowModalApprove(!showModalApprove);
  };

  const handleApprovePurchase = async () => {
    setShowModalApprove(false);
    const respApprovePurchase = await approvePurchase({ purchase });
    if (respApprovePurchase.status === 200) {
      history.push('/admin/purchase/list');
    }
  };

  const handleReprovePurchase = async () => {
    setShowModalReprove(false);
    const respReprovePurchase = await reprovePurchase({
      purchaseId: purchase.id,
      observation: formik.values.observation,
    });
    if (respReprovePurchase.status === 200) {
      history.push('/admin/purchase/list');
    }
  };

  const toggleModalReprove = () => {
    setShowModalReprove(!showModalReprove);
  };

  const mountPayload = () => ({
    purchase: {
      ...(purchaseId && { id: purchaseId }),
      to_company_id: formik.values.to_company_id,
      bank_account_id: formik.values.bank_account_id,
      category_id: formik.values.category_id,
      due_date:
        typeof formik.values.due_date === 'string'
          ? formik.values.due_date
          : formatDateToString(formik.values.due_date[0]),
      competency_date:
        typeof formik.values.competency_date === 'string'
          ? formik.values.competency_date
          : formatDateToString(formik.values.competency_date[0]),
      payment_date:
        typeof formik.values.payment_date === 'string'
          ? formik.values.payment_date
          : formatDateToString(formik.values.payment_date[0]),
      description: formik.values.description,
      observation: formik.values.observation,
      fiscal_document_text: formik.values.fiscal_document_text,
      payment_info: formik.values.payment_info,
      purchase_value: formik.values.purchase_value,
      interest_value: formik.values.paid_value
        ? formik.values.paid_value - formik.values.purchase_value
        : null,
      // total_value: formik.values.purchase_value + formik.values.interest_value,
      paid: formik.values.paid,
      paid_value: formik.values.paid_value,
      repeat: formik.values.repeat,
      occurrences: formik.values.occurrences,
      frequency: formik.values.frequency,
      status: formik.values.status,
      projects: formik.values.projects,
      cost_centers: formik.values.cost_centers,
      edit_all: formik.values.edit_all,
      receipts: formik.values.files,
    },
  });

  const onSubmit = async () => {
    if (purchaseId) {
      try {
        await updatePurchase(mountPayload());
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'success',
            title: 'Sucesso',
            message: 'Compra atualizada com sucesso!',
            hasTimeout: true,
          })
        );
        history.push(`/admin/purchase/list`);
      } catch (error) {
        formik.setSubmitting(false);
      }
    } else {
      try {
        await createPurchase(mountPayload());
        formik.setSubmitting(false);
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'success',
            title: 'Sucesso',
            message: 'Compra criada com sucesso!',
            hasTimeout: true,
          })
        );
        history.push(`/admin/purchase/list`);
      } catch (error) {
        formik.setSubmitting(false);
      }
    }
  };

  const projects = (purchase.projects || []).map((project) => ({
    ...project,
    rowId: project.id,
  }));

  const initialValues = {
    to_company_id: purchase.to_company_id || '',
    bank_account_id: purchase.bank_account_id || '',
    category_id: purchase.category_id || '',
    due_date: purchase.due_date || '',
    competency_date: purchase.competency_date || '',
    payment_date: purchase.payment_date || '',
    description: purchase.description || '',
    observation: purchase.observation || '',
    fiscal_document_text: purchase.fiscal_document_text || '',
    payment_info: purchase.payment_info || '',
    purchase_value: purchase.purchase_value || 0,
    interest_value: purchase.interest_value || 0,
    paid_value: purchase.paid_value || 0,
    paid: purchase.paid || 0,
    repeat: purchase.repeat || 0,
    frequency: purchase.frequency || 0,
    occurrence: purchase.occurrence || 0,
    status: purchase.status || 1,
    projects,
    edit_all: 0,
    files: [],
    is_editable: purchase.is_editable,
    purchase_receipts: purchase.purchase_receipts || [],
  };

  const validationSchema = Yup.object().shape({
    to_company_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    bank_account_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    category_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    due_date: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    competency_date: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    purchase_value: Yup.number()
      .positive(intl.formatMessage({ id: 'errors.positive' }))
      .required(intl.formatMessage({ id: 'errors.required' })),
    fiscal_document_text: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    payment_info: Yup.string().max(
      255,
      intl.formatMessage({ id: 'errors.max' }, { max: 255 })
    ),
    paid_value: Yup.string().when('paid', {
      is: (paid) => paid,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    payment_date: Yup.string().when('paid', {
      is: (paid) => paid,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  const setSubcategoryOptions = async () => {
    const { data: dataCategories } = await fetchCategoriesList({
      params: '?type=2',
    });
    setCategories(
      dataCategories.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    );
  };

  const setSuppliersList = async () => {
    const { data: dataSuppliers } = await fetchSuppliersList();
    setSuppliers(
      dataSuppliers.map((supplier) => ({
        value: supplier.id,
        label: `${supplier.company_name} ${
          supplier.document ? `- ${formatCpfCnpj(supplier.document)}` : ''
        }`,
        category_id: supplier.category_id || supplier.transaction_category_id,
      }))
    );
  };

  const setBankAccountOptionsList = async () => {
    const { data: dataBankAccountOptions } = await fetchBankAccountsOptions();
    setBankAccountOptions(dataBankAccountOptions);
    if (!formik.initialValues.bank_account_id) {
      const defaultBankAccount = dataBankAccountOptions.find(
        (bank_account) => bank_account.is_default_purchase
      );
      console.log({ defaultBankAccount });
      if (defaultBankAccount?.value) {
        formik.setFieldValue('bank_account_id', defaultBankAccount.value);
      }
    }
  };

  const getInitialData = async () => {
    await Promise.all([
      setSubcategoryOptions(),
      setSuppliersList(),
      setBankAccountOptionsList(),
    ]);

    let dataPurchase = {};
    if (purchaseId) {
      // let { data: dataPurchase } = await showPurchase({ id: purchaseId });
      const res = await showPurchase({ id: purchaseId });
      dataPurchase = res.data;
    }
    setPurchase(dataPurchase);

    setInitialized(true);
  };

  useEffect(() => {
    getInitialData();
  }, [purchaseId, currentCompanyId]);

  useEffect(() => {
    if (purchase?.company_id && currentCompanyId !== purchase.company_id) {
      history.push(`/admin/purchase/list`);
    }
  }, [currentCompanyId, history, purchase.company_id]);

  let permissionForm = 'companies.purchases.store';
  if (purchaseId) {
    permissionForm = 'purchases.show';
  }

  return (
    <>
      <PermissionGate permissions={permissionForm}>
        <Row>
          <Col sm="12" md="8">
            <Breadcrumbs
              breadCrumbTitle={
                purchaseId
                  ? `${purchaseId}`
                  : intl.formatMessage({ id: 'button.create.purchase' })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({ id: 'button.list.purchase' }),
                  link: '/admin/purchase/list',
                },
              ]}
              breadCrumbActive={
                purchaseId
                  ? intl.formatMessage({ id: 'button.edit.purchase' })
                  : intl.formatMessage({ id: 'button.create.purchase' })
              }
            />
          </Col>
          <PermissionGate permissions="purchases.approve">
            <Col
              className="d-flex justify-content-end flex-wrap"
              md="4"
              sm="12"
            >
              {purchase.status === 'waiting' && (
                <UncontrolledDropdown className="data-list-dropdown my-1">
                  <DropdownToggle className="p-1" color="primary">
                    <span className="align-middle mr-1">
                      <MoreVertical />
                    </span>
                    <ChevronDown size={15} />
                  </DropdownToggle>
                  <DropdownMenu tag="div" right>
                    <>
                      <PermissionGate permissions="purchases.approve">
                        <DropdownItem
                          tag="a"
                          onClick={() => setShowModalApprove(true)}
                        >
                          <FormattedMessage id="purchases.approve" />
                        </DropdownItem>
                      </PermissionGate>
                      <PermissionGate permissions="purchases.approve">
                        <DropdownItem
                          tag="a"
                          onClick={() => setShowModalReprove(true)}
                        >
                          <FormattedMessage id="purchases.reprove" />
                        </DropdownItem>
                      </PermissionGate>
                    </>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Col>
          </PermissionGate>
        </Row>
        {initialized && (
          <Row>
            <Col sm="12">
              <Card>
                <CardBody className="pt-2">
                  {purchase.created_by_message && (
                    <AlertIcon type="warning">
                      {purchase.created_by_message}
                    </AlertIcon>
                  )}
                  <PurchaseForm
                    purchaseId={purchaseId}
                    showModalApprove={showModalApprove}
                    toggleModalApprove={toggleModalApprove}
                    handleApprovePurchase={handleApprovePurchase}
                    showModalReprove={showModalReprove}
                    toggleModalReprove={toggleModalReprove}
                    handleReprovePurchase={handleReprovePurchase}
                    formik={formik}
                    suppliers={suppliers}
                    categories={categories}
                    bankAccountOptions={bankAccountOptions}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </PermissionGate>
    </>
  );
};

PurchaseEdit.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
  currentCompany: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  currentCompany: state.companies.currentCompany,
});

export default connect(mapStateToProps)(PurchaseEdit);
