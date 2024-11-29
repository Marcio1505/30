import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Label,
} from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { FormattedMessage } from 'react-intl';

import Loading from '../../../../components/loading/Loading';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import CustomDatePicker from '../../../../components/datepicker/CustomDatePicker';

import BasicListTable from '../../../../components/tables/BasicListTable';
import InvoicesSummary from '../../../../components/summaries/InvoicesSummary';
import InvoiceDownloadStatusBadge from '../../../../components/badges/InvoiceDownloadStatusBadge';
import InvoiceStatusBadge from '../../../../components/badges/InvoiceStatusBadge';
import FileTypeBadge from '../../../../components/badges/FileTypeBadge';
import InvoiceTypeBadge from '../../../../components/badges/InvoiceTypeBadge';
import InvoiceOperationBadge from '../../../../components/badges/InvoiceOperationBadge';

import {
  getSummary,
  listInvoiceDownload,
  createInvoiceDownload,
  downloadZip,
} from '../../../../services/apis/invoice_download.api';

import { fetchInvoicesList } from '../../../../services/apis/invoice.api';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';
import {
  setFilterCompetencyDate,
  setFilterInvoiceDate,
  setFilterInvoiceStatus,
  setFilterInvoiceType,
  setFilterInvoiceOperation,
} from '../../../../new.redux/invoiceDownloads/invoiceDownloads.actions';

import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../utils/formaters';

import { exportInvoiceXLS } from '../../../../utils/invoices/exporters';

import PermissionGate from '../../../../PermissionGate';

