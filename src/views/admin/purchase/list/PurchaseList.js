import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Edit, Trash2 } from 'react-feather';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Label,
} from 'reactstrap';

import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import Loading from '../../../../components/loading/Loading';
import BasicListTable from '../../../../components/tables/BasicListTable';
import PurchasesSummary from '../../../../components/summaries/PurchasesSummary';

import { history } from '../../../../history';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  fetchPurchasesList,
  fetchCreatedByOptions,
  destroyPurchase,
} from '../../../../services/apis/purchase.api';

import {
  setSortModel,
  setFilterDueOrPaymentDate,
  setFilterCompetencyDate,
  setFilterStatus,
  setFilterCreatedById,
} from '../../../../new.redux/purchases/purchases.actions';

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

function PurchaseList({
  currentCompanyId,
  filter_competency_date,
  filter_due_or_payment_date,
  filter_status,
  filter_created_by_id,
  setSortModel,
  setFilterDueOrPaymentDate,
  setFilterCompetencyDate,
  setFilterStatus,
  setFilterCreatedById,
}) {
  const initialPurchasesSumary = {
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
  };
  const [purchases, setPurchases] = useState([]);
  const [createdByOptions, setCreatedByOptions] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [summaryData, setSummaryData] = useState(initialPurchasesSumary);

  const statusPurchase = statusPurchaseOptions();

  const getParams = () => {
    let params = '?';
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
    if (filter_created_by_id !== 'all' && filter_created_by_id) {
      params += `&created_by_id=${filter_created_by_id}`;
    }
    return params;
  };

  const setPurchaseList = async () => {
    setInitialized(false);
    const respFetchPurchaseList = await fetchPurchasesList({
      params: getParams(),
    });
    const purchasesData = respFetchPurchaseList.data;
    setPurchases(purchasesData);
    updateSummaryData();
    setInitialized(true);
  };

  const setCreatedByOptionsList = async () => {
    const respGetCreatedByOptions = await fetchCreatedByOptions();
    const createdByOptionsData = respGetCreatedByOptions.data;
    setCreatedByOptions(
      [
        {
          value: 'all',
          label: 'Todos',
        },
      ].concat(createdByOptionsData)
    );
  };

  const getInitialData = async () => {
    if (!initialized) {
      await Promise.all([setCreatedByOptionsList()]);
    }
    setPurchaseList();
  };

  useEffect(() => {
    getInitialData();
  }, [
    currentCompanyId,
    filter_competency_date,
    filter_due_or_payment_date,
    filter_status,
    filter_created_by_id,
  ]);

  const handleDeletePurchase = (id) => {
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Atenção',
        message:
          'Ao deletar esta compra, não será possível recuperar os seus dados e anexos. Esta ação é irreversível',
        showCancel: true,
        reverseButtons: false,
        cancelBtnBsStyle: 'secondary',
        confirmBtnBsStyle: 'danger',
        confirmBtnText: 'Confirmar',
        cancelBtnText: 'Cancelar',
        onConfirm: async () => {
          store.dispatch(applicationActions.hideDialog());
          await destroyPurchase({ id });
          await getInitialData();
        },
      })
    );
  };

  const columnDefs = [
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
      headerName: 'Data Vencimento',
      field: 'due_date',
      filter: true,
      width: 160,
      tooltipField: 'competency',
      cellRendererFramework: (params) =>
        formatDateToHumanString(params.data?.due_date),
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: true,
      width: 120,
      cellRendererFramework: (params) => (
        <>
          {params.data.status === 'waiting' && (
            <div className="badge badge-pill badge-light-warning">
              <FormattedMessage id="purchases.status.waiting" />
            </div>
          )}
          {params.data.status === 'approved' && (
            <div className="badge badge-pill badge-light-success">
              <FormattedMessage id="purchases.status.approved" />
            </div>
          )}
          {params.data.status === 'reproved' && (
            <div className="badge badge-pill badge-light-danger">
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
                onClick={() => goToEditPurchase(params)}
              />
            </div>
          </PermissionGate>
          {params.data.is_deletable && (
            <PermissionGate permissions="purchases.destroy">
              <div className="actions cursor-pointer text-danger">
                <Trash2
                  className="mr-75"
                  onClick={() => {
                    handleDeletePurchase(params.data.id);
                  }}
                />
              </div>
            </PermissionGate>
          )}
        </div>
      ),
    },
    {
      headerName: 'Competência',
      field: 'competency_date',
      filter: true,
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
  ];

  const goToEditPurchase = (params) => {
    history.push(`/admin/purchase/edit/${params.data.id}`);
  };

  const updateSummaryData = (gridApi) => {
    let selectedPurchases = [];
    const selectedRows = gridApi?.current.getSelectedRows();
    if (selectedRows?.length) {
      selectedPurchases = selectedRows;
    } else if (gridApi?.current) {
      selectedPurchases = (gridApi.current.rowModel?.rowsToDisplay || []).map(
        (row) => row.data
      );
    }

    const totalValue = selectedPurchases.reduce(
      (accumulator, { purchase_value }) => accumulator + purchase_value,
      0
    );
    const approvedPurchases = selectedPurchases.filter(
      ({ status }) => status === 'approved'
    );
    const approvedValue = approvedPurchases.reduce(
      (accumulator, { purchase_value }) => accumulator + purchase_value,
      0
    );
    const waitingPurchases = selectedPurchases.filter(
      ({ status }) => status === 'waiting'
    );
    const waitingValue = waitingPurchases.reduce(
      (accumulator, { purchase_value }) => accumulator + purchase_value,
      0
    );
    const reprovedOrCanceledPurchases = selectedPurchases.filter(
      ({ status }) => status === 'reproved' || status === 'canceled'
    );
    const reprovedOrCanceledValue = reprovedOrCanceledPurchases.reduce(
      (accumulator, { purchase_value }) => accumulator + purchase_value,
      0
    );

    setSummaryData({
      reprovedOrCanceled: {
        number: reprovedOrCanceledPurchases?.length,
        value: reprovedOrCanceledValue,
        text_number: reprovedOrCanceledPurchases?.length
          ? `(${reprovedOrCanceledPurchases?.length}) `
          : '(0) ',
        text_value: formatMoney(reprovedOrCanceledValue || 0),
      },
      waiting: {
        number: waitingPurchases?.length,
        value: waitingValue,
        text_number: waitingPurchases?.length
          ? `(${waitingPurchases?.length}) `
          : '(0) ',
        text_value: formatMoney(waitingValue || 0),
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
        number: selectedPurchases?.length,
        value: totalValue,
        text_number: selectedPurchases?.length
          ? `(${selectedPurchases?.length}) `
          : '(0) ',
        text_value: formatMoney(totalValue || 0),
      },
    });
  };

  const animatedComponents = makeAnimated();

  return (
    <>
      {!initialized && <Loading />}
      <Row className={!initialized ? 'd-none' : ''}>
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
                        value={filter_due_or_payment_date}
                        onChange={(date) => {
                          if (date?.length === 2) {
                            setFilterDueOrPaymentDate({
                              filter_due_or_payment_date: date,
                            });
                          }
                        }}
                      />
                      <InputGroupAddon addonType="append">
                        <Button
                          color="primary"
                          onClick={() => {
                            setFilterDueOrPaymentDate({
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
                        value={filter_competency_date}
                        onChange={(date) => {
                          if (date?.length === 2) {
                            setFilterCompetencyDate({
                              filter_competency_date: date,
                            });
                          }
                        }}
                      />
                      <InputGroupAddon addonType="append">
                        <Button
                          color="primary"
                          onClick={() => {
                            setFilterCompetencyDate({
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
                    <Label for="filter_status">Status</Label>
                    <Select
                      id="filter_status"
                      components={animatedComponents}
                      options={statusPurchase}
                      value={statusPurchase.filter(
                        (option) => option.value === filter_status
                      )}
                      onChange={(selected) => {
                        setFilterStatus({
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
                    <Label for="filter_created_by_id">Criado Por</Label>
                    <Select
                      id="filter_created_by_id"
                      value={createdByOptions.filter(
                        (option) => option.value === filter_created_by_id
                      )}
                      components={animatedComponents}
                      options={createdByOptions}
                      onChange={(val) => {
                        setFilterCreatedById({
                          filter_created_by_id: val.value,
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
          <PurchasesSummary summaryData={summaryData} />
          <Card>
            <CardBody>
              {purchases !== null ? (
                <>
                  <BasicListTable
                    sortModel={[
                      {
                        colId: 'competency_date',
                        sort: 'desc', // 'asc'
                      },
                    ]}
                    handleSummaryData={updateSummaryData}
                    rowData={purchases}
                    columnDefs={columnDefs}
                    defaultColDef={{
                      sortable: true,
                      resizable: true,
                    }}
                  />
                </>
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

PurchaseList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
  filter_competency_date: PropTypes.string.isRequired,
  filter_due_or_payment_date: PropTypes.string.isRequired,
  filter_status: PropTypes.string.isRequired,
  filter_created_by_id: PropTypes.string.isRequired,
  setFilterDueOrPaymentDate: PropTypes.func.isRequired,
  setFilterCompetencyDate: PropTypes.func.isRequired,
  setFilterStatus: PropTypes.func.isRequired,
  setFilterCreatedById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  companies: state.companies.companies,
  filter_competency_date: state.purchases.filter.filter_competency_date,
  filter_due_or_payment_date: state.purchases.filter.filter_due_or_payment_date,
  filter_status: state.purchases.filter.filter_status,
  filter_created_by_id: state.purchases.filter.filter_created_by_id,
});

const mapDispatchToProps = {
  setSortModel,
  setFilterDueOrPaymentDate,
  setFilterCompetencyDate,
  setFilterStatus,
  setFilterCreatedById,
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseList);
