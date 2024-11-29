import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardBody, Row, Col, Form, Button } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ProductForm from './ProductForm';
import ProductTypeProductForm from './ProductTypeProductForm';
import ProductTypeServiceForm from './ProductTypeServiceForm';
import ProductTypeSplitForm from './ProductTypeSplitForm';
import ProductAutomaticSaleInvoiceForm from './ProductAutomaticSaleInvoiceForm';
import ProductAutomaticReturnInvoiceForm from './ProductAutomaticReturnInvoiceForm';
import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';
import {
  showProduct,
  updateProduct,
  createProduct,
} from '../../../../services/apis/product.api';
import { formatDateToString } from '../../../../utils/formaters';
import PermissionGate from '../../../../PermissionGate';

const ProductEdit = ({ currentCompanyId }) => {
  const history = useHistory();
  const intl = useIntl();
  const { product_id: productId } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [product, setProduct] = useState({});

  const mountPayload = () => ({
    product: {
      ...(productId && { id: productId }),
      company_id: currentCompanyId,
      name: formik.values.name,
      description: formik.values.description,
      code: formik.values.code,
      price: formik.values.price,
      price_view: formik.values.price_view,
      product_type: formik.values.product_type,
      status: formik.values.status,
      payment_type_id: formik.values.payment_type_id,
      payment_method_id: formik.values.payment_method_id,
      max_installments: formik.values.max_installments,
      due_date_limit_days: formik.values.due_date_limit_days,
      product_link_exists: formik.values.product_link_exists,
      subscription_cycle: formik.values.subscription_cycle,
      end_date:
        typeof formik.values.end_date === 'string'
          ? formik.values.end_date
          : formik.values.end_date?.[0]
          ? formatDateToString(formik.values.end_date?.[0])
          : '',
      fiscal_code: formik.values.fiscal_code,
      fiscal_origin: formik.values.fiscal_origin,
      ncm: formik.values.ncm,
      measurement_unit: formik.values.measurement_unit,
      icms_cst: formik.values.icms_cst,
      icms_aliquot: formik.values.icms_aliquot,
      pis_cst: formik.values.pis_cst,
      pis_aliquot: formik.values.pis_aliquot,
      cofins_cst: formik.values.cofins_cst,
      cofins_aliquot: formik.values.cofins_aliquot,
      ipi_cst: formik.values.ipi_cst,
      ipi_aliquot: formik.values.ipi_aliquot,
      ipi_code: formik.values.ipi_code,
      fiscal_source: formik.values.fiscal_source,
      simplified_tax_percentage: formik.values.simplified_tax_percentage,
      cfop_in_state: formik.values.cfop_in_state,
      cfop_out_state: formik.values.cfop_out_state,
      cfop_international: formik.values.cfop_international,
      return_cfop_in_state: formik.values.return_cfop_in_state,
      return_cfop_out_state: formik.values.return_cfop_out_state,
      return_cfop_international: formik.values.return_cfop_international,
      automatic_sale_invoice: formik.values.automatic_sale_invoice,
      days_sale_invoice: formik.values.days_sale_invoice,
      automatic_return_invoice: formik.values.automatic_return_invoice,
      days_return_invoice: formik.values.days_return_invoice,
      cnae: formik.values.cnae,
      service_list_item: formik.values.service_list_item,
      iss_withholding: formik.values.iss_withholding,
      tax_benefit_code: formik.values.tax_benefit_code,
      aditional_info: formik.values.aditional_info,
      item_description: formik.values.item_description,
      cademi_status: formik.values.cademi_status,
      cademi_id_product: formik.values.cademi_id_product,
      municipal_service: formik.values.municipal_service,
      aliquot: formik.values.aliquot,
      description_service: formik.values.description_service,
      percentage_price: formik.values.percentage_price,
      percentage_service: formik.values.percentage_service,
      percentage_product: formik.values.percentage_product,
    },
  });

  const onSubmit = async () => {
    if (productId) {
      await updateProduct(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Produto atualizado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/product/list');
    } else {
      await createProduct(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Produto criado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/product/list');
    }
  };

  const initialValues = {
    company_id: currentCompanyId,
    name: product.name || '',
    description: product.description || '',
    code: product.code || '',
    price: product.price || '',
    product_type: product.product_type || '',
    price_view: !product.price_view ? 0 : product.price_view || '',
    status: product.name ? product.status : 1,
    payment_type_id: product.payment_type_id || '',
    payment_method_id: product.payment_method_id || '',
    max_installments: product.max_installments || '',
    due_date_limit_days: product.due_date_limit_days || '',
    subscription_cycle: product.subscription_cycle || '',
    product_link_exists: Boolean(product.product_links?.[0]?.asaas_id),
    product_links: product.product_links,
    fiscal_code: product.fiscal_code || '',
    fiscal_origin: product.fiscal_origin || '',
    tax_benefit_code: product.tax_benefit_code || '',
    aditional_info: product.aditional_info || '',
    item_description: product.item_description || '',
    ncm: product.ncm || '',
    measurement_unit: product.measurement_unit || '',
    icms_cst: product.icms_cst || '',
    icms_aliquot: product.icms_aliquot || '',
    pis_cst: product.pis_cst || '',
    pis_aliquot: product.pis_aliquot || '',
    cofins_cst: product.cofins_cst || '',
    cofins_aliquot: product.cofins_aliquot || '',
    ipi_cst: product.ipi_cst || '',
    ipi_aliquot: product.ipi_aliquot || '',
    ipi_code: product.ipi_code || '',
    fiscal_source: product.fiscal_source || '',
    simplified_tax_percentage: product.simplified_tax_percentage || '',
    cfop_in_state: product.cfop_in_state || '',
    cfop_out_state: product.cfop_out_state || '',
    cfop_international: product.cfop_international || '',
    return_cfop_in_state: product.return_cfop_in_state || '',
    return_cfop_out_state: product.return_cfop_out_state || '',
    return_cfop_international: product.return_cfop_international || '',
    automatic_sale_invoice: product.automatic_sale_invoice || 0,
    days_sale_invoice: product.days_sale_invoice || '',
    automatic_return_invoice: product.automatic_return_invoice || 0,
    days_return_invoice: product.days_return_invoice || '',
    cnae: product.cnae || '',
    service_list_item: product.service_list_item || '',
    iss_withholding: product.iss_withholding || 0,
    cademi_status: product.cademi_status || 0,
    cademi_id_product: product.cademi_id_product || '',
    municipal_service: product.municipal_service || '',
    aliquot: product.aliquot || '',
    description_service: product.description_service || '',
    percentage_price: product.percentage_price || 100,
    percentage_service: product.percentage_service || '',
    percentage_product: product.percentage_product || '',
  };

  let permissionForm = 'companies.products.store';
  let permissionButton = 'companies.products.store';

  if (productId) {
    permissionForm = 'products.show';
    permissionButton = 'products.update';
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    // description: Yup.string().required(
    //   intl.formatMessage({ id: 'errors.required' })
    // ),
    price: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    price_view: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    status: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    ncm: Yup.string().when('product_type', {
      is: (product_type) => product_type === 1,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    icms_cst: Yup.string().when('product_type', {
      is: (product_type) => product_type === 1,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    pis_cst: Yup.string().when('product_type', {
      is: (product_type) => product_type === 1,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    cofins_cst: Yup.string().when('product_type', {
      is: (product_type) => product_type === 1,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    ipi_cst: Yup.string().when('product_type', {
      is: (product_type) => product_type === 1,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    cfop_in_state: Yup.string().when('product_type', {
      is: (product_type) => product_type === 1,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    municipal_service: Yup.string().when('product_type', {
      is: (product_type) => product_type === 2 || product_type === 3,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    aliquot: Yup.mixed(),
    description_service: Yup.string().when('product_type', {
      is: (product_type) => product_type === 2 || product_type === 3,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    percentage_service: Yup.number().when('product_type', {
      is: (product_type) => product_type === 3,
      then: Yup.number().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.number(),
    }),
    percentage_product: Yup.number().when('product_type', {
      is: (product_type) => product_type === 3,
      then: Yup.number().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.number(),
    }),
    cademi_id_product: Yup.string().when('cademi_status', {
      is: (cademi_status) => cademi_status === true,
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

  useEffect(() => {
    const fetchData = async () => {
      if (productId) {
        const { data: dataProduct } = await showProduct({ id: productId });
        setProduct(dataProduct);
      }
      setInitialized(true);
    };
    fetchData();
  }, [productId]);

  useEffect(() => {
    if (product?.company_id && currentCompanyId !== product.company_id) {
      history.push(`/admin/product/list`);
    }
  }, [currentCompanyId]);

  return (
    <>
      {initialized && (
        <PermissionGate permissions={permissionForm}>
          <Row>
            <Col sm="12">
              <Breadcrumbs
                breadCrumbTitle={
                  productId
                    ? `#${productId} - ${product.name}`
                    : intl.formatMessage({ id: 'button.create.product' })
                }
                breadCrumbParents={[
                  {
                    name: intl.formatMessage({ id: 'button.list.product' }),
                    link: '/admin/product/list',
                  },
                ]}
                breadCrumbActive={
                  productId
                    ? intl.formatMessage({ id: 'button.edit.product' })
                    : intl.formatMessage({ id: 'button.create.product' })
                }
              />
            </Col>
            <Col sm="12">
              <Card>
                <CardBody className="pt-2">
                  <Row className="mt-1">
                    <Col className="mt-1" md={{ size: 6, offset: 3 }} sm="12">
                      <Form onSubmit={formik.handleSubmit}>
                        <ProductForm formik={formik} />
                        {Boolean(
                          formik.values.product_type === 1 &&
                            !formik.values.exterior_hotmart_invoice
                        ) && <ProductTypeProductForm formik={formik} />}
                        {Boolean(formik.values.product_type === 2) && (
                          <ProductTypeServiceForm formik={formik} />
                        )}
                        {Boolean(formik.values.product_type === 3) && (
                          <ProductTypeSplitForm formik={formik} />
                        )}
                        <ProductAutomaticSaleInvoiceForm formik={formik} />
                        <ProductAutomaticReturnInvoiceForm formik={formik} />
                        <Row>
                          <Col
                            className="d-flex justify-content-end flex-wrap"
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
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </PermissionGate>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(ProductEdit);
