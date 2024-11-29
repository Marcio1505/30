import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  Row,
  Col,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from 'reactstrap';
import { ChevronDown, MoreVertical } from 'react-feather';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import SaleForm from './SaleForm';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import { fetchCategoriesList } from '../../../../services/apis/category.api';
import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';
import { fetchPaymentTypesList } from '../../../../services/apis/payment_types.api';
import { fetchPaymentMethodsList } from '../../../../services/apis/payment_methods.api';
import { fetchPaymentPlataformsList } from '../../../../services/apis/payment_plataforms.api';
import { fetchProductsList } from '../../../../services/apis/product.api';
import {
  showSale,
  updateSale,
  createSale,
  refundSale,
  cancelSale,
  cancelSubscription,
} from '../../../../services/apis/sale.api';
import {
  getDateFromFlatpickr,
  formatDateToString,
} from '../../../../utils/formaters';
import { getSaleStatusAvailable } from '../../../../utils/sales';

import PermissionGate from '../../../../PermissionGate';

const SaleEdit = ({ currentCompanyId, currentCompany }) => {
  const history = useHistory();
  const { sale_id: saleId } = useParams();
  const intl = useIntl();
  const [initialized, setInitialized] = useState(false);
  const [transactionSubcategories, setTransactionSubcategories] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentPlataforms, setPaymentPlataforms] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableStatus, setAvailableStatus] = useState([]);
  const [sale, setSale] = useState({});

  const isSourceName = sale.source;
  const isAsaasSale = sale.source === 'ASAAS';
  const isCreditCardSale = sale.payment_method_id === 1;
  const isStatusRefundable = sale.status === 5 || sale.status === 6;
  const showRefundButton =
    isAsaasSale && isCreditCardSale && isStatusRefundable;
  const showCancelButton =
    isAsaasSale &&
    (sale.status === 2 || sale.status === 3 || sale.status === 8);

  const projects = (sale.receivables?.[0]?.projects || []).map((project) => ({
    ...project,
    rowId: project.id,
  }));

  const cost_centers = (sale.receivables?.[0]?.cost_centers || []).map(
    (cost_center) => ({
      ...cost_center,
      rowId: cost_center.id,
    })
  );

  const initialValues = {
    client_id: sale.client_id || '',
    client: sale.client || {},
    custom_sale_id: sale.custom_sale_id || '',
    payment_plataform_id: sale.payment_plataform_id || '',
    payment_method_id: sale.payment_method_id || '',
    payment_type_id: sale.payment_type_id || '',
    product_id: sale.products?.[0]?.id || '',
    product_price: sale.product_price || 0,
    quantity: sale.quantity || '',
    // total_value: parseFloat(sale.total_value) || 0,
    final_value: parseFloat(sale.final_value) || 0,
    total_value:
      sale.products?.[0]?.price_view == 1
        ? parseFloat(sale.final_value)
        : parseFloat(sale.total_value) || 0,
    plataform_value: parseFloat(sale.plataform_value) || 0,
    supplier_plataform: sale.supplier_plataform || {},
    supplier_plataform_id: sale.supplier_plataform_id || '',
    advance_value: parseFloat(sale.advance_value) || 0,
    supplier_advance: sale.supplier_advance || {},
    supplier_advance_id: sale.supplier_advance_id || '',
    streaming_value: parseFloat(sale.streaming_value) || 0,
    supplier_streaming: sale.supplier_streaming || {},
    supplier_streaming_id: sale.supplier_streaming_id || '',
    commission_value: parseFloat(sale.commission_value) || 0,
    supplier_commission: sale.supplier_commission || {},
    supplier_commission_id: sale.supplier_commission_id || '',
    net_value: parseFloat(sale.net_value) || 0,
    status: sale.status || '',
    transaction_external_id: sale.transaction_external_id || '',
    transaction_key: sale.transaction_key || '',
    installment_number: sale.installment_number || 0,
    bank_account_id: sale.bank_account_id || '',
    category_id: sale.category_id || '',
    description: sale.description || '',
    fiscal_document_text: sale.fiscal_document_text || '',
    observations: sale.observations || '',
    transaction_value: sale.total_value || '',
    payed: sale.payed || false,
    payed_value: sale.payed_value || 0,
    interest_value: sale.interest_value || 0,
    payment_date: sale.payment_date || '',
    due_date: sale.receivables?.[0]?.due_date || '',
    competency_date: sale.competency_date || '',
    projects,
    cost_centers,
    installments: sale.receivables || [],
  };

  const validationSchema = Yup.object().shape({
    client_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    status: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    // payment_plataform_id: Yup.string().required(
    //   intl.formatMessage({ id: 'errors.required' })
    // ),
    payment_method_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    payment_type_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    // installments: Yup.string().when('payment_type_id', {
    //   is: (payment_type_id) => payment_type_id === 2,
    //   then: Yup.object().required(
    //     intl.formatMessage({ id: 'errors.required' })
    //   ),
    //   otherwise: Yup.string(),
    // }),
    due_date: Yup.mixed().when('payment_type_id', {
      is: (payment_type_id) => parseInt(payment_type_id, 10) !== 2,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.mixed(),
    }),
    competency_date: Yup.mixed().when('payment_type_id', {
      is: (payment_type_id) => parseInt(payment_type_id, 10) !== 2,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.mixed(),
    }),
    product_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    product_price: Yup.number().min(
      0.01,
      intl.formatMessage({ id: 'errors.positive' })
    ),
    total_value: Yup.number()
      .required(intl.formatMessage({ id: 'errors.required' }))
      .min(0, intl.formatMessage({ id: 'errors.positive' })),
    plataform_value: Yup.number().min(
      0,
      intl.formatMessage({ id: 'errors.positive' })
    ),
    supplier_plataform_id: Yup.string().when('plataform_value', {
      is: (plataform_value) => plataform_value,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    advance_value: Yup.number().min(
      0,
      intl.formatMessage({ id: 'errors.positive' })
    ),
    supplier_advance_id: Yup.string().when('advance_value', {
      is: (advance_value) => advance_value,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    streaming_value: Yup.number().min(
      0,
      intl.formatMessage({ id: 'errors.positive' })
    ),
    supplier_streaming_id: Yup.string().when('streaming_value', {
      is: (streaming_value) => streaming_value,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    commission_value: Yup.number().min(
      0,
      intl.formatMessage({ id: 'errors.positive' })
    ),
    supplier_commission_id: Yup.string().when('commission_value', {
      is: (commission_value) => commission_value,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    net_value: Yup.number()
      .required(intl.formatMessage({ id: 'errors.required' }))
      .min(0, intl.formatMessage({ id: 'errors.positive' })),
    quantity: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    transaction_external_id: Yup.string(),
    transaction_key: Yup.string(),
    installment_number: Yup.mixed().when('payment_type_id', {
      is: (payment_type_id) => payment_type_id === '2',
      then: Yup.number()
        .required(intl.formatMessage({ id: 'errors.required' }))
        .min(2, intl.formatMessage({ id: 'errors.positive' })),
      otherwise: Yup.string(),
    }),
    bank_account_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    category_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    description: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    payed_value: Yup.number().when('payed', {
      is: (payed) => payed,
      then: Yup.number()
        .required(intl.formatMessage({ id: 'errors.required' }))
        .positive(intl.formatMessage({ id: 'errors.positive' })),
      otherwise: Yup.number(),
    }),
    payment_date: Yup.string().when('payed', {
      is: (payed) => payed,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
  });

  const onSubmit = async () => {
    if (saleId) {
      try {
        await updateSale(mountPayload());
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'success',
            title: 'Sucesso',
            message: 'Venda atualizada com sucesso',
            hasTimeout: true,
          })
        );
        history.push(`/admin/sale/list`);
      } catch (error) {
        formik.setSubmitting(false);
      }
    } else {
      try {
        await createSale(mountPayload());
        formik.setSubmitting(false);
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'success',
            title: 'Sucesso',
            message: 'Venda criada com sucesso',
            hasTimeout: true,
          })
        );
        history.push(`/admin/sale/list`);
      } catch (error) {
        console.log('error');
        console.log(error);
        formik.setSubmitting(false);
      }
    }
  };

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  const mountPayload = () => {
    const product = products.find(
      (_product) => _product.id === formik.values.product_id
    );
    let installments = [];
    if (
      formik.values.payment_type_id === 2 &&
      formik.values.installments.length > 0
    ) {
      installments = formik.values.installments
        .slice(0, formik.values.installment_number)
        .map((_installment) => ({
          ..._installment,
          competency_date:
            typeof _installment?.competency_date === 'string'
              ? _installment?.competency_date
              : _installment?.competency_date?.[0]
              ? formatDateToString(_installment?.competency_date?.[0])
              : null,
          due_date:
            typeof _installment?.due_date === 'string'
              ? _installment?.due_date
              : _installment?.due_date?.[0]
              ? formatDateToString(_installment?.due_date?.[0])
              : null,
        }));
    }

    return {
      sale: {
        ...(saleId && { id: saleId }),
        bank_account_id: formik.values.bank_account_id,
        category_id: formik.values.category_id,
        client_id: formik.values.client_id,
        custom_sale_id: formik.values.custom_sale_id,
        payment_plataform_id: formik.values.payment_plataform_id,
        payment_method_id: formik.values.payment_method_id,
        payment_type_id: formik.values.payment_type_id,
        product_id: formik.values.product_id,
        product_name: product?.name,
        product_code: product?.code,
        product_price: formik.values.product_price,
        quantity: formik.values.quantity,
        total_value: formik.values.total_value,
        plataform_value: formik.values.plataform_value,
        supplier_plataform_id: formik.values.supplier_plataform_id,
        advance_value: formik.values.advance_value,
        supplier_advance_id: formik.values.supplier_advance_id,
        streaming_value: formik.values.streaming_value,
        supplier_streaming_id: formik.values.supplier_streaming_id,
        commission_value: formik.values.commission_value,
        supplier_commission_id: formik.values.supplier_commission_id,
        net_value: formik.values.net_value,
        status: formik.values.status,
        transaction_external_id: formik.values.transaction_external_id,
        transaction_key: formik.values.transaction_key,
        installment_number: formik.values.installment_number,
        competency_date:
          typeof formik.values.competency_date === 'string'
            ? formik.values.competency_date
            : formatDateToString(formik.values.competency_date[0]),
        payment_date:
          typeof formik.values.payment_date === 'string'
            ? formik.values.payment_date
            : formatDateToString(formik.values.payment_date[0]),
        description: formik.values.description,
        fiscal_document_text: formik.values.fiscal_document_text,
        observations: formik.values.observations,
        transaction: {
          bank_account_id: formik.values.bank_account_id,
          category_id: formik.values.category_id,
          transaction_value: formik.values.total_value,
          payed: formik.values.payed,
          payed_value: formik.values.payed_value,
          interest_value: formik.values.payed_value
            ? formik.values.payed_value - formik.values.total_value
            : null,
          payment_date:
            typeof formik.values.payment_date === 'string'
              ? formik.values.payment_date
              : formatDateToString(formik.values.payment_date[0]),
          due_date:
            typeof formik.values.due_date === 'string'
              ? formik.values.due_date
              : formatDateToString(formik.values.due_date[0]),
          competency_date:
            typeof formik.values.competency_date === 'string'
              ? formik.values.competency_date
              : formatDateToString(formik.values.competency_date[0]),
          projects: formik.values.projects,
          cost_centers: formik.values.cost_centers,
          ...(formik.values.payment_type_id === 2 && {
            installments,
          }),
          ...(formik.values.payment_type_id === 1 && {
            installments: [
              {
                due_date: getDateFromFlatpickr(formik.values.due_date),
                competency_date: getDateFromFlatpickr(
                  formik.values.competency_date
                ),
                transaction_value: formik.values.total_value,
              },
            ],
          }),
        },
      },
    };
  };

  const setSubcategoryOptions = async () => {
    const { data: dataCategories } = await fetchCategoriesList({
      params: '?type=1',
    });
    setTransactionSubcategories(
      dataCategories.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    );
  };

  const setPaymentTypeOptions = async () => {
    const { data: dataPaymentTypes } = await fetchPaymentTypesList();
    setPaymentTypes(
      dataPaymentTypes
        .map((paymentType) => ({
          ...paymentType,
          value: paymentType.id,
          label: paymentType.name,
        }))
        .filter((paymentType) => paymentType.name !== 'Assinatura')
    );
  };

  const setPaymentMethodOptions = async () => {
    const { data: dataPaymentMethods } = await fetchPaymentMethodsList();
    setPaymentMethods(
      dataPaymentMethods.map((paymentMethod) => ({
        ...paymentMethod,
        value: paymentMethod.id,
        label: paymentMethod.name,
      }))
    );
  };

  const setPaymentPlataformOptions = async () => {
    const { data: dataPaymentPlataforms } = await fetchPaymentPlataformsList();
    setPaymentPlataforms(
      dataPaymentPlataforms.map((paymentPlataform) => ({
        ...paymentPlataform,
        value: paymentPlataform.id,
        label: paymentPlataform.name,
      }))
    );
  };

  const setBankAccountOptions = async () => {
    const { data: dataBankAccounts } = await fetchBankAccountsList();
    setBankAccounts(
      dataBankAccounts.map((bankAccount) => ({
        value: bankAccount.id,
        label: bankAccount.name,
      }))
    );
  };

  const setProductOptions = async () => {
    const { data: dataProducts } = await fetchProductsList();
    setProducts(
      dataProducts.map((product) => ({
        ...product,
        value: product.id,
        label: product.name,
      }))
    );
  };

  const getInitialData = async () => {
    await Promise.all([
      setSubcategoryOptions(),
      setPaymentTypeOptions(),
      setPaymentMethodOptions(),
      setPaymentPlataformOptions(),
      setBankAccountOptions(),
      setProductOptions(),
    ]);

    let dataSale = {};
    if (saleId) {
      // let { data: dataTransaction } = await showSale({ id: saleId });
      const res = await showSale({ id: saleId });
      dataSale = res.data;
    }
    setSale(dataSale);
    setAvailableStatus(getSaleStatusAvailable(dataSale));

    setInitialized(true);
  };

  useEffect(() => {
    getInitialData();
  }, [saleId]);

  let permission = 'companies.sales.store';

  useEffect(() => {
    if (sale.id) {
      permission = 'sales.show';
    }
  }, [sale]);

  const handleRefundSale = () => {
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Atenção',
        message:
          'Ao estornar o pagamento, o valor pago será devolvido ao cliente. Esta ação é irreversível',
        showCancel: true,
        reverseButtons: false,
        cancelBtnBsStyle: 'secondary',
        confirmBtnBsStyle: 'danger',
        confirmBtnText: 'Confirmar',
        cancelBtnText: 'Cancelar',
        onConfirm: async () => {
          store.dispatch(applicationActions.hideDialog());
          await refundSale({ id: saleId });
          history.push('/admin/sale/list');
        },
      })
    );
  };

  const handleCancelSale = () => {
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Atenção',
        message:
          'Ao cancelar a venda, serão excluídas a(s) conta(s) a receber e a(s) conta(s) a pagar associadas à essa venda. As notificações de cobranças enviadas ao cliente para essa venda também serão excluídas. Esta ação é irreversível',
        showCancel: true,
        reverseButtons: false,
        cancelBtnBsStyle: 'secondary',
        confirmBtnBsStyle: 'danger',
        confirmBtnText: 'Confirmar',
        cancelBtnText: 'Cancelar',
        onConfirm: async () => {
          store.dispatch(applicationActions.hideDialog());
          await cancelSale({ id: saleId });
          history.push('/admin/sale/list');
        },
      })
    );
  };

  const handleCancelSubscription = () => {
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Atenção',
        message: `Ao cancelar a assinatura, serão excluídas a(s) conta(s) a receber e a(s) conta(s) a pagar associadas à essa venda e 
                  a todas as futuras vendas dessa assinatura. Esta ação é irreversível`,
        showCancel: true,
        reverseButtons: false,
        cancelBtnBsStyle: 'secondary',
        confirmBtnBsStyle: 'danger',
        confirmBtnText: 'Confirmar',
        cancelBtnText: 'Cancelar',
        onConfirm: async () => {
          store.dispatch(applicationActions.hideDialog());
          await cancelSubscription({ id: saleId });
          history.push('/admin/sale/list');
        },
      })
    );
  };

  return (
    <>
      <PermissionGate permissions={permission}>
        <Row>
          <Col sm="10">
            <Breadcrumbs
              breadCrumbTitle={
                saleId
                  ? `Venda ${saleId}`
                  : intl.formatMessage({ id: 'button.create.sale' })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({ id: 'button.list.sale' }),
                  link: '/admin/sale/list',
                },
              ]}
              breadCrumbActive={
                saleId
                  ? intl.formatMessage({ id: 'button.edit.sale' })
                  : intl.formatMessage({ id: 'button.create.sale' })
              }
            />
          </Col>
          {Boolean(showRefundButton || showCancelButton) && (
            <Col className="d-flex justify-content-end flex-wrap" sm="2">
              <UncontrolledDropdown className="data-list-dropdown my-1">
                <DropdownToggle
                  // className="p-1 btn bg-transparent text-primary border-primary"
                  className="p-1"
                  color="primary"
                >
                  <span className="align-middle mr-1">
                    <MoreVertical />
                  </span>
                  <ChevronDown size={15} />
                </DropdownToggle>
                <DropdownMenu tag="div" right>
                  {showRefundButton && (
                    <PermissionGate permissions="api.sales.refund">
                      <DropdownItem tag="a" onClick={handleRefundSale}>
                        Estornar pagamento(s)
                      </DropdownItem>
                    </PermissionGate>
                  )}
                  {showCancelButton && (
                    <PermissionGate permissions="api.sales.cancel">
                      <DropdownItem tag="a" onClick={handleCancelSale}>
                        Cancelar Venda
                      </DropdownItem>
                    </PermissionGate>
                  )}
                  {showCancelButton && (
                    <PermissionGate permissions="api.sales.cancel">
                      <DropdownItem tag="a" onClick={handleCancelSubscription}>
                        Cancelar Assinatura
                      </DropdownItem>
                    </PermissionGate>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          )}
        </Row>
        {initialized && (
          <Row>
            <Col sm="12">
              <Card>
                <CardBody className="pt-2">
                  <SaleForm
                    sale={sale}
                    saleId={saleId}
                    isSourceName={isSourceName}
                    isAsaasSale={isAsaasSale}
                    formik={formik}
                    bankAccounts={bankAccounts}
                    products={products}
                    transactionSubcategories={transactionSubcategories}
                    paymentTypes={paymentTypes}
                    paymentMethods={paymentMethods}
                    paymentPlataforms={paymentPlataforms}
                    availableStatus={availableStatus}
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

SaleEdit.propTypes = {
  currentCompanyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  currentCompany: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  currentCompany: state.companies.currentCompany,
});

export default connect(mapStateToProps)(SaleEdit);
