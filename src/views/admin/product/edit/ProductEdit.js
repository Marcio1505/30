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


  return (
    <>
<MultiStepForm/>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(ProductEdit);
