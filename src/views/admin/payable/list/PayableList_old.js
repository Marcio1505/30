import React from "react"
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
} from "reactstrap"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import { FormattedMessage } from "react-intl"
import {
  Edit,
  ChevronDown,
} from "react-feather"
import { history } from "../../../../history"

import { store } from "../../../../redux/storeConfig/store";
import { applicationActions } from "../../../../new.redux/actions"

import { fetchTransactionsList } from '../../../../services/apis/transaction.api';
import { destroyTransaction } from '../../../../services/apis/transaction.api';

import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import { formatMoney } from '../../../../utils/formaters';

class Payables extends React.Component {

  state = {
    rowData: null,
    pageSize: 10,
    reload: false,
    defaultColDef: {
      sortable: true,
      resizable: true,
      minWidth: 70,
    },
    searchVal: "",
    columnDefs: [
      {
        headerName: "ID",
        field: "id",
        width: 150,
      },
      {
        headerName: "Cliente",
        field: "client.company_name",
        width: 250,
      },
      {
        headerName: "Valor Total",
        field: "total_value",
        width: 250,
        cellRendererFramework: params => (formatMoney(params.value))
      },
      {
        headerName: "Vencimento",
        field: "due_date",
        width: 250
      },
      {
        headerName: "Competência",
        field: "competency_date",
        width: 250
      },
      {
        headerName: "Status",
        field: "status",
        width: 150,
        cellRendererFramework: params => {
          return params.value === 1 ? (
            <div className="badge badge-pill badge-light-warning">
              A Pagar
            </div>
          ) : params.value === 2 ? (
            <div className="badge badge-pill badge-light-success">
              Pago
            </div>
          ) : params.value === 3 ? (
            <div className="badge badge-pill badge-light-success">
              Conciliada
            </div>
          ) : params.value === 4 ? (
            <div className="badge badge-pill badge-light-danger">
              Atrasada
            </div>
          ) : null
        }
      },
      {
        headerName: "Ações",
        field: "transactions",
        width: 150,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Edit
                className="mr-50"
                size={15}
                onClick={() => history.push(`/admin/payable/edit/${params.data.id}`)}
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
                    onConfirm: () => {this.deleteBankAccount(params.data.id)},
                  }));
                  let selectedData = this.gridApi.getSelectedRows()
                  this.gridApi.updateRowData({ remove: selectedData })
                }}
              /> */}
            </div>
          )
        }
      }
    ]
  }

  async deleteBankAccount(id) {
    store.dispatch(applicationActions.hideDialog());
    await destroyTransaction({id});
    store.dispatch(applicationActions.toggleDialog({
      type: 'success',
      title: 'Sucesso',
      message: 'Conta a pagar deletada com sucesso',
      hasTimeout: true,
    }));
    history.push('/admin/payable/list');
  }

  async componentDidMount() {
    const getParams = () => {
      switch (companyType) {
        case 'client':
          return '?type=1'
        case 'supplier':
          return '?type=2'
        default:
          return null
      }
    }
    const { data: rowData } = await fetchTransactionsList({
      params: getParams(),
    });
    this.setState({ rowData })
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  // onRowClicked = data => {
  //   console.log('data', data)
  //   history.push(`/supplier/edit/${data.id}`);
  // }

  filterSize = val => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val))
      this.setState({
        pageSize: val
      })
    }
  }

  updateSearchQuery = val => {
    this.gridApi.setQuickFilter(val)
    this.setState({
      searchVal: val
    })
  }

  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state
    return (
      <Row className="app-user-list">
        <Col className="d-flex justify-content-end flex-wrap" md="12" sm="12">
          <Button.Ripple
            className="my-1"
            color="primary"
            onClick={() => history.push('/admin/payable/edit')}
          >
            <FormattedMessage id='button.create.payable' />
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
                      onChange={e => this.updateSearchQuery(e.target.value)}
                      value={this.state.searchVal}
                    />
                  </div>
                </div>
                {this.state.rowData !== null ? (
                  <ContextLayout.Consumer>
                    {context => (
                      <AgGridReact
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onGridReady={this.onGridReady}
                        // onRowClicked={(e) => this.onRowClicked(e)}
                        colResizeDefault={"shift"}
                        animateRows={true}
                        pagination={true}
                        pivotPanelShow="always"
                        paginationPageSize={pageSize}
                        resizable={true}
                        enableRtl={context.state.direction === "rtl"}
                      />
                    )}
                  </ContextLayout.Consumer>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}

export default Payables
