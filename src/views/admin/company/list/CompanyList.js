import React from 'react';
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  Button,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import { FormattedMessage } from 'react-intl';
import { Edit, Trash2, ChevronDown } from 'react-feather';
import { ContextLayout } from '../../../../utility/context/Layout';
import { history } from '../../../../history';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  fetchCompaniesList,
  destroyCompany,
} from '../../../../services/apis/company.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import { formatCpfCnpj } from '../../../../utils/formaters';

import PermissionGate from '../../../../PermissionGate';

class CompanyList extends React.Component {
  state = {
    rowData: null,
    pageSize: 10,
    reload: false,
    defaultColDef: {
      sortable: true,
      resizable: true,
      minWidth: 70,
    },
    searchVal: '',
    columnDefs: [
      {
        headerName: 'ID',
        field: 'id',
        width: 110,
      },
      {
        headerName: 'Nome/Razão Social',
        field: 'company_name',
        width: 250,
      },
      {
        headerName: 'Nome Fantasia',
        field: 'trading_name',
        width: 200,
      },
      {
        headerName: 'CPF/CNPJ',
        field: 'document',
        width: 180,
        cellRendererFramework: (params) => formatCpfCnpj(params.value),
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 100,
        cellRendererFramework: (params) =>
          params.value === 1 ? (
            <div className="badge badge-pill badge-light-success">Ativa</div>
          ) : params.value === 0 ? (
            <div className="badge badge-pill badge-light-danger">Inativa</div>
          ) : null,
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
                history.push(`/admin/company/edit/${params.data.id}`)
              }
            />
            {/* <Trash2
                size={15}
                onClick={() => {
                  store.dispatch(applicationActions.toggleDialog({
                    type: 'warning',
                    title: 'Deletar Conta',
                    message: 'Você tem certeza que deseja deletar esta conta empresa. Esta ação é irreversível',
                    showCancel: true,
                    reverseButtons: false,
                    cancelBtnBsStyle: 'danger',
                    confirmBtnText: 'Sim, deletar!',
                    cancelBtnText: 'Cancelar',
                    onConfirm: () => {this.deleteCompany(params.data.id)},
                  }));
                  let selectedData = this.gridApi.getSelectedRows()
                  this.gridApi.updateRowData({ remove: selectedData })
                }}
              /> */}
          </div>
        ),
      },
    ],
  };

  async deleteCompany(id) {
    store.dispatch(applicationActions.hideDialog());
    await destroyCompany({ id });
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: 'Empresa deletada com sucesso',
        hasTimeout: true,
      })
    );
    history.push('/admin/company/list');
  }

  async componentDidMount() {
    const { data: rowData } = await fetchCompaniesList();
    this.setState({ rowData });
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  // onRowClicked = data => {
  //   console.log('data', data)
  //   history.push(`/company/edit/${data.id}`);
  // }

  filterSize = (val) => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val));
      this.setState({
        pageSize: val,
      });
    }
  };

  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
    this.setState({
      searchVal: val,
    });
  };

  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    return (
      <PermissionGate permissions="unpublic">
        <Row className="app-user-list">
          <Col className="d-flex justify-content-end flex-wrap" md="12" sm="12">
            <Button.Ripple
              className="my-1"
              color="primary"
              onClick={() => history.push('/admin/company/edit')}
            >
              <FormattedMessage id="button.create.company" />
            </Button.Ripple>
          </Col>
          <Col sm="12">
            <Card>
              <CardBody>
                <div className="ag-theme-material ag-grid-table allow-text-selection">
                  <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                    <div className="sort-dropdown">
                      <UncontrolledDropdown className="ag-dropdown p-1">
                        <DropdownToggle tag="div">
                          1 - {pageSize} de {rowData?.length}
                          <ChevronDown className="ml-50" size={15} />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(10)}
                          >
                            10
                          </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(20)}
                          >
                            20
                          </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(50)}
                          >
                            50
                          </DropdownItem>
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(100)}
                          >
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
                        onChange={(e) => this.updateSearchQuery(e.target.value)}
                        value={this.state.searchVal}
                      />
                    </div>
                  </div>
                  {this.state.rowData !== null ? (
                    <ContextLayout.Consumer>
                      {(context) => (
                        <AgGridReact
                          defaultColDef={defaultColDef}
                          columnDefs={columnDefs}
                          rowData={rowData}
                          onGridReady={this.onGridReady}
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
        </Row>
      </PermissionGate>
    );
  }
}

export default CompanyList;
