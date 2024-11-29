import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card,
  CardBody,
  Input,
  Button,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import { FormattedMessage } from 'react-intl';
import {
  Edit,
  FilePlus,
  FileText,
  Trash2,
  ChevronDown,
  RefreshCw,
} from 'react-feather';
import SweetAlert from 'react-bootstrap-sweetalert';

import YesOrNoBadge from '../../../../components/badges/YesOrNoBadge';
import { ContextLayout } from '../../../../utility/context/Layout';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import { history } from '../../../../history';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  destroyBankAccount,
  fetchBankAccountsList,
} from '../../../../services/apis/bank_account.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import PermissionGate from '../../../../PermissionGate';

function BankAccountList({ currentCompanyId }) {
  const [gridApi, setGridApi] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [deleteBankAccountId, setDeleteBankAccountId] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showModalDeleteBankAccount, setShowModalDeleteBankAccount] =
    useState(false);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    minWidth: 70,
  };
  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      width: 70,
    },
    {
      headerName: 'Nome',
      field: 'name',
      width: 170,
    },
    {
      headerName: 'Banco',
      field: 'bank.name',
      width: 190,
    },
    {
      headerName: 'Agência',
      field: 'branch',
      width: 110,
    },
    {
      headerName: 'Conta',
      field: 'account',
      width: 120,
    },
    {
      headerName: 'Painel',
      field: 'show_on_dashboard',
      width: 100,
      cellRendererFramework: (params) => (
        <YesOrNoBadge booleanData={params.data?.show_on_dashboard} />
      ),
    },
    {
      headerName: 'Conciliação',
      field: 'show_on_conciliation',
      width: 90,
      cellRendererFramework: (params) => (
        <YesOrNoBadge booleanData={params.data?.show_on_conciliation} />
      ),
    },
    {
      headerName: 'Ações',
      field: 'transactions',
      width: 280,
      cellRendererFramework: (params) => (
        <div className="d-flex">
          <div className="actions cursor-pointer text-success" title="Editar">
            <PermissionGate permissions="bank-accounts.update">
              <Edit
                className="mr-75"
                onClick={() =>
                  history.push(`/admin/bank-account/edit/${params.data.id}`)
                }
              />
            </PermissionGate>
          </div>
          <div
            className="actions cursor-pointer text-info"
            title="Visualizar Extrato"
          >
            <PermissionGate permissions="api.bank_account.statement">
              <FileText
                className="mr-75"
                onClick={() =>
                  history.push(
                    `/admin/bank-account/detailed-statement/${params.data.id}`
                  )
                }
              />
            </PermissionGate>
          </div>
          <div className="actions cursor-pointer text-danger" title="Excluir">
            <PermissionGate permissions="bank-accounts.destroy">
              <Trash2
                className="mr-75"
                onClick={() => {
                  setDeleteBankAccountId(params.data.id);
                  setShowModalDeleteBankAccount(true);
                }}
              />
            </PermissionGate>
          </div>
          <div
            className="actions cursor-pointer text-danger"
            title="Solicitar Saque"
          >
            <PermissionGate permissions="api.bank_account.current_balance">
              <div className="d-flex justify-content-between">
                {params.data.type === 9 && (
                  <Button
                    className="btn-sm btn mt-1"
                    color="danger"
                    onClick={() => history.push('/admin/wire-transfer/edit')}
                  >
                    Solicitar Saque
                  </Button>
                )}
              </div>
            </PermissionGate>
          </div>
          <PermissionGate permissions="api.companies.bank_accounts.import-ofx">
            {Boolean(params.data?.show_on_conciliation) && (
              <div
                className="actions cursor-pointer text-success"
                title="Importar OFX"
              >
                <FilePlus
                  className="mr-75"
                  onClick={() =>
                    history.push(
                      `/admin/bank-account/${params.data.id}/ofx/import`
                    )
                  }
                />
                {/* )} */}
              </div>
            )}
            <div
              className="actions cursor-pointer text-success"
              title="Reconciliar"
            >
              {Boolean(params.data?.show_on_conciliation) && (
                <RefreshCw
                  className="mr-75"
                  onClick={() =>
                    history.push(
                      `/admin/bank-account/${params.data.id}/reconciliation`
                    )
                  }
                />
              )}
            </div>
          </PermissionGate>
        </div>
      ),
    },
  ];

  const getInitialData = async () => {
    const responseBankAccountList = await fetchBankAccountsList();
    if (responseBankAccountList.data) {
      setBankAccounts(responseBankAccountList.data);
    }
  };

  useEffect(() => {
    getInitialData();
  }, [currentCompanyId]);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const filterSize = (selectedPageSize) => {
    if (gridApi) {
      gridApi.paginationSetPageSize(Number(selectedPageSize));
      setPageSize(selectedPageSize);
    }
  };

  const updateSearchQuery = (newSearchValue) => {
    gridApi.setQuickFilter(newSearchValue);
    setSearchValue(newSearchValue);
  };

  const submitDeleteBankAccount = async () => {
    setShowModalDeleteBankAccount(false);
    const respDestroyBankAccount = await destroyBankAccount({
      id: deleteBankAccountId,
    });
    if (respDestroyBankAccount.status === 204) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Conta bancária excluída com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/bank-account/list');
    }
  };

  return (
    <PermissionGate permissions="companies.bank-accounts.index">
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="bank_accounts" />}
            breadCrumbActive={
              <FormattedMessage id="button.list.bank_account" />
            }
          />
        </Col>
        <PermissionGate permissions="companies.bank-accounts.store">
          <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
            <Button.Ripple
              className="my-1"
              color="primary"
              onClick={() => history.push('/admin/bank-account/edit')}
            >
              <FormattedMessage id="button.create.bank_account" />
            </Button.Ripple>
          </Col>
        </PermissionGate>
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="ag-theme-material ag-grid-table allow-text-selection">
                <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                  <div className="sort-dropdown">
                    <UncontrolledDropdown className="ag-dropdown p-1">
                      <DropdownToggle tag="div">
                        1 - {pageSize} de 150
                        <ChevronDown className="ml-50" size={15} />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem tag="div" onClick={() => filterSize(10)}>
                          10
                        </DropdownItem>
                        <DropdownItem tag="div" onClick={() => filterSize(20)}>
                          20
                        </DropdownItem>
                        <DropdownItem tag="div" onClick={() => filterSize(50)}>
                          50
                        </DropdownItem>
                        <DropdownItem tag="div" onClick={() => filterSize(100)}>
                          100
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                  <div className="filter-actions d-flex">
                    <Input
                      className="w-100 mr-1 mb-1 mb-sm-0"
                      type="text"
                      placeholder="buscar..."
                      onChange={(e) => updateSearchQuery(e.target.value)}
                      value={searchValue}
                    />
                  </div>
                </div>
                {bankAccounts.length !== null ? (
                  <ContextLayout.Consumer>
                    {(context) => (
                      <AgGridReact
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowData={bankAccounts}
                        onGridReady={onGridReady}
                        // onRowClicked={(e) => this.onRowClicked(e)}
                        animateRows
                        pagination
                        pivotPanelShow="always"
                        paginationPageSize={pageSize}
                        resizable
                        enableRtl={context.state.direction === 'rtl'}
                        enableCellTextSelection
                      />
                    )}
                  </ContextLayout.Consumer>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </Col>
        <div className={showModalDeleteBankAccount ? 'global-dialog' : ''}>
          <SweetAlert
            showCancel
            reverseButtons={false}
            cancelBtnBsStyle="secondary"
            confirmBtnBsStyle="danger"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            warning
            title="Excluir Conta Bancária!"
            show={showModalDeleteBankAccount}
            onConfirm={submitDeleteBankAccount}
            onClose={() => setShowModalDeleteBankAccount(false)}
            onCancel={() => setShowModalDeleteBankAccount(false)}
          >
            <h4 className="sweet-alert-text my-2">
              Confirma a exclusão desta conta bancária?
            </h4>
          </SweetAlert>
        </div>
      </Row>
    </PermissionGate>
  );
}

BankAccountList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(BankAccountList);
