import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { Edit } from 'react-feather';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { history } from '../../../../history';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  fetchPermissionUsersList,
  destroyPermissionUser,
} from '../../../../services/apis/permission_user.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import BasicListTable from '../../../../components/tables/BasicListTable';

const PermissionUserList = ({ currentCompanyId }) => {
  const intl = useIntl();

  const [rowData, setRowData] = useState([]);

  const loadPermissionUsers = async () => {
    const { data: rowData } = await fetchPermissionUsersList();
    setRowData(rowData);
    //console.log(rowData);
  };

  useEffect(() => {
    loadPermissionUsers();
  }, [currentCompanyId]);

  const deletePermissionUser = async (id) => {
    store.dispatch(applicationActions.hideDialog());
    await destroyPermissionUser({ id });
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: 'Centro de custo deletado com sucesso',
        hasTimeout: true,
      })
    );
    history.push('/admin/permissions_users/list');
  };

  const defaultColDef = {
    sortable: true,
  };

  const columnDefs = [
    {
      headerName: intl.formatMessage({ id: 'permission_user.user_id' }),
      field: 'pivot.user_id',
      width: 110,
    },
    {
      headerName: intl.formatMessage({ id: 'permission_user.permission_id' }),
      field: 'display_name',
      width: 250,
    },
    {
      headerName: intl.formatMessage({ id: 'permission_user.company_id' }),
      field: 'company_id',
      width: 150,
    },
    {
      headerName: 'Ações',
      field: 'transactions',
      width: 100,
      cellRendererFramework: (params) => (
        <div className="actions cursor-pointer text-success">
          <Edit
            className="mr-50"
            onClick={() =>
              history.push(
                `/admin/cost-center/edit/${params.data.permission_id}`
              )
            }
          />
          {/* <Trash2
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
                  onConfirm: () => {this.deletePermissionUser(params.data.id)},
                }));
                let selectedData = this.gridApi.getSelectedRows()
                this.gridApi.updateRowData({ remove: selectedData })
              }}
            /> */}
        </div>
      ),
    },
  ];

  return (
    <Row className="app-user-list">
      <Col md="8" sm="12">
        <Breadcrumbs
          breadCrumbTitle={<FormattedMessage id="permission_users" />}
          breadCrumbActive={
            <FormattedMessage id="button.list.permission_user" />
          }
        />
      </Col>
      <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
        <Button.Ripple
          className="my-1"
          color="primary"
          onClick={() => history.push('/admin/cost-center/edit')}
        >
          <FormattedMessage id="button.create.permission_user" />
        </Button.Ripple>
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
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(PermissionUserList);
