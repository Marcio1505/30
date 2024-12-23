import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { Edit } from 'react-feather';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { history } from '../../../../history';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  destroyProduct,
  fetchProductsList,
} from '../../../../services/apis/product.api';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';
import BasicListTable from '../../../../components/tables/BasicListTable';
import { formatMoney } from '../../../../utils/formaters';
import StatusBadge from '../../../../components/badges/StatusBadge';
import ProductTypeBadge from '../../../../components/badges/ProductTypeBadge';
import ProductPriceView from '../../../../components/badges/ProductPriceViewBadge';
import ProdutsExpiration from '../modal/ModalProdutsExpiration';
import PermissionGate from '../../../../PermissionGate';

const ProductList = ({ currentCompanyId }) => {
  const intl = useIntl();

  const [rowData, setRowData] = useState([]);

  const loadProducts = async () => {
    const { data: rowData } = await fetchProductsList();
    setRowData(rowData);
  };

  useEffect(() => {
    loadProducts();
  }, [currentCompanyId]);

  const deleteProduct = async (id) => {
    store.dispatch(applicationActions.hideDialog());
    await destroyProduct({ id });
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: 'Projeto deletado com sucesso',
        hasTimeout: true,
      })
    );
    history.push('/admin/product/list');
  };

  const defaultColDef = {
    sortable: true,
    resizable: true,
    minWidth: 70,
  };

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      width: 80,
      cellClass: 'small-cell',
      cellRendererFramework: (params) => <small>{params.data.id}</small>,
    },
    {
      headerName: 'Código do Produto',
      field: 'code',
      cellClass: 'text-warning',
      width: 120,
    },
    {
      headerName: intl.formatMessage({ id: 'products.name' }),
      field: 'name',
      width: 250,
    },
    {
      headerName: intl.formatMessage({ id: 'products.price' }),
      field: 'price',
      width: 150,
      cellRendererFramework: (params) => formatMoney(params.value, true),
    },
    {
      headerName: intl.formatMessage({ id: 'products.price_view' }),
      field: 'price_view',
      width: 220,
      cellRendererFramework: (params) => (
        <ProductPriceView priceView={params.value} />
      ),
    },
    {
      headerName: intl.formatMessage({ id: 'products.product_type' }),
      field: 'product_type',
      width: 100,
      cellRendererFramework: (params) => (
        <ProductTypeBadge product_type={params.value} />
      ),
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellRendererFramework: (params) => <StatusBadge status={params.value} />,
    },
    {
      headerName: 'Ações',
      field: 'transactions',
      width: 100,
      cellRendererFramework: (params) => (
        <div className="actions cursor-pointer text-success">
          <PermissionGate permissions="products.show">
            <Edit
              className="mr-50"
              onClick={() =>
                history.push(`/admin/product/edit/${params.data.id}`)
              }
            />
          </PermissionGate>
          {/* <PermissionGate permissions={'products.destroy'}> 
                <Trash2
                  size={15}
                  onClick={() => {
                    store.dispatch(applicationActions.toggleDialog({
                      type: 'warning',
                      title: 'Deletar Conta',
                      message: 'Você tem certeza que deseja deletar esta conta bancária. Esta ação é irreversível',
                      showCancel: true,
                      reverseButtons: false,
                      cancelBtnBsStyle: 'danger',
                      confirmBtnText: 'Sim, deletar!',
                      cancelBtnText: 'Cancelar',
                      onConfirm: () => {this.deleteproduct(params.data.id)},
                    }));
                    let selectedData = this.gridApi.getSelectedRows()
                    this.gridApi.updateRowData({ remove: selectedData })
                  }}
                /> 
              </PermissionGate>
            */}
        </div>
      ),
    },
  ];

  return (
    <PermissionGate permissions="companies.products.index">
      <ProdutsExpiration currentCompanyId={currentCompanyId} />
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="products" />}
            breadCrumbActive={<FormattedMessage id="button.list.product" />}
          />
        </Col>
        <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
          <PermissionGate permissions="companies.products.store">
            <Button.Ripple
              className="my-1"
              color="primary"
              onClick={() => history.push('/admin/product/edit')}
            >
              <FormattedMessage id="button.create.product" />
            </Button.Ripple>
          </PermissionGate>
        </Col>
        <Col sm="12">
          <Card>
            <CardBody>
              <BasicListTable
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </PermissionGate>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

ProductList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(ProductList);
