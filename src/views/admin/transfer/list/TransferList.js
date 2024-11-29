import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardBody,
  Input,
  Button,
  Row,
  Col,
  UncontrolledButtonDropdown,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import { FormattedMessage } from 'react-intl';
import { Edit, Trash2, ChevronDown, Trash, Upload } from 'react-feather';
import { isEmpty } from 'lodash';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContextLayout } from '../../../../utility/context/Layout';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import TransactionReconciledBadge from '../../../../components/badges/TransactionReconciledBadge';
import { history } from '../../../../history';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  destroyTransfer,
  fetchTransfersList,
  destroyGroupTransfer,
} from '../../../../services/apis/transfers.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../utils/formaters';
import { getPageSizeLabel } from '../../../../utils/tableUtils';

import PermissionGate from '../../../../PermissionGate';

function TransferList({ currentCompanyId }) {
  const gridApi = useRef();
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [deleteTransferId, setDeleteTransferId] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [showModalDeleteTransfer, setShowModalDeleteTransfer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [
    showModalHandleDestroyGroupTransfer,
    setshowModalHandleDestroyGroupTransfer,
  ] = useState(false);

  const [transfersToEdit, setTransfersToEdit] = useState([]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    minWidth: 70,
  };

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      width: 110,
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerCheckboxSelection: true,
      cellClass: 'small-cell',
      cellRendererFramework: (params) => <small>{params.data.id}</small>,
    },
    {
      headerName: 'Banco Origem',
      field: 'bank_account_id',
      width: 180,
      cellRendererFramework: (params) => params.data.bank_account?.name,
    },
    {
      headerName: 'Banco Destino',
      field: 'to_bank_account_id',
      width: 180,
      cellRendererFramework: (params) => params.data.to_bank_account?.name,
    },
    {
      headerName: 'Data',
      field: 'competency_date',
      width: 120,
      cellRendererFramework: (params) =>
        formatDateToHumanString(params.data?.competency_date),
    },
    {
      headerName: '',
      field: 'computed_status',
      filter: true,
      width: 50,
      cellRendererFramework: (params) => (
        <>
          <TransactionReconciledBadge
            transactionReconciled={params.data.reconciled}
          />
        </>
      ),
    },
    {
      headerName: 'Valor',
      field: 'transfer_value',
      width: 150,
      cellRendererFramework: (params) => formatMoney(params.value),
    },
    {
      headerName: 'Descrição',
      field: 'description',
      width: 125,
    },

    {
      headerName: 'Ações',
      field: 'transactions',
      width: 150,
      // cellRendererFramework: (params) =>

      cellRendererFramework: (params) =>
        !params.data.wire_transfer_id && (
          <div className="d-flex">
            <div className="actions cursor-pointer text-success">
              <PermissionGate permissions="transfers.show">
                <Edit
                  className="mr-75"
                  onClick={() =>
                    history.push(`/admin/transfer/edit/${params.data.id}`)
                  }
                />
              </PermissionGate>
            </div>

            {!params.data.reconciled && (
              <div className="actions cursor-pointer text-danger">
                <PermissionGate permissions="transfers.destroy">
                  <Trash2
                    className="mr-75"
                    onClick={() => {
                      setDeleteTransferId(params.data.id);
                      setShowModalDeleteTransfer(true);
                    }}
                  />
                </PermissionGate>
              </div>
            )}
          </div>
        ),
    },
  ];

  const getInitialData = async () => {
    const responseTransferList = await fetchTransfersList();
    if (responseTransferList.data) {
      setTransfers(responseTransferList.data);
    }
  };

  useEffect(() => {
    getInitialData();
  }, [currentCompanyId]);

  const onGridReady = (params) => {
    gridApi.current = params.api;
  };

  const filterSize = (selectedPageSize) => {
    if (gridApi) {
      gridApi.current.paginationSetPageSize(Number(selectedPageSize));
      setPageSize(selectedPageSize);
    }
  };

  const updateSearchQuery = (newSearchValue) => {
    gridApi.current.setQuickFilter(newSearchValue);
    setSearchValue(newSearchValue);
  };

  const onPaginationChanged = () => {
    setCurrentPage(gridApi.current?.paginationProxy?.currentPage || 0);
  };

  const submitDeleteTransfer = async () => {
    setShowModalDeleteTransfer(false);
    const respDestroyTransfer = await destroyTransfer({
      id: deleteTransferId,
    });
    if (respDestroyTransfer.statusText === 'OK') {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Transferência excluída com sucesso',
          hasTimeout: true,
        })
      );
      getInitialData();
    }
  };

  const handleDestroyGroupTransfer = async (transfersToDestroy) => {
    if (isEmpty(transfersToDestroy)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Nenhuma transferência selecionada',
          message:
            'Selecione pelo menos uma transferência para apagar em grupo',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    const hasReconciled = transfersToDestroy.some(
      (transfer) =>
        transfer.reconciled == 1 ||
        transfer.reconciled == 2 ||
        transfer.reconciled == 3
    );

    if (hasReconciled) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title:
            'Foi selecionado pelo menos uma transferência que já está conciliada',
          message:
            'Selecione apenas transferências que ainda não estão conciliadas para apagar em grupo',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    const hasWireTransfer = transfersToDestroy.some(
      (transfer) => transfer.wire_transfer_id
    );

    if (hasWireTransfer) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title:
            'Foi selecionada pelo menos uma transferência que é Saque de Conta IULI',
          message:
            'Selecione apenas transferências que não são saques da Conta IULI para apagar em grupo',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    setshowModalHandleDestroyGroupTransfer(true);
    setTransfersToEdit(transfersToDestroy);
  };

  const submitHandleDestroyGroupTransfer = async () => {
    setshowModalHandleDestroyGroupTransfer(false);
    const transfersId = [];

    transfersToEdit.forEach((transfer) => {
      transfersId.push(transfer.id);
    });
    const respDestroyGroupTransfer = await destroyGroupTransfer({
      transfersIds: transfersId,
    });

    if (respDestroyGroupTransfer.status === 200) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Transferências removidas com sucesso',
          hasTimeout: true,
        })
      );
      getInitialData();
    }
  };

  const handleImportXLS = () => {
    history.push(`/admin/transfer/import/`);
  };

  return (
    <PermissionGate permissions="transfers.index">
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="transfers.index" />}
            breadCrumbActive={<FormattedMessage id="button.list.transfer" />}
          />
        </Col>
        <PermissionGate permissions="transfers.store">
          <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
            <Button.Ripple
              className="my-1"
              color="primary"
              onClick={() => history.push('/admin/transfer/edit')}
            >
              <FormattedMessage id="button.create.transfer" />
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
                        {getPageSizeLabel(
                          currentPage,
                          pageSize,
                          transfers.length
                        )}
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
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        updateSearchQuery(e.target.value);
                      }}
                      value={searchValue}
                    />

                    <div className="dropdown actions-dropdown">
                      <UncontrolledButtonDropdown>
                        <DropdownToggle
                          className="px-2 py-75 d-flex"
                          color="white"
                        >
                          Ações
                          <ChevronDown className="ml-50" size={15} />
                        </DropdownToggle>
                        <DropdownMenu right>
                          {/* {Boolean(handleExportXLS) && (
                            <PermissionGate permissions={permissiomTransactionExport}>
                              <DropdownItem
                                tag="a"
                                onClick={() => {
                                  const salectedRows =
                                    gridApi.current.getSelectedRows();
                                  handleExportXLS(salectedRows);
                                }}
                              >
                                <Download size={15} />
                                <span className="align-middle ml-50">
                                  Exportar XLSX
                                </span>
                              </DropdownItem>
                            </PermissionGate>
                          )} */}
                          <PermissionGate permissions="transfers.store">
                            <DropdownItem tag="a" onClick={handleImportXLS}>
                              <Upload size={15} />
                              <span className="align-middle ml-50">
                                Importar XLSX
                              </span>
                            </DropdownItem>
                          </PermissionGate>
                          <PermissionGate permissions="transfers.destroy">
                            <DropdownItem
                              tag="a"
                              onClick={() => {
                                const rows = gridApi.current.getSelectedRows();
                                handleDestroyGroupTransfer(rows);
                              }}
                            >
                              <Trash size={15} />
                              <span className="align-middle ml-50">
                                Apagar em Lote
                              </span>
                            </DropdownItem>
                          </PermissionGate>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
                  </div>
                </div>
                {transfers.length !== null ? (
                  <ContextLayout.Consumer>
                    {(context) => (
                      <AgGridReact
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowData={transfers}
                        onGridReady={onGridReady}
                        rowSelection="multiple"
                        animateRows
                        pagination
                        pivotPanelShow="always"
                        paginationPageSize={pageSize}
                        onPaginationChanged={onPaginationChanged}
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
        <div className={showModalDeleteTransfer ? 'global-dialog' : ''}>
          <SweetAlert
            showCancel
            reverseButtons={false}
            cancelBtnBsStyle="secondary"
            confirmBtnBsStyle="danger"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            warning
            title="Excluir Transferência!"
            show={showModalDeleteTransfer}
            onConfirm={submitDeleteTransfer}
            onClose={() => setShowModalDeleteTransfer(false)}
            onCancel={() => setShowModalDeleteTransfer(false)}
          >
            <h4 className="sweet-alert-text my-2">
              Confirma a exclusão desta transferência?
            </h4>
          </SweetAlert>
        </div>
      </Row>
      <div
        className={showModalHandleDestroyGroupTransfer ? 'global-dialog' : ''}
      >
        <SweetAlert
          showCancel
          reverseButtons={false}
          cancelBtnBsStyle="secondary"
          confirmBtnBsStyle="danger"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          warning
          title="Apagar em Lote!"
          show={showModalHandleDestroyGroupTransfer}
          onConfirm={submitHandleDestroyGroupTransfer}
          onClose={() => setshowModalHandleDestroyGroupTransfer(false)}
          onCancel={() => setshowModalHandleDestroyGroupTransfer(false)}
        >
          <h4 className="sweet-alert-text my-2">
            Confirma que deseja apagar as transferências selecionadas? Esta ação
            é irreversível.
          </h4>
        </SweetAlert>
      </div>
    </PermissionGate>
  );
}

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(TransferList);