const InvoiceDownload = ({
  currentCompanyId,
  filterCompetencyDate,
  setFilterCompetencyDate,
  filterInvoiceDate,
  setFilterInvoiceDate,
  filterInvoiceStatus,
  setFilterInvoiceStatus,
  filterInvoiceOperation,
  setFilterInvoiceOperation,
  filterInvoiceType,
  setFilterInvoiceType,
}) => {
  const [initialized, setInitialized] = useState(false);
  const [invoiceDownloads, setInvoiceDownloads] = useState([]);
  const [summaryData, setSummaryData] = useState({});

  const animatedComponents = makeAnimated();

  const fetchInvoiceDownloads = async () => {
    const { data: dataInvoiceDownload } = await listInvoiceDownload();
    setInvoiceDownloads(dataInvoiceDownload);
    setInitialized(true);
  };

  const invoiceStatusOptions = [
    { value: '', label: 'Todos' },
    { value: 'PROCESSING', label: 'Processando' },
    { value: 'WAITING_PDF', label: 'Autorizada - Aguardando PDF' },
    { value: 'AUTHORIZED', label: 'Autorizada' },
    { value: 'DENIED', label: 'Negada' },
    { value: 'CANCELED', label: 'Cancelada' },
    { value: 'CANCELETION_DENIED', label: 'Cancelamento Negado' },
    { value: 'RETURNED', label: 'Devolvida' },
  ];

  const invoiceOperationOptions = [
    { value: '', label: 'Todos' },
    { value: 'SALE', label: 'Venda' },
    { value: 'RETURN', label: 'Devolução' },
  ];

  const invoiceTypeOptions = [
    { value: '', label: 'Todos' },
    { value: 'PRODUCT', label: 'Produto' },
    { value: 'SERVICE', label: 'Serviço' },
  ];

  const handleCreateInvoiceDownload = async (fileType) => {
    const { data } = await createInvoiceDownload({
      invoiceDownload: {
        file_type: fileType,
        invoice_type: filterInvoiceType,
        invoice_status: filterInvoiceStatus,
        invoice_operation: filterInvoiceOperation,
        date_start: filterInvoiceDate[0],
        date_end: filterInvoiceDate[1],
      },
    });
    if (data) {
      fetchInvoiceDownloads();
    }
  };

  const handleDownloadInvoiceExcel = async () => {
    let params = '';
    if (filterInvoiceDate[0]) {
      params += `&date_start=${filterInvoiceDate[0]}`;
    }
    if (filterInvoiceDate[1]) {
      params += `&date_end=${filterInvoiceDate[1]}`;
    }
    if (filterInvoiceType && filterInvoiceType !== 'all') {
      params += `&invoice_type=${filterInvoiceType}`;
    }
    if (filterInvoiceStatus && filterInvoiceStatus !== 'all') {
      params += `&invoice_status=${filterInvoiceStatus}`;
    }
    if (filterInvoiceOperation && filterInvoiceOperation !== 'all') {
      params += `&invoice_operation=${filterInvoiceOperation}`;
    }
    const { data } = await fetchInvoicesList({ params });
    if (data) {
      exportInvoiceXLS(data);
    }
  };

  const handleSummaryData = async () => {
    const params = `invoice_type=${filterInvoiceType || ''}&invoice_status=${
      filterInvoiceStatus || ''
    }&date_start=${filterInvoiceDate[0] || ''}&date_end=${
      filterInvoiceDate[1] || ''
    }&invoice_operation=${filterInvoiceOperation || ''}`;

    const { data: dataSummary } = await getSummary({ params });

    setSummaryData({
      ...summaryData,
      authorized: {
        number: dataSummary.invoice_authorized.total,
        value: dataSummary.invoice_authorized.total_value,
        text_number: dataSummary.invoice_authorized.total
          ? `(${dataSummary.invoice_authorized.total}) `
          : '(0) ',
        text_value: formatMoney(
          dataSummary.invoice_authorized.total_value || 0
        ),
      },
      processing: {
        number: dataSummary.invoice_processing.total,
        value: dataSummary.invoice_processing.total_value,
        text_number: dataSummary.invoice_processing.total
          ? `(${dataSummary.invoice_processing.total}) `
          : '(0) ',
        text_value: formatMoney(
          dataSummary.invoice_processing.total_value || 0
        ),
      },
      canceled: {
        number: dataSummary.invoice_canceled.total,
        value: dataSummary.invoice_canceled.total_value,
        text_number: dataSummary.invoice_canceled.total
          ? `(${dataSummary.invoice_canceled.total}) `
          : '(0) ',
        text_value: formatMoney(dataSummary.invoice_canceled.total_value || 0),
      },
      denied: {
        number: dataSummary.invoice_denied.total,
        value: dataSummary.invoice_denied.total_value,
        text_number: dataSummary.invoice_denied.total
          ? `(${dataSummary.invoice_denied.total}) `
          : '(0) ',
        text_value: formatMoney(dataSummary.invoice_denied.total_value || 0),
      },
    });
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
      headerName: 'Data Emissão NF',
      field: 'date_start',
      cellRendererFramework: (params) =>
        params.data.date_start && params.data.date_end
          ? `${formatDateToHumanString(
              params.data.date_start
            )} - ${formatDateToHumanString(params.data.date_end)}`
          : '-',
      width: 200,
    },
    {
      headerName: 'Operação NF',
      field: 'invoice_operation',
      cellRendererFramework: (params) => (
        <InvoiceOperationBadge
          invoiceOperationText={params.data.invoice_operation_text}
        />
      ),
      width: 120,
    },
    {
      headerName: 'Tipo NF',
      field: 'invoice_type',
      cellRendererFramework: (params) => (
        <InvoiceTypeBadge invoiceTypeText={params.data.invoice_type_text} />
      ),
      width: 100,
    },
    {
      headerName: 'Status NF',
      field: 'invoice_status',
      cellRendererFramework: (params) => (
        <InvoiceStatusBadge
          invoiceStatusText={params.data.invoice_status_text}
        />
      ),
      width: 200,
    },
    {
      headerName: 'Arquivo',
      field: 'file_type',
      cellRendererFramework: ({ data }) => (
        <FileTypeBadge fileType={data.file_type} />
      ),
      width: 100,
    },
    {
      headerName: 'Total',
      field: 'total_invoice',
      cellRendererFramework: (params) => params.data.total_invoice,
      width: 90,
    },
    {
      headerName: 'Ações',
      field: 'enotas',
      width: 100,
      cellRendererFramework: ({ data }) => (
        <InvoiceDownloadStatusBadge
          status={data.status}
          fileUrl={data.file_url}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchInvoiceDownloads();
  }, [currentCompanyId]);

  useEffect(() => {
    handleSummaryData();
  }, [
    currentCompanyId,
    filterCompetencyDate,
    filterInvoiceDate,
    filterInvoiceStatus,
    filterInvoiceType,
    filterInvoiceOperation,
  ]);

  return (
    <>
      <PermissionGate permissions="invoice-downloads.index">
        {!initialized && <Loading />}
        <Row className={initialized ? 'app-user-list' : 'd-none'}>
          <Col sm="12">
            <Breadcrumbs
              breadCrumbTitle={<FormattedMessage id="invoices" />}
              breadCrumbActive={<FormattedMessage id="invoices.download" />}
            />
          </Col>
          <Col sm="12">
            <Card className="d-block pb-2 mb-2">
              <CardHeader className="d-block">
                <Row>
                  <Col lg="5" md="6" sm="12" className="mt-2 mt-md-0">
                    <CustomDatePicker
                      label="Data Emissão NF"
                      handleChangeFilterDate={(dates) =>
                        setFilterInvoiceDate({
                          filter_invoice_date: dates,
                        })
                      }
                      filterDate={filterInvoiceDate}
                    />
                  </Col>
                  <Col lg="2" md="6" sm="12" className="mt-2 mt-md-0">
                    <Label>Operação NF</Label>
                    <Select
                      components={animatedComponents}
                      options={invoiceOperationOptions}
                      value={invoiceOperationOptions.filter(
                        (option) => option.value === filterInvoiceOperation
                      )}
                      onChange={(selected) => {
                        setFilterInvoiceOperation({
                          filter_invoice_operation: selected.value,
                        });
                      }}
                      className="React"
                      classNamePrefix="select"
                    />
                  </Col>
                  <Col lg="2" md="6" sm="12" className="mt-2 mt-md-0">
                    <Label>Tipo NF</Label>
                    <Select
                      components={animatedComponents}
                      options={invoiceTypeOptions}
                      value={invoiceTypeOptions.filter(
                        (option) => option.value === filterInvoiceType
                      )}
                      onChange={(selected) => {
                        setFilterInvoiceType({
                          filter_invoice_type: selected.value,
                        });
                      }}
                      className="React"
                      classNamePrefix="select"
                    />
                  </Col>
                  <Col lg="3" md="6" sm="12" className="mt-2 mt-md-0">
                    <Label>Status NF</Label>
                    <Select
                      components={animatedComponents}
                      options={invoiceStatusOptions}
                      value={invoiceStatusOptions.filter(
                        (option) => option.value === filterInvoiceStatus
                      )}
                      onChange={(selected) => {
                        setFilterInvoiceStatus({
                          filter_invoice_status: selected.value,
                        });
                      }}
                      className="React"
                      classNamePrefix="select"
                    />
                  </Col>
                </Row>
              </CardHeader>
            </Card>
          </Col>
          <Col sm="12">
            <InvoicesSummary summaryData={summaryData} />
          </Col>
          <Col className="d-flex justify-content-end flex-wrap" md="12" sm="12">
            <PermissionGate permissions="invoice-downloads.store">
              <Button.Ripple
                onClick={() => handleDownloadInvoiceExcel()}
                className="ml-1 my-1"
                color="info"
              >
                <FormattedMessage id="button.invoice.downloadExcel" />
              </Button.Ripple>
              <Button.Ripple
                onClick={() => handleCreateInvoiceDownload('XML')}
                className="ml-1 my-1"
                color="primary"
              >
                <FormattedMessage id="button.dowloadXml.invoice" />
              </Button.Ripple>
              <Button.Ripple
                onClick={() => handleCreateInvoiceDownload('PDF')}
                className="ml-1 my-1"
                color="primary"
              >
                <FormattedMessage id="button.dowloadPdf.invoice" />
              </Button.Ripple>
            </PermissionGate>
          </Col>
          <Col sm="12">
            <Card>
              <CardBody>
                {invoiceDownloads.length ? (
                  <>
                    <BasicListTable
                      sortModel={[
                        {
                          colId: 'competency_date',
                          sort: 'desc', // 'asc'
                        },
                      ]}
                      rowData={invoiceDownloads}
                      columnDefs={columnDefs}
                      defaultColDef={{
                        sortable: true,
                        resizable: true,
                      }}
                      fetchData={fetchInvoiceDownloads}
                    />
                  </>
                ) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </PermissionGate>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  filterCompetencyDate: state.invoiceDownloads.filter.filter_competency_date,
  filterInvoiceDate: state.invoiceDownloads.filter.filter_invoice_date,
  filterInvoiceStatus: state.invoiceDownloads.filter.filter_invoice_status,
  filterInvoiceOperation:
    state.invoiceDownloads.filter.filter_invoice_operation,
  filterInvoiceType: state.invoiceDownloads.filter.filter_invoice_type,
});

const mapDispatchToProps = {
  setFilterCompetencyDate,
  setFilterInvoiceDate,
  setFilterInvoiceStatus,
  setFilterInvoiceOperation,
  setFilterInvoiceType,
};

InvoiceDownload.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
  filterCompetencyDate: PropTypes.array.isRequired,
  setFilterCompetencyDate: PropTypes.func.isRequired,
  filterInvoiceDate: PropTypes.array.isRequired,
  setFilterInvoiceDate: PropTypes.func.isRequired,
  filterInvoiceStatus: PropTypes.string.isRequired,
  setFilterInvoiceStatus: PropTypes.func.isRequired,
  filterInvoiceOperation: PropTypes.string.isRequired,
  setFilterInvoiceOperation: PropTypes.func.isRequired,
  filterInvoiceType: PropTypes.string.isRequired,
  setFilterInvoiceType: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceDownload);
