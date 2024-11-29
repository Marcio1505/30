import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { Edit, Trash2 } from 'react-feather';
import SweetAlert from 'react-bootstrap-sweetalert';

import BasicListTable from '../../../../components/tables/BasicListTable';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import {
  fetchCompanyUsersList,
  destroyCompanyUser,
} from '../../../../services/apis/company_user.api';

import { history } from '../../../../history';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import PermissionGate from '../../../../PermissionGate';

const CompanyUserList = ({ currentCompanyId }) => {
  const [rowData, setRowData] = useState([]);
  const [deleteCompanyUserId, setDeleteCompanyUserId] = useState(null);
  const [showModalDeleteCompanyUser, setShowModalDeleteCompanyUser] =
    useState(false);

  const intl = useIntl();

  const loadCompanyUsers = async () => {
    const { data: rowData } = await fetchCompanyUsersList();
    setRowData(rowData);
  };

  useEffect(() => {
    loadCompanyUsers();
  }, [currentCompanyId]);

  const submitDeleteCompanyUser = async () => {
    setShowModalDeleteCompanyUser(false);
    const respDestroyCompanyUser = await destroyCompanyUser({
      id: deleteCompanyUserId,
    });
    if (respDestroyCompanyUser.status === 200) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Usuário excluído com sucesso',
          hasTimeout: true,
        })
      );
      loadCompanyUsers();
    }
  };

  const defaultColDef = {
    sortable: true,
  };

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      width: 70,
    },
    {
      headerName: intl.formatMessage({ id: 'user.name' }),
      field: 'name',
      width: 250,
    },
    {
      headerName: 'Ações',
      field: 'transactions',
      width: 100,
      cellRendererFramework: (params) => (
        <div className="d-flex">
          <div className="actions cursor-pointer text-success">
            <PermissionGate permissions="permissions-users-companies.update">
              <Edit
                className="mr-50"
                onClick={() =>
                  history.push(`/admin/company-user/edit/${params.data.id}`)
                }
              />
            </PermissionGate>
          </div>
          <PermissionGate permissions="permissions-users-companies.destroy">
            <div className="actions cursor-pointer text-danger">
              <Trash2
                className="mr-75"
                onClick={() => {
                  setDeleteCompanyUserId(params.data.id);
                  setShowModalDeleteCompanyUser(true);
                }}
              />
            </div>
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <PermissionGate permissions="permissions-users-companies.list">
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="user" />}
            breadCrumbActive={
              <FormattedMessage id="button.list.company_user" />
            }
          />
        </Col>
        <PermissionGate permissions="permissions-users-companies.store">
          <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
            <Button.Ripple
              className="my-1"
              color="primary"
              onClick={() => history.push('/admin/company-user/edit')}
            >
              <FormattedMessage id="button.create.company_user" />
            </Button.Ripple>
          </Col>
        </PermissionGate>
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
        <div className={showModalDeleteCompanyUser ? 'global-dialog' : ''}>
          <SweetAlert
            showCancel
            reverseButtons={false}
            cancelBtnBsStyle="secondary"
            confirmBtnBsStyle="danger"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            warning
            title="Excluir Usuário!"
            show={showModalDeleteCompanyUser}
            onConfirm={submitDeleteCompanyUser}
            onClose={() => setShowModalDeleteCompanyUser(false)}
            onCancel={() => setShowModalDeleteCompanyUser(false)}
          >
            <h4 className="sweet-alert-text my-2">
              Confirma a exclusão deste usuário?
            </h4>
          </SweetAlert>
        </div>
      </Row>
    </PermissionGate>
  );
};

CompanyUserList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(CompanyUserList);
