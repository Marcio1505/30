import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, CardBody, Row, Col, Form, Button } from 'reactstrap';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import { fetchPaymentTypesList } from '../../../../services/apis/payment_types.api';
import { fetchPaymentMethodsList } from '../../../../services/apis/payment_methods.api';
import { fetchProductsList } from '../../../../services/apis/product.api';
import {
  showProductLink,
  updateProductLink,
  createProductLink,
} from '../../../../services/apis/product_link.api';
import { fetchCategoriesList } from '../../../../services/apis/category.api';
import { fetchIuliPlansList } from '../../../../services/apis/iuli_plan.api';

import ProductLinkForm from './ProductLinkForm';

import { formatDateToString } from '../../../../utils/formaters';

import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import { subscriptionCycles } from '../../../../utils/productLinks';

import PermissionGate from '../../../../PermissionGate';

const ProductLinkEdit = ({ currentCompanyId, currentCompany }) => {
  const history = useHistory();
  const intl = useIntl();
  const { product_link_id: productLinkId } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [product_link, setProductLink] = useState({});
  const [products, setProducts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [transactionSubcategories, setTransactionSubcategories] = useState([]);
  const [iuliPlans, setIuliPlans] = useState([]);

  let permissionForm = 'companies.products.product-links.store';
  let permissionButton = 'companies.products.product-links.store';

  if (productLinkId) {
    permissionForm = 'product-links.show';
    permissionButton = 'product-links.update';
  }

  const onSubmit = async () => {
    if (productLinkId) {
      await updateProductLink(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Link de pagamento atualizado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/product-link/list');
    } else {
      await createProductLink(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Link de pagamento criado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/product-link/list');
    }
  };

  const projects = (product_link.projects || []).map((project) => ({
    ...project,
    rowId: project.id,
  }));

  const cost_centers = (product_link.cost_centers || []).map((cost_center) => ({
    ...cost_center,
    rowId: cost_center.id,
  }));

  const initialValues = {
    product_id: product_link.product_id || '',
    url: product_link.url || '',
    name: product_link.name || '',
    description: product_link.description || '',
    price: product_link.price || '',
    status: product_link.name ? product_link.status : 1,
    payment_type_id: product_link.payment_type_id || '',
    payment_method_id:
      product_link.payment_method_id || productLinkId ? null : '',
    category_id: product_link.category_id || '',
    max_installments: product_link.max_installments || '',
    due_date_limit_days: product_link.due_date_limit_days || '',
    subscription_cycle: product_link.subscription_cycle || '',
    end_date: product_link.end_date || '',
    iuli_plan_id: product_link.iuli_plan_id || '',
    cost_centers,
    projects,
  };

  const validationSchema = Yup.object().shape({
    product_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    name: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    description: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    price: Yup.number()
      .required(intl.formatMessage({ id: 'errors.required' }))
      .min(5, intl.formatMessage({ id: 'errors.min' }, { min: 5 })),
    status: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    payment_method_id: Yup.mixed().test(
      'payment_method_id',
      intl.formatMessage({ id: 'errors.required' }),
      (value) => [null, 1, 3].includes(value)
    ),
    payment_type_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    category_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    end_date: Yup.date()
      .nullable()
      .min(
        moment().format('YYYY-MM-DD'),
        intl.formatMessage({ id: 'errors.date.min.today' })
      ),
    due_date_limit_days: Yup.number().when('payment_method_id', {
      is: (payment_method_id) =>
        payment_method_id === null || payment_method_id === 3,
      then: Yup.number()
        .required(intl.formatMessage({ id: 'errors.required' }))
        .min(1, intl.formatMessage({ id: 'errors.min_value' }, { min: 1 }))
        .max(200, intl.formatMessage({ id: 'errors.max_value' }, { max: 200 })),
      otherwise: Yup.number(),
    }),
    subscription_cycle: Yup.number().when('payment_type_id', {
      is: (payment_type_id) => parseInt(payment_type_id) === 3,
      then: Yup.number()
        .required(intl.formatMessage({ id: 'errors.required' }))
        .test(
          'subscription_cycle',
          intl.formatMessage({ id: 'errors.min' }, { min: 1 }),
          (value) => [1, 2, 3, 4, 5, 6].includes(value)
        ),
      otherwise: Yup.number().nullable(),
    }),
    max_installments: Yup.number().when('payment_type_id', {
      is: (payment_type_id) => parseInt(payment_type_id) === 2,
      then: Yup.number()
        .required(intl.formatMessage({ id: 'errors.required' }))
        .min(2, intl.formatMessage({ id: 'errors.min_value' }, { min: 2 }))
        .max(12, intl.formatMessage({ id: 'errors.max_value' }, { max: 12 })),
      otherwise: Yup.number().nullable(),
    }),
    months_credit: Yup.number()
      .nullable()
      .min(1, intl.formatMessage({ id: 'errors.min_value' }, { min: 1 }))
      .max(12, intl.formatMessage({ id: 'errors.max_value' }, { max: 12 })),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  const mountPayload = () => ({
    productLink: {
      ...(productLinkId && { id: productLinkId }),
      product_id: formik.values.product_id,
      name: formik.values.name,
      description: formik.values.description,
      price: formik.values.price,
      status: formik.values.status,
      payment_type_id: formik.values.payment_type_id,
      payment_method_id: formik.values.payment_method_id,
      category_id: formik.values.category_id,
      max_installments: formik.values.max_installments,
      due_date_limit_days: formik.values.due_date_limit_days,
      subscription_cycle: formik.values.subscription_cycle,
      end_date:
        typeof formik.values.end_date === 'string'
          ? formik.values.end_date
          : formik.values.end_date?.[0]
          ? formatDateToString(formik.values.end_date?.[0])
          : '',
      iuli_plan_id: formik.values.iuli_plan_id,
      projects: formik.values.projects,
      cost_centers: formik.values.cost_centers,
    },
  });

  const getProductLink = async () => {
    if (productLinkId) {
      const { data: dataProductLink } = await showProductLink({
        id: productLinkId,
      });
      setProductLink(dataProductLink);
    }
  };

  const getPaymentTypes = async () => {
    const { data: dataPaymentTypes } = await fetchPaymentTypesList();
    setPaymentTypes(
      dataPaymentTypes.map((dataPaymentType) => ({
        ...dataPaymentType,
        label: dataPaymentType.name,
        value: dataPaymentType.id,
      }))
    );
  };

  const getPaymentMethods = async () => {
    const { data: dataPaymentMethods } = await fetchPaymentMethodsList();
    const asaasPaymentMethods = dataPaymentMethods
      .filter((paymentMethod) => paymentMethod.asaas_allow)
      .map((dataPaymentMethod) => ({
        ...dataPaymentMethod,
        label: dataPaymentMethod.name,
        value: dataPaymentMethod.id,
      }));
    asaasPaymentMethods.unshift({
      label: 'Perguntar ao Cliente',
      value: null,
    });
    setPaymentMethods(asaasPaymentMethods);
  };

  const getProducts = async () => {
    const { data: dataProducts } = await fetchProductsList();
    setProducts(
      dataProducts.map((dataProduct) => ({
        ...dataProduct,
        label: dataProduct.name,
        value: dataProduct.id,
      }))
    );
  };

  const getTransactionSubcategories = async () => {
    const { data: dataTransactionCategories } = await fetchCategoriesList({
      params: `?type=1`,
    });
    setTransactionSubcategories(
      dataTransactionCategories.map((dataTransactionCategory) => ({
        ...dataTransactionCategory,
        label: dataTransactionCategory.name,
        value: dataTransactionCategory.id,
      }))
    );
  };

  const getIuliPlans = async () => {
    const { data: dataIuliPlans } = await fetchIuliPlansList();
    setIuliPlans(
      dataIuliPlans.map((iuliPlan) => ({
        ...iuliPlan,
        label: iuliPlan.name,
        value: iuliPlan.id,
      }))
    );
  };

  const fetchData = async () => {
    await Promise.all([
      getProductLink(),
      getPaymentTypes(),
      getPaymentMethods(),
      getProducts(),
      getTransactionSubcategories(),
      getIuliPlans(),
    ]);
    setInitialized(true);
  };

  useEffect(() => {
    fetchData();
  }, [productLinkId]);

  useEffect(() => {
    if (
      product_link?.company_id &&
      currentCompanyId !== product_link.company_id
    ) {
      history.push(`/admin/product-link/list`);
    }
  }, [currentCompanyId]);

  return (
    <>
      <PermissionGate permissions={permissionForm}>
        <Row>
          <Col sm="12">
            <Breadcrumbs
              breadCrumbTitle={
                productLinkId
                  ? `${productLinkId}`
                  : intl.formatMessage({ id: 'button.create.product_link' })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({ id: 'button.list.product_link' }),
                  link: '/admin/product-link/list',
                },
              ]}
              breadCrumbActive={
                productLinkId
                  ? intl.formatMessage({ id: 'button.edit.product_link' })
                  : intl.formatMessage({ id: 'button.create.product_link' })
              }
            />
          </Col>
        </Row>
        {initialized && (
          <Row>
            <Col sm="12">
              <Card>
                <CardBody className="pt-2">
                  <Form onSubmit={formik.handleSubmit}>
                    <ProductLinkForm
                      formik={formik}
                      products={products}
                      paymentMethods={paymentMethods}
                      paymentTypes={paymentTypes}
                      transactionSubcategories={transactionSubcategories}
                      iuliPlans={iuliPlans}
                      subscriptionCycles={subscriptionCycles}
                      productLinkId={productLinkId}
                    />
                    <Row>
                      <Col
                        className="mt-1 d-flex justify-content-end flex-wrap"
                        md={{ size: 6, offset: 3 }}
                        sm="12"
                      >
                        <PermissionGate permissions={permissionButton}>
                          <Button.Ripple className="mt-1" color="primary">
                            <FormattedMessage id="button.save" />
                          </Button.Ripple>
                        </PermissionGate>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </PermissionGate>
    </>
  );
};

ProductLinkEdit.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
  currentCompany: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  currentCompany: state.companies.currentCompany,
});

export default connect(mapStateToProps)(ProductLinkEdit);
