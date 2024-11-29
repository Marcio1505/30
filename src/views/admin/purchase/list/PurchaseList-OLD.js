import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import {
  Check,
  Clock,
  Plus,
  X,
  Edit,
  Trash2,
  ChevronDown,
} from 'react-feather';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Row,
  Col,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledButtonDropdown,
} from 'reactstrap';

import Flatpickr from 'react-flatpickr';
import { AgGridReact } from 'ag-grid-react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { FormattedMessage } from 'react-intl';

import moment from 'moment';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import Loading from '../../../../components/loading/Loading';

import StatisticsCard from '../../../../components/@vuexy/statisticsCard/StatisticsCard';

import Radio from '../../../../components/@vuexy/radio/RadioVuexy';
import { ContextLayout } from '../../../../utility/context/Layout';

import { history } from '../../../../history';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';
import {
  setSortModel,
  setFilterDueOrPaymentDate,
  setFilterCompetencyDate,
  setFilterStatus,
  setFilterCreatedBy,
} from '../../../../new.redux/purchases/purchases.actions';

import { fetchCategoriesList } from '../../../../services/apis/category.api';
import {
  fetchPurchasesList,
  destroyPurchase,
} from '../../../../services/apis/purchase.api';

import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../utils/formaters';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import { statusPurchaseOptions } from '../../../../utils/purchases';

import PermissionGate from '../../../../PermissionGate';

// const getCategories = async () => {
//   const params = '?type=2';
//   const respCategoriesList = await fetchCategoriesList({ params });
//   const dataCategories = respCategoriesList.data || [];
//   setCategories(
//     dataCategories.map((category) => ({
//       ...category,
//       label: category.name,
//       value: category.id,
//     }))
//   );
// };

class PurchaseList extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  async getInitialData(reloadData = false) {
    const { data: rowData } = await fetchPurchasesList({
      params: this.getParams(),
    });

    if (this.state.filteredRowData && !reloadData) {
      this.setState({ filteredRowData: rowData });
      this.setState({ rowData });
    } else {
      this.setState({ rowData });
      this.setState({ filteredRowData: rowData });

      const { data: dataCategories } = await fetchCategoriesList({
        type: 2,
      });

      const allUsers = rowData.map((item) => item.created_by);

      const uniqAllUsers = [];
      allUsers.forEach((item) => {
        if (!uniqAllUsers.find((user) => user.id === item.id)) {
          uniqAllUsers.push(item);
        }
      });

      this.setState({
        createdByOptions: [
          {
            value: 'all',
            label: 'Todos',
          },
        ].concat(
          uniqAllUsers.map((user) => ({ value: user.id, label: user.name }))
        ),
      });
    }

