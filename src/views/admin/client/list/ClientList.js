import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
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
import { Cpu, Edit, Trash2, ChevronDown } from 'react-feather';
import { ContextLayout } from '../../../../utility/context/Layout';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { history } from '../../../../history';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  fetchClientsList,
  destroyClient,
  dashClients,
} from '../../../../services/apis/client.api';

import StatisticsCard from '../dashboard/StatisticsCard';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import { formatCpfCnpj } from '../../../../utils/formaters';

import PermissionGate from '../../../../PermissionGate';

class ClientList extends React.Component {
  state = {
    rowData: null,
    dataDash: null,
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
        cellStyle: { paddingRight: 0 },
        field: 'id',
        width: 80,
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
        cellRendererFramework: (params) => params.value || '-',
      },
      {
        headerName: 'CPF/CNPJ',
        field: 'document',
        width: 180,
        cellRendererFramework: (params) =>
          params.value ? formatCpfCnpj(params.value) : '-',
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 100,
        cellRendererFramework: (params) =>
          params.value === 1 ? (
            <div className="badge badge-pill badge-light-success">Ativo</div>
          ) : params.value === 0 ? (
            <div className="badge badge-pill badge-light-danger">Inativo</div>
          ) : null,
      },
      {
        headerName: 'Ações',
        field: 'transactions',
        width: 100,
        cellRendererFramework: (params) => (
          <div className="actions cursor-pointer text-success">
            <PermissionGate permissions="clients.show">
              <Edit
                className="mr-50"
                onClick={() =>
                  history.push(`/admin/client/edit/${params.data.id}`)
                }
              />
            </PermissionGate>
            {/* <Trash2
                size={15}
                onClick={() => {
                  store.dispatch(applicationActions.toggleDialog({
                    type: 'warning',
                    title: 'Deletar Conta',
                    message: 'Você tem certeza que deseja deletar esta conta Clienteo Esta ação é irreversível',
                    showCancel: true,
                    reverseButtons: false,
                    cancelBtnBsStyle: 'danger',
                    confirmBtnText: 'Sim, deletar!',
                    cancelBtnText: 'Cancelar',
                    onConfirm: () => {this.deleteClient(params.data.id)},
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

  async deleteClient(id) {
    store.dispatch(applicationActions.hideDialog());
    await destroyClient({ id });
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: 'Cliente deletado com sucesso',
        hasTimeout: true,
      })
    );
    history.push('/admin/client/list');
  }

  async componentDidMount() {
    const { data: rowData } = await fetchClientsList();
    this.setState({ rowData });

    const { data: dataDash } = await dashClients();
    this.setState({ dataDash });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.currentCompanyId !== this.props.currentCompanyId) {
      const { data: rowData } = await fetchClientsList();
      this.setState({ rowData });
    }
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  // getInitialData = async () => {
  // const [dashClients, setdashClients] = useState([]);

  //   const responsedashClients = await dashClients();
  //   if (responsedashClients.data) {
  //     setdashClients(responsedashClients.data);
  //   }
  // };

  // onRowClicked = data => {
  //   console.log('data', data)
  //   history.push(`/client/edit/${data.id}`);
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
    const { rowData, dataDash, columnDefs, defaultColDef, pageSize } =
      this.state;
    return (
      <PermissionGate permissions="companies.clients.index">
        <Row className="app-user-list">
          <Col md="8" sm="12">
            <Breadcrumbs
              breadCrumbTitle={<FormattedMessage id="clients" />}
              breadCrumbActive={<FormattedMessage id="button.list.client" />}
            />
          </Col>
          <PermissionGate permissions="companies.clients.store">
            <Col
              className="d-flex justify-content-end flex-wrap"
              md="4"
              sm="12"
            >
              <Button.Ripple
                className="my-1"
                color="primary"
                onClick={() => history.push('/admin/client/edit')}
              >
                <FormattedMessage id="button.create.client" />
              </Button.Ripple>
            </Col>
          </PermissionGate>

          {/* Dashboard client */}
          <Col lg="6" sm="6">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="primary"
              icon={<Cpu className="primary" size={18} />}
              statTitle="Ativos"
              statTitleMonth="Quantidade"
              statMonth={dataDash?.[0]?.client_active}
            />
          </Col>
          <Col lg="6" sm="6">
            <StatisticsCard
              hideChart
              iconRight
              iconBg="primary"
              icon={<Cpu className="primary" size={18} />}
              statTitle="Novos no mês"
              statTitleMonth="Quantidade"
              statMonth={dataDash?.[0]?.client_active_month}
            />
          </Col>
          <Col>&nbsp;</Col>

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

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(ClientList);
