import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { PropTypes } from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { addArrayParams } from '../../../../utils/queryPramsUtils';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import NewBasicListTable from '../../../../components/tables/NewBasicListTable';
import StockSummary from '../../../../components/summaries/StockSummary';
import {
  fetchSalesList,
  destroySale,
} from '../../../../services/apis/sale.api';
import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';
import { fetchCostCentersList } from '../../../../services/apis/cost_center.api';
import { fetchProjectsList } from '../../../../services/apis/project.api';
import { fetchProductsList } from '../../../../services/apis/product.api';
import { fetchCategoriesList } from '../../../../services/apis/category.api';
import { createGroupInvoice } from '../../../../services/apis/invoice.api';
import { history } from '../../../../history';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';
import { setFilters } from '../../../../new.redux/sales/sales.actions';
import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import { formatMoney } from '../../../../utils/formaters';
import { exportSalesXLS } from '../../../../utils/sales/exporters';

import PermissionGate from '../../../../PermissionGate';

const StockList = ({ companies, filter, setFilters }) => {
  // Vou usar
  const [summaryData, setSummaryData] = useState({});
  const loggedUInUser = useSelector(
    (state) => state.auth.login.values.loggedInUser
  );

  const [reloadSales, setReloadSales] = useState(false);
  const [searchBy, setSearchBy] = useState('');

  const [costCenters, setCostCenters] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({});

  const [initialized, setInitialized] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(50);

  const [rowData, setRowData] = useState([]);

  const [showModalEditGroupSale, setShowModalEditGroupSale] = useState(false);
  const [salesToEdit, setSalesToEdit] = useState([]);
  const [showModalFilterSale, setShowModalFilterSale] = useState(false);

  const [showModalHandleDestroyGroupSale, setshowModalHandleDestroyGroupSale] =
    useState(false);

  const handleSummaryData = (gridApi) => {
    let totalSales = summary.total_invoices?.count;
    let totalValue = summary.total_invoices?.total_value;

    let issuedSales = summary.authorized_invoices?.count;
    let issuedValue = summary.authorized_invoices?.total_value;

    let pendingSales = summary.pending_invoices?.count;
    let pendingValue = summary.pending_invoices?.total_value;

    let errorSales = summary.failed_invoices?.count;
    let errorValue = summary.failed_invoices?.total_value;

    const selectedSales = gridApi?.current.getSelectedRows();
    if (selectedSales?.length) {
      totalSales = selectedSales.length;
      totalValue = selectedSales.reduce(
        (accumulator, { total_value }) => accumulator + parseFloat(total_value),
        0
      );

      const filteredIssuedSales = selectedSales.filter(
        ({ nfe_status }) => nfe_status === 2
      );
      issuedSales = filteredIssuedSales.length;
      issuedValue = filteredIssuedSales.reduce(
        (accumulator, { total_value }) => accumulator + parseFloat(total_value),
        0
      );

      const filteredPendingSales = selectedSales.filter(
        ({ nfe_status }) => nfe_status !== 2 && nfe_status !== 9
      );
      pendingSales = filteredPendingSales.length;
      pendingValue = filteredPendingSales.reduce(
        (accumulator, { total_value }) => accumulator + parseFloat(total_value),
        0
      );
    }

    setSummaryData({
      ...summaryData,
      error: {
        number: errorSales,
        value: errorValue,
        text_number: `(${errorSales})`,
        text_value: formatMoney(errorValue || 0),
      },
      pending: {
        number: pendingSales,
        value: pendingValue,
        text_number: `(${pendingSales})`,
        text_value: formatMoney(pendingValue || 0),
      },
      issued: {
        number: issuedSales,
        value: issuedValue,
        text_number: `(${issuedSales})`,
        text_value: formatMoney(issuedValue || 0),
      },
      total: {
        number: totalSales,
        value: totalValue,
        text_number: `(${totalSales})`,
        text_value: formatMoney(totalValue || 0),
      },
    });
  };

  const handleEditGroupSale = async (sales) => {
    if (isEmpty(sales)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Nenhuma venda selecionada',
          message: `Selecione pelo menos uma venda para editar em grupo`,
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }
    setShowModalEditGroupSale(true);
    setSalesToEdit(sales);
  };

  const handleExportSalesXLS = (sales) => {
    if (isEmpty(sales)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Nenhuma venda selecionada',
          message: `Selecione pelo menos uma venda para solicitar exportação XLSX`,
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    exportSalesXLS(sales);
  };

  const handleStoreGroupInvoice = async (sales) => {
    if (isEmpty(sales)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Nenhuma venda selecionada',
          message: `Selecione pelo menos uma venda para solicitar emissão de Notas Fiscais.`,
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }
    const error = [];
    let hasCanceledOrRefunded = false;
    sales.forEach((sale) => {
      if ([9, 10, 11, 12, 13].includes(sale.status)) {
        hasCanceledOrRefunded = true;
      }
      if (!sale.client_has_data_to_create_invoice) {
        error.push({
          id: sale.id,
          type: 'client_has_data_to_create_invoice',
        });
      }
      if (
        sale.service_invoices.length > 0 ||
        sale.product_invoices.length > 0
      ) {
        error.push({
          id: sale.id,
          type: 'sale_has_invoice',
        });
      } else if (sale.nfe_status) {
        error.push({
          id: sale.id,
          type: 'sale_nfe_status',
        });
      }
    });
    if (error.length > 0) {
      console.log({ error });
    }

    if (hasCanceledOrRefunded) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Atenção',
          message: `Na lista de Notas Fiscais selecionadas para emissão tem-se vendas com status Cancelado ou Reembolsado ou Chargeback.
          Você pretende prosseguir com a emissão?
          Se preferir você pode filtrar a lista de Vendas conforme o Status e prosseguir com a emissão de Notas Fiscais.`,
          confirmBtnText: 'Continuar Emissão',
          showCancel: true,
          reverseButtons: false,
          cancelBtnBsStyle: 'secondary',
          confirmBtnBsStyle: 'danger',
          cancelBtnText: 'Cancelar',
          onConfirm: async () => {
            const sales_ids = sales.map((sale) => sale.id);
            store.dispatch(applicationActions.hideDialog());
            await createGroupInvoice({ sales_ids });
            await fetchData();
          },
        })
      );
      return;
    }
  };

  const handleDeleteSale = (sale) => {
    const { id } = sale;

    const hasReconciled = sale.transactions.some(
      (transaction) =>
        transaction.reconciled == 1 || transaction.reconciled == 2
    );

    if (hasReconciled) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title:
            'Essa venda possui pelo menos uma transação de contas a pagar/receber que está conciliada',
          message:
            'Só é permitido excluir vendas que não possuam transações conciliadas',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Atenção',
        message:
          'Ao deletar esta venda, todas as contas a pagar e contas a receber associadas a ela serão também excluídas. Esta ação é irreversível',
        showCancel: true,
        reverseButtons: false,
        cancelBtnBsStyle: 'secondary',
        confirmBtnBsStyle: 'danger',
        confirmBtnText: 'Confirmar',
        cancelBtnText: 'Cancelar',
        onConfirm: async () => {
          store.dispatch(applicationActions.hideDialog());
          await destroySale({ id });
          await fetchData();
        },
      })
    );
  };

  const handleDestroyGroupSale = async (sales, user) => {
    if (isEmpty(sales)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Nenhuma venda selecionada',
          message: 'Selecione pelo menos uma venda para apagar em grupo',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    const hasReconciled = sales.some((sale) =>
      sale.transactions.some(
        (transaction) =>
          transaction.reconciled == 1 || transaction.reconciled == 2
      )
    );

    if (hasReconciled) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title:
            'Foi selecionado pelo menos uma venda que possui transação conciliada',
          message:
            'Selecione apenas vendas que não possuam transações conciliadas para apagar em grupo',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    const hasSync = sales.some(
      (sale) =>
        sale.source === 'HOTMART' ||
        sale.source === 'ASAAS' ||
        sale.source === 'GURUPAGARME' ||
        sale.source === 'GURU2PAGARME2' ||
        sale.source === 'GURUEDUZZ' ||
        sale.source === 'PROVI' ||
        sale.source === 'EDUZZ' ||
        sale.source === 'TICTO' ||
        sale.source === 'KIWIFY' ||
        sale.source === 'HUBLA' ||
        sale.source === 'DOMINIO' ||
        sale.source === 'TMB'
    );

    if (hasSync && !loggedUInUser.is_iuli_admin) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title:
            'Foi selecionado pelo menos uma venda que foi criada por sincronização automática',
          message:
            'Selecione apenas vendas que não foram criadas por sincronização automática',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    // verificar se tem nota fiscal e não deixar prosseguir

    setshowModalHandleDestroyGroupSale(true);
    setSalesToEdit(sales);
  };

  const getSales = debounce(async ({ searchBy: _searchBy } = {}) => {
    setRowData([]);
    setInitialized(false);

    const {
      filterSaleCompetencyDate,
      filterSaleStatuses,
      filterSaleProducts,
      filterSaleBankAccounts,
      filterSaleCategories,
      filterSaleSources,
      filterInvoiceDate,
      filterInvoiceStatus,
      filterSalesIds,
      filterExternalsIds,
      currentPage,
    } = filter;

    const page = currentPage ? currentPage + 1 : 1;

    let params = `page=${page}&per_page=${dataPerPage}`;

    if (filterSaleCompetencyDate?.[0] && filterSaleCompetencyDate[1]) {
      params += `&date_from=${filterSaleCompetencyDate[0]}&date_to=${filterSaleCompetencyDate[1]}`;
    }
    if (filterInvoiceDate?.[0] && filterInvoiceDate?.[1]) {
      params += `&invoice_date_from=${filterInvoiceDate[0]}&invoice_date_to=${filterInvoiceDate[1]}`;
    }
    if (filterInvoiceStatus && filterInvoiceStatus !== 'all') {
      params += `&nfe_status=${filterInvoiceStatus}`;
    }
    params = addArrayParams(params, [
      ['bank_accounts_ids', filterSaleBankAccounts, 'value'],
      ['categories_ids', filterSaleCategories, 'value'],
      ['statuses', filterSaleStatuses, 'value'],
      ['sources', filterSaleSources, 'value'],
      ['products_ids', filterSaleProducts, 'value'],
      ['sales_ids', filterSalesIds],
      ['externals_ids', filterExternalsIds],
    ]);
    if (_searchBy || searchBy) {
      params += `&search_by=${_searchBy || searchBy}`;
    }
    try {
      const { data, meta, summary } = await fetchSalesList({ params });
      setShowModalFilterSale(false);
      setSummary(summary);
      setRowData(data);
      setPageCount(meta.last_page);
      setDataCount(meta.total);
      setInitialized(true);
    } catch (error) {
      setShowModalFilterSale(true);
      setInitialized(true);
    }
  }, 1000);

  const getBankAccounts = async () => {
    const respBankAccountList = await fetchBankAccountsList();
    const dataBankAccounts = respBankAccountList.data || [];
  };

  const getProjects = async () => {
    const respProjects = await fetchProjectsList();
    const dataProjects = respProjects.data || [];
    setProjects(
      dataProjects.map((project) => ({
        ...project,
        label: project.name,
        value: project.id,
      }))
    );
  };

  const getProducts = async () => {
    const respProducts = await fetchProductsList();
    const dataProducts = respProducts.data || [];
    setProducts(
      dataProducts.map((product) => ({
        ...product,
        label: product.name,
        value: product.id,
      }))
    );
  };

  const getCostCenters = async () => {
    const respCostCenters = await fetchCostCentersList();
    const dataCostCenters = respCostCenters.data || [];
    setCostCenters(
      dataCostCenters.map((costCenter) => ({
        ...costCenter,
        label: costCenter.name,
        value: costCenter.id,
      }))
    );
  };

  const getCategoryOptions = async () => {
    const { data: dataCategories } = await fetchCategoriesList({
      params: '?type=1',
    });
    setCategories(
      dataCategories.map((category) => ({
        ...category,
        value: category.id,
        label: category.name,
      }))
    );
  };

  const fetchData = async () => {
    setInitialized(false);
    await Promise.all([
      getSales(),
      getBankAccounts(),
      getProducts(),
      getCostCenters(),
      getProjects(),
      getCategoryOptions(),
    ]);
    setInitialized(true);
  };

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      width: 80,
    },
    {
      headerName: 'Cód. Externo',
      field: 'external_code',
    },
    {
      headerName: 'Produto',
      field: 'product_name',
      width: 130,
    },
    {
      headerName: 'Unidade',
      field: 'unit',
      width: 150,
    },
    {
      headerName: 'Valor Unitário',
      field: 'unit_price',
      cellRendererFramework: (params) =>
        formatMoney(params.data.unit_price, true) || '-',
      width: 150,
    },
    {
      headerName: 'Média das 3',
      field: 'average_price',
      cellRendererFramework: (params) =>
        formatMoney(params.data.average_price, true) || '-',
      width: 120,
    },
    {
      headerName: 'CTP',
      field: 'ctp',
      width: 100,
    },
    {
      headerName: 'Total em Estoque',
      field: 'total_stock',
    },
    {
      headerName: 'Saldo em Estoque',
      field: 'stock_balance',
    },
    {
      headerName: 'Ações',
      field: 'actions',
      width: 100,
      cellRendererFramework: ({ data }) => <div className="d-flex"></div>,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSummaryData();
  }, [filter, summary]);

  useEffect(() => {
    if (reloadSales) {
      setReloadSales(false);
    }
  }, [reloadSales]);

  useEffect(() => {
    getSales();
  }, [filter]);

  return (
    <>
      <Row className="app-user-list">
        <PermissionGate permissions="companies.sales.index">
          <Col md="6" sm="12">
            <Breadcrumbs
              breadCrumbTitle={<FormattedMessage id="stock" />}
              breadCrumbActive={<FormattedMessage id="button.list.stock" />}
            />
          </Col>

          <Col sm="12">
            <StockSummary summaryData={summaryData} />
            <Card>
              <CardBody>
                <NewBasicListTable
                  customMenu={<Button>Exportar Excel</Button>}
                  sortModel={[
                    {
                      colId: 'competency_date',
                      sort: 'desc', // 'asc'
                    },
                  ]}
                  isActiveFilterByDate={
                    filter.filterSaleCompetencyDate.length === 2
                  }
                  isActiveFilterByStatus={filter.filterSaleStatuses.length > 1}
                  isActiveFilterByProduct={filter.filterSaleProducts.length > 1}
                  isActiveFilterByBankAccount={
                    filter.filterSaleBankAccounts.length > 1
                  }
                  isActiveFilterBySaleSource={
                    filter.filterSaleSources.length > 1
                  }
                  isActiveFilterByInvoiceDate={
                    filter.filterInvoiceDate.length === 2
                  }
                  isActiveFilterByInvoiceStatus={
                    filter.filterInvoiceStatus &&
                    filter.filterInvoiceStatus !== 'all'
                  }
                  filter={filter}
                  setFilters={setFilters}
                  handleSummaryData={handleSummaryData}
                  handleStoreGroupInvoice={handleStoreGroupInvoice}
                  handleEditGroup={handleEditGroupSale}
                  handleExportXLS={handleExportSalesXLS}
                  toggleShowModalFilter={() =>
                    setShowModalFilterSale(!showModalFilterSale)
                  }
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={{
                    sortable: true,
                    resizable: true,
                  }}
                  fetchData={getSales}
                  pageCount={pageCount}
                  dataCount={dataCount}
                  dataPerPage={dataPerPage}
                  setDataPerPage={setDataPerPage}
                  initialized={initialized}
                  handleDestroyGroup={handleDestroyGroupSale}
                  dataType="STOCK"
                />
              </CardBody>
            </Card>
          </Col>
        </PermissionGate>
      </Row>
    </>
  );
};

StockList.propTypes = {
  companies: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  companies: state.companies,
  filter: state.sales.filter,
});

const mapDispatchToProps = {
  setFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(StockList);