    this.setState({ initialized: true });
    this.setSumaryData();
  }

  getFilterParams() {
    return {
      comparator(filterLocalDateAtMidnight, cellValue) {
        const dateAsString = cellValue;
        if (dateAsString == null) return -1;
        const dateParts = dateAsString.split('-');
        const cellDate = new Date(
          Number(dateParts[0]),
          Number(dateParts[1]) - 1,
          Number(dateParts[2])
        );
        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime())
          return 0;
        if (cellDate < filterLocalDateAtMidnight) return -1;
        if (cellDate > filterLocalDateAtMidnight) return 1;
      },
      inRangeInclusive: true,
      browserDatePicker: true,
    };
  }

  state = {
    initialized: false,
    createdByOptions: [],
    statusOptions: statusPurchaseOptions(),
    showDeleteModal: false,
    deletePurchaseId: null,
    destroyAll: false,
    rowData: null,
    filteredRowData: null,
    purchasesSumary: {
      total: {
        number: '',
        value: '',
      },
      approved: {
        number: '',
        value: '',
      },
      reproved: {
        number: '',
        value: '',
      },
      pending: {
        number: '',
        value: '',
      },
    },
    collapse: true,
    reload: false,
    defaultColDef: {
      sortable: true,
      // tooltipComponent: 'customTooltip',
    },
    searchVal: '',
    columnDefs: [
      {
        headerName: 'ID',
        field: 'id',
        width: 150,
        filter: true,
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: 'Data',
        field: 'competency_date',
        filter: true,
        filter: 'agDateColumnFilter',
        filterParams: this.getFilterParams,
        width: 160,
        tooltipField: 'competency',
        cellRendererFramework: (params) =>
          formatDateToHumanString(params.data?.competency_date),
      },
      {
        headerName: 'Status',
        field: 'status',
        filter: true,
        width: 120,
        cellRendererFramework: (params) => (
          <>
            {params.data.status === 'waiting' && (
              <div className="badge badge-pill badge-light-info">
                <FormattedMessage id="purchases.status.waiting" />
              </div>
            )}
            {params.data.status === 'approved' && (
              <div className="badge badge-pill badge-light-success">
                <FormattedMessage id="purchases.status.approved" />
              </div>
            )}
            {params.data.status === 'reproved' && (
              <div className="badge badge-pill badge-light-warning">
                <FormattedMessage id="purchases.status.reproved" />
              </div>
            )}
            {params.data.status === 'canceled' && (
              <div className="badge badge-pill badge-light-danger">
                <FormattedMessage id="purchases.status.canceled" />
              </div>
            )}
          </>
        ),
        // hide: true,
        width: 120,
      },
      {
        headerName: 'Categoria',
        field: 'category?.name',
        filter: true,
        width: 190,
        cellRendererFramework: (params) => params.data.category?.name || '-',
      },
      {
        headerName: 'Fornecedor',
        field: 'supplier?.company_name',
        filter: true,
        width: 250,
        cellRendererFramework: (params) => params.data?.supplier?.company_name,
      },
      {
        headerName: 'Valor',
        field: 'purchase_value',
        filter: true,
        width: 120,
        cellRendererFramework: (params) => formatMoney(params.value),
      },
      {
        headerName: 'Ações',
        field: 'purchases',
        width: 150,
        cellRendererFramework: (params) => (
          <div className="d-flex">
            <PermissionGate permissions="purchases.show">
              <div className="actions cursor-pointer text-success">
                <Edit
                  className="mr-50"
                  onClick={() => this.goToEditPurchase(params)}
                />
              </div>
            </PermissionGate>
          </div>
        ),
      },
      {
        headerName: 'Competência',
        field: 'competency_date',
        filter: true,
        filter: 'agDateColumnFilter',
        filterParams: this.getFilterParams,
        width: 150,
        cellRendererFramework: (params) =>
          `${formatDateToHumanString(params.data?.competency_date)}`,
        hide: true,
        // width: 0,
      },
      {
        headerName: 'Categoria',
        field: 'category_id',
        filter: true,
        hide: true,
        width: 0,
      },
    ],
  };

  goToEditPurchase(params) {
    history.push(`/admin/purchase/edit/${params.data.id}`);
  }

  modalSubmit = async () => {
    this.toggleModal();

    await destroyPurchase({
      id: this.state.deletePurchaseId,
      destroyAll: this.state.destroyAll,
    });

    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: 'Compra deletada com sucesso',
        hasTimeout: true,
      })
    );

    this.getInitialData();
  };

  async deletePurchase(purchaseId) {
    store.dispatch(applicationActions.hideDialog());
    this.toggleModal(purchaseId);
  }

  getParams() {
    let params = '?';
    const {
      purchaseType,
      filter_due_or_payment_date,
      filter_competency_date,
      filter_status,
      filter_created_by,
    } = this.props;

    if (filter_due_or_payment_date?.length > 0) {
      const due_or_payment_date_from = moment(
        filter_due_or_payment_date?.[0] || ''
      ).format('YYYY-MM-DD');
      const due_or_payment_date_to = moment(
        filter_due_or_payment_date?.[1] || ''
      ).format('YYYY-MM-DD');
      params += `&due_or_payment_date_from=${due_or_payment_date_from}&due_or_payment_date_to=${due_or_payment_date_to}`;
    }

    if (filter_competency_date?.length > 0) {
      const competency_date_from = moment(
        filter_competency_date?.[0] || ''
      ).format('YYYY-MM-DD');
      const competency_date_to = moment(
        filter_competency_date?.[1] || ''
      ).format('YYYY-MM-DD');
      params += `&competency_date_from=${competency_date_from}&competency_date_to=${competency_date_to}`;
    }

    if (filter_status !== 'all') {
      params += `&status=${filter_status}`;
    }

    if (filter_created_by !== 'all') {
      params += `&created_by=${filter_created_by}`;
    }

    return params;
  }

  toggleModal = (purchaseId) => {
    this.setState({
      showDeleteModal: !this.state.showDeleteModal,
      deletePurchaseId: purchaseId,
    });
  };

  async componentDidMount() {
    this.getInitialData();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.currentCompanyId !== this.props.currentCompanyId) {
      this.setState({ initialized: false });
      this.getInitialData(true);
    }
    if (prevProps.filter_created_by !== this.props.filter_created_by) {
      this.getInitialData(true);
    }
    if (prevProps.filter_status !== this.props.filter_status) {
      this.getInitialData(true);
    }
    if (
      prevProps.filter_due_or_payment_date !==
      this.props.filter_due_or_payment_date
    ) {
      this.getInitialData(true);
    }
    if (
      prevProps.filter_competency_date !== this.props.filter_competency_date
    ) {
      this.getInitialData(true);
    }
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.props.sortModel) {
      this.gridApi.setSortModel(this.props.sortModel);
    }
    if (this.props.pageSize) {
      this.gridApi.paginationSetPageSize(this.props.pageSize);
    }
  };

  onSortChanged = (params) => {
    this.props.setSortModel({
      sortModel: params.api.sortController.getSortModel(),
    });
  };

  onSelectionChanged = () => {
    this.setSumaryData();
  };

  onFilterChanged = () => {
    this.gridApi.deselectAll();
    this.setSumaryData();
  };

  getSelectedRowData = () => {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  getFilteredOrSelectedPurchases = () => {
    let purchases = [];
    const selectedRowData = this.getSelectedRowData();
    if (selectedRowData?.length) {
      purchases = selectedRowData;
    } else {
      purchases = this.state.rowData;
    }
    return purchases;
  };

  setSumaryData = () => {
    const purchases = this.getFilteredOrSelectedPurchases();
    const totalValue = purchases.reduce(
      (accumulator, { paid_value, purchase_value }) =>
        accumulator + (paid_value || purchase_value),
      0
    );
    const approvedPurchases = purchases.filter(({ status }) => status === 3);
    const approvedValue = approvedPurchases.reduce(
      (accumulator, { paid_value }) => accumulator + paid_value,
      0
    );
    const pendingPurchases = purchases.filter(
      ({ status }) => status !== 3 && status !== 4
    );
    const pendingValue = pendingPurchases.reduce(
      (accumulator, { purchase_value }) => accumulator + purchase_value,
      0
    );
    const reprovedPurchases = purchases.filter(({ status }) => status === 4);
    const reprovedValue = reprovedPurchases.reduce(
      (accumulator, { purchase_value }) => accumulator + purchase_value,
      0
    );

    this.setState({
      purchasesSumary: {
        ...this.state.purchasesSumary,
        reproved: {
          number: reprovedPurchases?.length,
          value: reprovedValue,
          text_number: reprovedPurchases?.length
            ? `(${reprovedPurchases?.length}) `
            : '(0) ',
          text_value: formatMoney(reprovedValue || 0),
        },
        pending: {
          number: pendingPurchases?.length,
          value: pendingValue,
          text_number: pendingPurchases?.length
            ? `(${pendingPurchases?.length}) `
            : '(0) ',
          text_value: formatMoney(pendingValue || 0),
        },
        approved: {
          number: approvedPurchases?.length,
          value: approvedValue,
          text_number: approvedPurchases?.length
            ? `(${approvedPurchases?.length}) `
            : '(0) ',
          text_value: formatMoney(approvedValue || 0),
        },
        total: {
          number: purchases?.length,
          value: totalValue,
          text_number: purchases?.length ? `(${purchases?.length}) ` : '(0) ',
          text_value: formatMoney(totalValue || 0),
        },
      },
    });
  };

  filterSize = (val) => {
    if (this.gridApi) {
      this.props.setPageSize({ pageSize: Number(val) });
      this.gridApi.paginationSetPageSize(Number(val));
    }
  };

  updateSearchQuery = (val) => {
    // console.log({val})
    this.gridApi.setQuickFilter(val);
    this.setState({
      searchVal: val,
    });
  };

  render() {
    const {
      rowData,
      columnDefs,
      defaultColDef,
      filteredRowData,
      createdByOptions,
      statusOptions,
    } = this.state;

    const animatedComponents = makeAnimated();
    const currentCompany = this.props.companies.find(
      (company) => company.id === this.props.currentCompanyId
    );

    return (
      <>
        {!this.state.initialized && <Loading />}
        <Row className={!this.state?.initialized ? 'd-none' : ''}>
          <Modal
            isOpen={this.state.showDeleteModal}
            toggle={this.toggleModal}
            className="modal-dialog-centered"
          >
            <ModalHeader toggle={this.toggleModal}>Deletar</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Radio
                  className="my-2"
                  label="Deletar somente este"
                  defaultChecked
                  name="destroy_all"
                  id="destroy_all"
                  onChange={() => this.setState({ destroyAll: false })}
                />
                <Radio
                  label="Deletar este e todos os futuros"
                  name="destroy_all"
                  id="destroy_all"
                  onChange={() => this.setState({ destroyAll: true })}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={this.modalSubmit}>
                Deletar
              </Button>{' '}
            </ModalFooter>
          </Modal>
          <Col md="6" sm="12">
            <Breadcrumbs
              breadCrumbTitle={<FormattedMessage id="purchases" />}
              breadCrumbActive={<FormattedMessage id="button.list.purchase" />}
            />
          </Col>
          <Col className="d-flex justify-content-end flex-wrap" md="6" sm="12">
            <PermissionGate permissions="companies.purchases.store">
              <Button.Ripple
                onClick={() => history.push('/admin/purchase/edit')}
                className="ml-1 my-1"
                color="primary"
              >
                <FormattedMessage id="button.create.purchase" />
              </Button.Ripple>
            </PermissionGate>
          </Col>
          <Col sm="12">
            <Card className="d-block pb-2 mb-2">
              <CardHeader className="d-block">
                <Row>
                  <Col lg="3" md="6" sm="12">
                    <FormGroup className="mb-1 mb-lg-0">
                      <Label for="filter_due_or_payment_date">
                        Data Vencimento / Pagamento
                      </Label>
                      <InputGroup>
                        <Flatpickr
                          id="filter_due_or_payment_date"
                          className="form-control"
                          options={{
                            mode: 'range',
                            dateFormat: 'Y-m-d',
                            altFormat: 'd/m/Y',
                            altInput: true,
                          }}
                          value={this.props.filter_due_or_payment_date}
                          onChange={(date) => {
                            if (date?.length === 2) {
                              this.props.setFilterDueOrPaymentDate({
                                filter_due_or_payment_date: date,
                              });
                            }
                          }}
                        />
                        <InputGroupAddon addonType="append">
                          <Button
                            color="primary"
                            onClick={() => {
                              this.props.setFilterDueOrPaymentDate({
                                filter_due_or_payment_date: '',
                              });
                            }}
                          >
                            X
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col lg="3" md="6" sm="12">
                    <FormGroup className="mb-1 mb-lg-0">
                      <Label for="filter_competency_date">
                        Data Competência
                      </Label>
                      <InputGroup>
                        <Flatpickr
                          id="filter_competency_date"
                          className="form-control"
                          options={{
                            mode: 'range',
                            dateFormat: 'Y-m-d',
                            altFormat: 'd/m/Y',
                            altInput: true,
                          }}
                          value={this.props.filter_competency_date}
                          onChange={(date) => {
                            if (date?.length === 2) {
                              this.props.setFilterCompetencyDate({
                                filter_competency_date: date,
                              });
                            }
                          }}
                        />
                        <InputGroupAddon addonType="append">
                          <Button
                            color="primary"
                            onClick={() => {
                              this.props.setFilterCompetencyDate({
                                filter_competency_date: '',
                              });
                            }}
                          >
                            X
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col lg="3" md="6" sm="12">
                    <FormGroup className="mb-1 mb-lg-0">
                      <label>Status</label>
                      <Select
                        components={animatedComponents}
                        options={statusOptions}
                        value={statusOptions.filter(
                          (option) => option.value === this.props.filter_status
                        )}
                        onChange={(selected) => {
                          console.log({ selected });
                          this.props.setFilterStatus({
                            filter_status: selected.value,
                          });
                        }}
                        className="React"
                        classNamePrefix="select"
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="3" md="6" sm="12">
                    <FormGroup className="mb-1 mb-lg-0">
                      <label>Criado Por</label>
                      <Select
                        value={createdByOptions.filter(
                          (option) =>
                            option.value === this.props.filter_created_by
                        )}
                        components={animatedComponents}
                        options={createdByOptions}
                        onChange={(val) => {
                          this.props.setFilterCreatedBy({
                            filter_created_by: val.value,
                          });
                          this.setState({
                            filter_filter_created_by: val.value,
                          });
                        }}
                        className="React"
                        classNamePrefix="select"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
            </Card>
            <Row className="my-2">
              <Col lg="3" md="6" sm="12">
                <StatisticsCard
                  solid
                  hideChart
                  iconBg="#FFF"
                  className="mb-0 bg-success text-left"
                  icon={<Check className="success" size={22} />}
                  stat={this.state.purchasesSumary.approved.text_value}
                  statTitle={`Compras Aprovadas ${this.state.purchasesSumary.approved.text_number}`}
                  options={3}
                  type="area"
                />
              </Col>
              <Col lg="3" md="6" sm="12">
                <StatisticsCard
                  solid
                  hideChart
                  iconBg="#FFF"
                  className="mb-0 bg-warning text-left"
                  icon={<Clock className="warning" size={22} />}
                  stat={this.state.purchasesSumary.pending.text_value}
                  statTitle={`Compras Pendentes ${this.state.purchasesSumary.pending.text_number}`}
                  options={3}
                  type="area"
                />
              </Col>
              <Col lg="3" md="6" sm="12">
                <StatisticsCard
                  solid
                  hideChart
                  iconBg="#FFF"
                  className="mb-0 bg-danger text-left"
                  icon={<X className="danger" size={22} />}
                  stat={this.state.purchasesSumary.reproved.text_value}
                  statTitle={`Contas Reprovadas ${this.state.purchasesSumary.reproved.text_number}`}
                  options={3}
                  type="area"
                />
              </Col>
              <Col lg="3" md="6" sm="12">
                <StatisticsCard
                  solid
                  hideChart
                  iconBg="#FFF"
                  className="mb-0 bg-success text-left"
                  icon={<Plus className="success" size={22} />}
                  stat={this.state.purchasesSumary.total.text_value}
                  statTitle={`Total ${this.state.purchasesSumary.total.text_number}`}
                  options={3}
                  type="area"
                />
              </Col>
            </Row>
            <Card>
              <CardBody>
                <div className="ag-theme-material ag-grid-table     resizable: true,
    minWidth: 70,">
                  <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                    <div className="sort-dropdown">
                      <UncontrolledDropdown className="ag-dropdown p-1">
                        <DropdownToggle tag="div">
                          {/* 1 - {pageSize} de {this.gridApi?.getDisplayedRowCount()} */}
                          1 - {this.props.pageSize} de {filteredRowData?.length}
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
                          <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(200)}
                          >
                            200
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
                      {/* <div className="dropdown actions-dropdown">
                        <UncontrolledButtonDropdown>
                          <DropdownToggle
                            className="px-2 py-75 d-flex"
                            color="white"
                          >
                            Ações
                            <ChevronDown className="ml-50" size={15} />
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem tag="a">
                              <Trash2 size={15} />
                              <span className="align-middle ml-50">Delete</span>
                            </DropdownItem>
                            <DropdownItem tag="a">
                              <Clipboard size={15} />
                              <span className="align-middle ml-50">Archive</span>
                            </DropdownItem>
                            <DropdownItem
                              tag="a"
                              onClick={
                                () => console.log('exportPurchase')
                                // exportpurchasesXLS(
                                //   this.props.purchaseType,
                                //   this.getFilteredOrSelectedPurchases(),
                                //   currentCompany
                                // )
                              }
                            >
                              <Download size={15} />
                              <span className="align-middle ml-50">
                                Exportar XLSX
                              </span>
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                      </div> */}
                    </div>
                  </div>
                  {this.state.filteredRowData !== null ? (
                    <ContextLayout.Consumer>
                      {(context) => (
                        <AgGridReact
                          gridOptions={{}}
                          rowSelection="multiple"
                          sortModel={this.props.sortModel}
                          // floatingFilter={true}
                          defaultColDef={defaultColDef}
                          columnDefs={columnDefs}
                          rowData={rowData}
                          onGridReady={this.onGridReady}
                          onSelectionChanged={this.onSelectionChanged}
                          onFilterChanged={this.onFilterChanged}
                          onSortChanged={this.onSortChanged}
                          // loadingOverlayComponent="customLoadingOverlay"
                          frameworkComponents={
                            {
                              // customTooltip: CustomTooltip,
                              // customLoadingOverlay: Spinner,
                            }
                          }
                          tooltipShowDelay={0}
                          // onRowClicked={(e) => this.onRowClicked(e)}
                          colResizeDefault="shift"
                          animateRows
                          pagination
                          pivotPanelShow="always"
                          paginationPageSize={this.props.pageSize}
                          resizable
                          enableRtl={context.state.direction === 'rtl'}
                        />
                      )}
                    </ContextLayout.Consumer>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

PurchaseList.propTypes = {
  purchaseType: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  currentCompany: state.companies.currentCompany,
  currentUser: state.auth,
  companies: state.companies.companies,
  filter_competency_date: state.purchases.filter.filter_competency_date,
  filter_due_or_payment_date: state.purchases.filter.filter_due_or_payment_date,
  filter_status: state.purchases.filter.filter_status,
  filter_created_by: state.purchases.filter.filter_created_by,
});

const mapDispatchToProps = {
  setSortModel,
  setFilterDueOrPaymentDate,
  setFilterCompetencyDate,
  setFilterStatus,
  setFilterCreatedBy,
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseList);
