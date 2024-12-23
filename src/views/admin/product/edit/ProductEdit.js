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
import { MultiStepForm } from '../steps/MultiStepForm';

const ProductEdit = ({ currentCompanyId }) => {
  const history = useHistory();
  const intl = useIntl();
  const { product_id: productId } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [product, setProduct] = useState({});

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

  let permissionForm = 'companies.products.store';
  let permissionButton = 'companies.products.store';

  if (productId) {
    permissionForm = 'products.show';
    permissionButton = 'products.update';
  }

  return (
    <>
      <PermissionGate permissions={permissionForm}>
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
        <MultiStepForm />
      </PermissionGate>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(ProductEdit);
