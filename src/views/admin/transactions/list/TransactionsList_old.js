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
  File,
  Download,
  Upload,
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

import moment from 'moment';

import StatisticsCard from '../../../../components/@vuexy/statisticsCard/StatisticsCard';
import Radio from '../../../../components/@vuexy/radio/RadioVuexy';
import TransactionStatusBadge from '../../../../components/badges/TransactionStatusBadge';
import TransactionSourceBadge from '../../../../components/badges/TransactionSourceBadge';

import { ContextLayout } from '../../../../utility/context/Layout';

import { history } from '../../../../history';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import { fetchCategoriesList } from '../../../../services/apis/category.api';
import {
  fetchTransactionsList,
  destroyTransaction,
} from '../../../../services/apis/transaction.api';

import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../utils/formaters';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import { exportTransactionsXLS } from '../../../../utils/transactions/exporters';

import { statusTransactionOptions } from '../../../../utils/transactions';

class TransactionsList extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  async getInitialData(reloadData = false) {
    const { data: rowData } = await fetchTransactionsList({
      params: this.getParams(),
    });

    if (this.state.filteredRowData && !reloadData) {
      this.setState({ filteredRowData: rowData });
      this.setState({ rowData });
    } else {
      this.setState({ rowData });
      this.setState({ filteredRowData: rowData });

      const { data: dataTansactionSubcategories } = await fetchCategoriesList({
        params: this.getParams(),
      });

      this.setState({
        transactionSubcategoriesOptions:
          this.state.transactionSubcategoriesOptions.concat(
            dataTansactionSubcategories.map((subcategory) => ({
              ...subcategory,
              value: subcategory.id,
              label: subcategory.name,
            }))
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
    transactionSubcategoriesOptions: [
      {
        value: 'all',
        label: 'Todas',
      },
    ],
    statusOptions: statusTransactionOptions(this.props.transactionType),
    filter_competency_date: '',
    showDeleteModal: false,
    deleteTransactionId: null,
    destroyAll: false,
    rowData: null,
    filteredRowData: null,
    transactionsSumary: {
      total: {
        number: '',
        value: '',
      },
      paid: {
        number: '',
        value: '',
      },
      overdue: {
        number: '',
        value: '',
      },
      toPay: {
        number: '',
        value: '',
      },
    },
    collapse: true,
    reload: false,
    defaultColDef: {
      sortable: true,
      minWidth: 70,
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
        field: 'due_or_payment_date',
        filter: true,
        filter: 'agDateColumnFilter',
        filterParams: this.getFilterParams,
        width: 110,
        tooltipField: 'due_or_payment_date',
        cellRendererFramework: (params) =>
          `${formatDateToHumanString(params.data?.due_or_payment_date)}`,
      },
      {
        headerName: '',
        field: 'computed_status',
        filter: true,
        width: 120,
        cellRendererFramework: (params) => (
          <>
            <TransactionStatusBadge
              computedStatus={params.data.computed_status}
            />
            <TransactionSourceBadge
              entity={
                this.props.transactionType === 'PAYABLE'
                  ? 'Conta a Pagar'
                  : 'Conta a Receber'
              }
              transactionSource={params.data.source}
            />
          </>
        ),
        width: 110,
      },
      {
        headerName: 'Categoria',
        field: 'category.name',
        filter: true,
        width: 190,
        cellRendererFramework: (params) => params.data.category?.name || '-',
      },
      {
        headerName:
          this.props.transactionType === 'PAYABLE'
            ? 'Fornecedor'
            : this.props.transactionType === 'RECEIVABLE'
            ? 'Cliente'
            : '',
        field:
          this.props.transactionType === 'PAYABLE'
            ? 'supplier.company_name'
            : 'client.company_name',
        filter: true,
        width: 250,
        cellRendererFramework: (params) => {
          if (this.props.transactionType === 'PAYABLE') {
            return params.data?.supplier?.company_name;
          }
          if (this.props.transactionType === 'RECEIVABLE') {
            return params.data?.client?.company_name;
          }
          return '-';
        },
      },
      {
        headerName: 'Valor',
        field: 'transaction_value_or_paid_value',
        filter: true,
        width: 120,
        cellRendererFramework: (params) => formatMoney(params.value),
      },
      {
        headerName: 'Ações',
        field: 'transactions',
        width: 150,
        cellRendererFramework: (params) => (
          <div className="d-flex">
            <div className="actions cursor-pointer text-success">
              <Edit
                className="mr-50"
                onClick={() => this.goToEditTransaction(params)}
              />
            </div>
            <div className="actions cursor-pointer text-danger">
              <Trash2
                onClick={() => {
                  if (!params.data.is_deletable) {
                    store.dispatch(
                      applicationActions.toggleDialog({
                        type: 'warning',
                        title: 'Ação não permitida',
                        message: (
                          <>
                            Esta transação está associada a uma venda. Para
                            excluí-la você deve excluir a{' '}
                            <a href={`/admin/sale/edit/${params.data.sale_id}`}>
                              venda que a gerou
                            </a>
                          </>
                        ),
                        confirmBtnText: 'Ok',
                        onConfirm: () => {
                          store.dispatch(applicationActions.hideDialog());
                        },
                      })
                    );
                  } else {
                    store.dispatch(
                      applicationActions.toggleDialog({
                        type: 'warning',
                        title: 'Deletar Transação',
                        message:
                          'Você tem certeza que deseja deletar esta transação. Esta ação é irreversível',
                        showCancel: true,
                        reverseButtons: false,
                        cancelBtnBsStyle: 'secondary',
                        confirmBtnBsStyle: 'danger',
                        confirmBtnText: 'Sim, deletar!',
                        cancelBtnText: 'Cancelar',
                        onConfirm: () => {
                          this.deleteTransaction(params.data.id);
                        },
                      })
                    );
                  }
                }}
              />
            </div>
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

  goToImportTransactionPage() {
    switch (this.props.transactionType) {
      case 'RECEIVABLE':
        console.log('re');
        history.push(`/admin/receivable/import/`);
        break;
      case 'PAYABLE':
        console.log('pa');
        history.push(`/admin/payable/import/`);
        break;
      default:
        console.log('no');
        break;
    }
  }

  goToEditTransaction(params) {
    switch (this.props.transactionType) {
      case 'RECEIVABLE':
        history.push(`/admin/receivable/edit/${params.data.id}`);
        break;
      case 'PAYABLE':
        history.push(`/admin/payable/edit/${params.data.id}`);
        break;
      default:
        break;
    }
  }

  modalSubmit = async () => {
    this.toggleModal();

    await destroyTransaction({
      id: this.state.deleteTransactionId,
      destroyAll: this.state.destroyAll,
    });

    const getSuccessEditedMessage = () => {
      switch (this.props.transactionType) {
        case 'PAYABLE':
          return 'Conta a pagar deletada com sucesso';
        case 'RECEIVABLE':
          return 'Conta a receber deletada com sucesso';
        default:
          return 'Dados deletados com sucesso';
      }
    };

    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: getSuccessEditedMessage(),
        hasTimeout: true,
      })
    );

    this.getInitialData();
  };

  async deleteTransaction(transactionId) {
    store.dispatch(applicationActions.hideDialog());
    this.toggleModal(transactionId);
  }

  getParams() {
    let params = '?';
    const {
      transactionType,
      filter_due_or_payment_date,
      filter_competency_date,
      filter_computed_status,
      category_id,
    } = this.props;

    switch (transactionType) {
      case 'RECEIVABLE':
        params += 'type=1';
        break;
      case 'PAYABLE':
        params += 'type=2';
        break;
      default:
        break;
    }

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

    if (filter_computed_status !== 'all') {
      params += `&computed_status=${filter_computed_status}`;
    }

    if (category_id !== 'all') {
      params += `&category_id=${category_id}`;
    }

    return params;
  }

  toggleModal = (transactionId) => {
    this.setState({
      showDeleteModal: !this.state.showDeleteModal,
      deleteTransactionId: transactionId,
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
    if (prevProps.category_id !== this.props.category_id) {
      this.getInitialData(true);
    }
    if (
      prevProps.filter_computed_status !== this.props.filter_computed_status
    ) {
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

  getFilteredOrSelectedTransactions = () => {
    let transactions = [];
    const selectedRowData = this.getSelectedRowData();
    if (selectedRowData.length) {
      transactions = selectedRowData;
    } else {
      transactions = this.state.rowData;
    }
    return transactions;
  };

  setSumaryData = () => {
    const transactions = this.getFilteredOrSelectedTransactions();
    const totalValue = transactions.reduce(
      (accumulator, { paid_value, transaction_value_or_paid_value }) =>
        accumulator + (paid_value || transaction_value_or_paid_value),
      0
    );
    const paidTransactions = transactions.filter(
      ({ computed_status }) => computed_status === 1
    );
    const paidValue = paidTransactions.reduce(
      (accumulator, { paid_value }) => accumulator + paid_value,
      0
    );
    const toPayTransactions = transactions.filter(
      ({ computed_status }) => computed_status === 2
    );
    const toPayValue = toPayTransactions.reduce(
      (accumulator, { transaction_value_or_paid_value }) =>
        accumulator + transaction_value_or_paid_value,
      0
    );
    const overdueTransactions = transactions.filter(
      ({ computed_status }) => computed_status === 3
    );
    const overdueValue = overdueTransactions.reduce(
      (accumulator, { transaction_value_or_paid_value }) =>
        accumulator + transaction_value_or_paid_value,
      0
    );

    this.setState({
      transactionsSumary: {
        ...this.state.transactionsSumary,
        overdue: {
          number: overdueTransactions.length,
          value: overdueValue,
          text_number: overdueTransactions.length
            ? `(${overdueTransactions.length}) `
            : '(0) ',
          text_value: formatMoney(overdueValue || 0),
        },
        toPay: {
          number: toPayTransactions.length,
          value: toPayValue,
          text_number: toPayTransactions.length
            ? `(${toPayTransactions.length}) `
            : '(0) ',
          text_value: formatMoney(toPayValue || 0),
        },
        paid: {
          number: paidTransactions.length,
          value: paidValue,
          text_number: paidTransactions.length
            ? `(${paidTransactions.length}) `
            : '(0) ',
          text_value: formatMoney(paidValue || 0),
        },
        total: {
          number: transactions.length,
          value: totalValue,
          text_number: transactions.length
            ? `(${transactions.length}) `
            : '(0) ',
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
      transactionSubcategoriesOptions,
      statusOptions,
    } = this.state;

    const animatedComponents = makeAnimated();
    const currentCompany = this.props.companies.find(
      (company) => company.id === this.props.currentCompanyId
    );

    return (
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
                          if (date.length === 2) {
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
                    <Label for="filter_competency_date">Data Competência</Label>
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
                          if (date.length === 2) {
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
                        (option) =>
                          option.value === this.props.filter_computed_status
                      )}
                      onChange={(selected) => {
                        this.props.setFilterComputedStatus({
                          filter_computed_status: selected.value,
                        });
                      }}
                      className="React"
                      classNamePrefix="select"
                    />
                  </FormGroup>
                </Col>
                <Col lg="3" md="6" sm="12">
                  <FormGroup className="mb-1 mb-lg-0">
                    <label>Categoria</label>
                    <Select
                      value={transactionSubcategoriesOptions.filter(
                        (option) => option.value === this.props.category_id
                      )}
                      components={animatedComponents}
                      options={transactionSubcategoriesOptions}
                      onChange={(val) => {
                        this.props.setFilterCategoryId({
                          category_id: val.value,
                        });
                        this.setState({
                          category_id: val.value,
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
                stat={this.state.transactionsSumary.paid.text_value}
                statTitle={
                  this.props.transactionType === 'RECEIVABLE'
                    ? `Contas Recebidas ${this.state.transactionsSumary.paid.text_number}`
                    : `Contas Pagas ${this.state.transactionsSumary.paid.text_number}`
                }
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
                stat={this.state.transactionsSumary.toPay.text_value}
                statTitle={
                  this.props.transactionType === 'RECEIVABLE'
                    ? `Contas a Receber ${this.state.transactionsSumary.toPay.text_number}`
                    : `Contas a Pagar ${this.state.transactionsSumary.toPay.text_number}`
                }
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
                stat={this.state.transactionsSumary.overdue.text_value}
                statTitle={`Contas Atrasadas ${this.state.transactionsSumary.overdue.text_number}`}
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
                stat={this.state.transactionsSumary.total.text_value}
                statTitle={`Total ${this.state.transactionsSumary.total.text_number}`}
                options={3}
                type="area"
              />
            </Col>
          </Row>
          <Card>
            <CardBody>
              <div className="ag-theme-material ag-grid-table allow-text-selection">
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
                          {/* <DropdownItem tag="a">
                            <Trash2 size={15} />
                            <span className="align-middle ml-50">Delete</span>
                          </DropdownItem>
                          <DropdownItem tag="a">
                            <Clipboard size={15} />
                            <span className="align-middle ml-50">Archive</span>
                          </DropdownItem> */}
                          <DropdownItem
                            tag="a"
                            onClick={() =>
                              history.push({
                                pathname:
                                  this.props.transactionType === 'RECEIVABLE'
                                    ? '/admin/receivable/report'
                                    : '/admin/payable/report',
                                company: currentCompany,
                                user: this.props.currentUser?.login?.values
                                  ?.loggedInUser,
                                transactions:
                                  this.getFilteredOrSelectedTransactions(),
                              })
                            }
                          >
                            <File size={15} />
                            <span className="align-middle ml-50">
                              Relatório
                            </span>
                          </DropdownItem>
                          <DropdownItem
                            tag="a"
                            onClick={() =>
                              exportTransactionsXLS(
                                this.props.transactionType,
                                this.getFilteredOrSelectedTransactions(),
                                currentCompany
                              )
                            }
                          >
                            <Download size={15} />
                            <span className="align-middle ml-50">
                              Exportar XLSX
                            </span>
                          </DropdownItem>
                          <DropdownItem
                            tag="a"
                            onClick={() => this.goToImportTransactionPage()}
                          >
                            <Upload size={15} />
                            <span className="align-middle ml-50">
                              Importar XLSX
                            </span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
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
    );
  }
}

TransactionsList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
  currentCompany: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  companies: PropTypes.object.isRequired,
  transactionType: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  currentCompany: state.companies.currentCompany,
  currentUser: state.auth,
  companies: state.companies.companies,
});

export default connect(mapStateToProps)(TransactionsList);
