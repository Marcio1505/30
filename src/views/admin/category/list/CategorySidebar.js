import React from 'react';
import { PropTypes } from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Row, Col, Label, FormGroup, Button, Form, Input } from 'reactstrap';
import { X } from 'react-feather';
import classnames from 'classnames';

import PermissionGate from "../../../../PermissionGate";

const CategorySidebar = ({
  category,
  showSidebar,
  setShowSidebar,
  handleUpdateCategory,
  handleStoreCategory,
}) => {
  const intl = useIntl();
  const isCreate = !category.id;
  const initialValues = {
    id: category.id || '',
    name: category.name || '',
    chart_accounts: category.chart_accounts || '',
  };

  const validationSchema = Yup.object().shape({
    // id: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    name: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
  });

  const onSubmit = async (values) => {
    if (category.id) {
      handleUpdateCategory({
        id: values.id,
        name: values.name,
        chart_accounts: values.chart_accounts,
      });
    } else {
      handleStoreCategory({
        name: values.name,
        chart_accounts: values.chart_accounts,
      });
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  let permissionForm = '';
  let permissionButton = '';
  if(category.id)
  {
    permissionForm = 'categories.show';
    permissionButton = 'categories.update';
  }
  else
  {
    permissionForm = 'categories.store';
    permissionButton = 'categories.store';
  }

  return (
    <PermissionGate permissions={permissionForm}>
      <div className={classnames('data-list-sidebar', showSidebar ? 'show' : '')}>
        <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
          <h4>
            {isCreate ? 'Adicionar' : 'Editar'}
            {' Categoria'}
          </h4>
          <X size={20} onClick={() => setShowSidebar(false)} />
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <div className="m-3">
            <Row className="mt-1">
              <Col className="mt-1">
                <Row>
                  <Col sm="12">
                    <FormGroup>
                      <Label for="name">
                        <FormattedMessage id="categories.name" /> *
                      </Label>
                      <Input
                        type="text"
                        id="name"
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: 'categories.name',
                        })}
                      />
                      {formik.errors.name && formik.touched.name ? (
                        <div className="invalid-tooltip mt-25">
                          {formik.errors.name}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col sm="12">
                    <FormGroup>
                      <Label for="chart_accounts">
                        <FormattedMessage id="categories.chart_accounts" />
                      </Label>
                      <Input
                        type="text"
                        id="chart_accounts"
                        onBlur={formik.handleBlur}
                        value={formik.values.chart_accounts}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: 'categories.chart_accounts',
                        })}
                      />
                      {formik.errors.chart_accounts &&
                      formik.touched.chart_accounts ? (
                        <div className="invalid-tooltip mt-25">
                          {formik.errors.chart_accounts}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
            <PermissionGate permissions={permissionButton}>
              <div className="data-list-sidebar-footer d-flex justify-content-end align-items-center mt-2">
                <Button color="primary" type="submit" className="ml-1">
                  Salvar
                </Button>
              </div>
            </PermissionGate>
          </div>
        </Form>
      </div>
    </PermissionGate>
  );
};

CategorySidebar.propTypes = {
  category: PropTypes.object,
  showSidebar: PropTypes.bool.isRequired,
  setShowSidebar: PropTypes.func.isRequired,
  handleUpdateCategory: PropTypes.func.isRequired,
  handleStoreCategory: PropTypes.func.isRequired,
};

CategorySidebar.defaultProps = {
  category: {},
};

export default CategorySidebar;
