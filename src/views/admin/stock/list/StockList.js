import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { PropTypes } from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  InputGroup,
  Label,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import { FormattedMessage } from 'react-intl';
import { Edit, Trash2, MoreVertical, ChevronDown } from 'react-feather';

import SweetAlert from 'react-bootstrap-sweetalert';

import { isEmpty } from 'lodash';

import { addArrayParams } from '../../../../utils/queryPramsUtils';
import InvoiceInfo from '../../sale/list/InvoiceInfo';
import ModalEditGroupSale from '../../sale/list/ModalEditGroupSale';
import ModalFilterSale from '../../sale/list/ModalFilterSale';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import NewBasicListTable from '../../../../components/tables/NewBasicListTable';
import StockSummary from '../../../../components/summaries/StockSummary';
import SaleStatusBadge from '../../../../components/badges/SaleStatusBadge';
import InvoiceAction from '../../sale/list/InvoiceAction';
import SaleSourceBadge from '../../../../components/badges/SaleSourceBadge';
import SalePaymentMethodBadge from '../../../../components/badges/SalePaymentMethodBadge';

import { showCompany } from '../../../../services/apis/company.api';
import {
  fetchSalesList,
  syncSales,
  destroySale,
  destroyGroupSale,
} from '../../../../services/apis/sale.api';
import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';
import { fetchCostCentersList } from '../../../../services/apis/cost_center.api';
import { fetchProjectsList } from '../../../../services/apis/project.api';
import { fetchProductsList } from '../../../../services/apis/product.api';
import { fetchCategoriesList } from '../../../../services/apis/category.api';
import {
  createGroupInvoice,
  createInvoice,
  updateInvoice,
  cancelInvoice,
  createReturnInvoice,
} from '../../../../services/apis/invoice.api';

import { history } from '../../../../history';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';
import { setFilters } from '../../../../new.redux/sales/sales.actions';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../utils/formaters';
import { exportSalesXLS } from '../../../../utils/sales/exporters';

import { exportersErrorSync } from '../../../../utils/sales/exportersErrorSync';

import PermissionGate from '../../../../PermissionGate';

const StockList = ({ companies, filter, setFilters }) => {
  const { currentCompanyId, currentCompany } = companies;
  const loggedUInUser = useSelector(
    (state) => state.auth.login.values.loggedInUser
  );

  const [reloadSales, setReloadSales] = useState(false);
  const [searchBy, setSearchBy] = useState('');
  const [company, setCompany] = useState({});
  const [bankAccounts, setBankAccounts] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({});

  const [initialized, setInitialized] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(50);

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncGateway, setSyncGateway] = useState('');
  const [showResultSyncModal, setShowResultSyncModal] = useState(false);
  const [syncResults, setSyncResults] = useState({});
  const [dateFilterSync, setDateFilterSync] = useState('');

  const [rowData, setRowData] = useState([]);
  const [summaryData, setSummaryData] = useState({});
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

      const filteredErrorSales = selectedSales.filter(
        ({ nfe_status }) => nfe_status === 9
      );
      errorSales = filteredErrorSales.length;
      errorValue = filteredErrorSales.reduce(
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

    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Emitir NFs',
        message:
          'Ao confirmar, as vendas selecionadas serão inseridas numa fila para emissão de Notas Fiscais, deseja continuar?',
        showCancel: true,
        reverseButtons: false,
        cancelBtnBsStyle: 'secondary',
        confirmBtnBsStyle: 'danger',
        confirmBtnText: 'Sim!',
        cancelBtnText: 'Cancelar',
        onConfirm: async () => {
          const sales_ids = sales.map((sale) => sale.id);
          store.dispatch(applicationActions.hideDialog());
          await createGroupInvoice({ sales_ids });
          await fetchData();
        },
      })
    );
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

  const submitHandleDestroyGroupSale = async () => {
    setshowModalHandleDestroyGroupSale(false);
    const getSuccessDeletedMessage = () => 'Vendas removidas com sucesso';
    const salesId = [];
    salesToEdit.map((sale) => {
      salesId.push(sale.id);
    });
    const respDestroyGroupSale = await destroyGroupSale({
      salesIds: salesId,
    });

    if (respDestroyGroupSale.status === 204) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: getSuccessDeletedMessage(),
          hasTimeout: true,
        })
      );
      fetchData();
    }
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
    setBankAccounts(
      dataBankAccounts.map((bankAccount) => ({
        ...bankAccount,
        label: bankAccount.name,
        value: bankAccount.id,
      }))
    );
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

  const handleFilterSubmit = () => {
    getSales();
  };

  const handleCreateInvoice = async (sale, invoiceType) => {
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Emitir NF',
        message: 'Ao confirmar, a nota fiscal será emitida. Deseja continuar?',
        showCancel: true,
        reverseButtons: false,
        cancelBtnBsStyle: 'secondary',
        confirmBtnBsStyle: 'danger',
        confirmBtnText: 'Sim!',
        cancelBtnText: 'Cancelar',
        onConfirm: async () => {
          store.dispatch(applicationActions.hideDialog());
          const response = await createInvoice({ sale, invoiceType });
          store.dispatch(
            applicationActions.toggleDialog({
              type: 'success',
              title: 'Sucesso',
              message: response.message,
              hasTimeout: true,
            })
          );
          setReloadSales(true);
        },
      })
    );
  };

  const handleUpdateInvoice = async (sale, invoice, invoiceType) => {
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Emitir NF',
        message:
          'Ao confirmar, será feita uma nova tentativa de emissão de NF. Deseja continuar?',
        showCancel: true,
        reverseButtons: false,
        cancelBtnBsStyle: 'secondary',
        confirmBtnBsStyle: 'danger',
        confirmBtnText: 'Sim!',
        cancelBtnText: 'Cancelar',
        onConfirm: async () => {
          store.dispatch(applicationActions.hideDialog());
          const response = await updateInvoice({
            sale,
            invoice,
            invoiceType,
          });
          store.dispatch(
            applicationActions.toggleDialog({
              type: 'success',
              title: 'Sucesso',
              message: response.message,
              hasTimeout: true,
            })
          );
          setReloadSales(true);
        },
      })
    );
  };

  const handleCancelInvoice = async (sale, lastInvoice) => {
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Cancelar NF',
        message:
          'Ao confirmar, a nota fiscal será cancelada. Deseja continuar?',
        showCancel: true,
        reverseButtons: false,
        cancelBtnBsStyle: 'secondary',
        confirmBtnBsStyle: 'danger',
        confirmBtnText: 'Sim!',
        cancelBtnText: 'Cancelar',
        onConfirm: async () => {
          store.dispatch(applicationActions.hideDialog());
          const response = await cancelInvoice({
            sale,
            invoice: lastInvoice,
          });
          store.dispatch(
            applicationActions.toggleDialog({
              type: 'success',
              title: 'Sucesso',
              message: response.message,
              hasTimeout: true,
            })
          );
          setReloadSales(true);
        },
      })
    );
  };

  const handleCreateReturnInvoice = async (sale, lastInvoice) => {
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Emitir NF de Devolução',
        message:
          'Ao confirmar, será emitida uma NF de Devolução referente a NF emitida. Deseja continuar?',
        showCancel: true,
        reverseButtons: false,
        cancelBtnBsStyle: 'secondary',
        confirmBtnBsStyle: 'danger',
        confirmBtnText: 'Sim!',
        cancelBtnText: 'Cancelar',
        onConfirm: async () => {
          store.dispatch(applicationActions.hideDialog());
          const response = await createReturnInvoice({
            sale,
            invoice: lastInvoice,
          });
          store.dispatch(
            applicationActions.toggleDialog({
              type: 'success',
              title: 'Sucesso',
              message: response.message,
              hasTimeout: true,
            })
          );
          setReloadSales(true);
        },
      })
    );
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
      headerName: 'ID Externo',
      field: 'transaction_external_id',
      width: 90,
    },
    {
      headerName: '',
      field: 'status',
      cellRendererFramework: (params) => (
        <>
          <SaleStatusBadge saleStatus={parseInt(params.data.status, 10)} />
          {` `}
          <SalePaymentMethodBadge
            salePaymentMethod={params.data.payment_method_id}
          />
          {` `}
          <SaleSourceBadge saleSource={params.data.source} />
        </>
      ),
      width: 120,
    },
    {
      headerName: 'Data',
      field: 'competency_date',
      cellRendererFramework: (params) =>
        params.data.competency_date
          ? formatDateToHumanString(params.data.competency_date)
          : '-',
      width: 110,
    },
    {
      headerName: 'Produto',
      field: 'product_names',
      cellRendererFramework: (params) => (
        <Link
          style={{ color: '#000' }}
          to={`/admin/product/edit/${params.data.products?.[0]?.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.data.products?.[0]?.name || '-'}
        </Link>
      ),
      width: 130,
    },
    {
      headerName: 'Valor',
      field: 'total_value',
      cellRendererFramework: (params) =>
        // formatMoney(params.data.total_value, true) || '-',
        formatMoney(
          params.data.products[0].price_view == 1
            ? params.data.final_value
            : params.data.total_value,
          true
        ) || '-',
      width: 120,
    },
    {
      headerName: 'E-mail cliente',
      field: 'client_email',
      cellRendererFramework: (params) => (
        <Link
          style={{ color: '#000' }}
          to={`/admin/client/edit/${params.data.client?.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.data.client?.email || '-'}{' '}
        </Link>
      ),
      width: 180,
    },
    {
      headerName: 'Cliente',
      field: 'client_name',
      cellRendererFramework: (params) => (
        <Link
          style={{ color: '#000' }}
          to={`/admin/client/edit/${params.data.client?.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          {params.data.client_name || '-'}{' '}
        </Link>
      ),
      width: 180,
    },
    {
      headerName: 'Ações',
      field: 'enotas',
      width: 100,
      cellRendererFramework: ({ data }) => (
        <div className="d-flex">
          <PermissionGate permissions="sales.show">
            <div className="actions cursor-pointer text-success">
              <Edit
                className="mr-75"
                onClick={() => history.push(`/admin/sale/edit/${data.id}`)}
              />
            </div>
          </PermissionGate>
          {data.sale_can_be_deleted &&
            data.source !== 'HOTMART' &&
            // data.source !== 'ASAAS' &&
            data.source !== 'GURUPAGARME' &&
            data.source !== 'GURU2PAGARME2' &&
            data.source !== 'GURUEDUZZ' &&
            data.source !== 'PROVI' &&
            data.source !== 'EDUZZ' &&
            data.source !== 'TICTO' &&
            data.source !== 'KIWIFY' &&
            data.source !== 'HUBLA' &&
            data.source !== 'DOMINIO' &&
            data.source !== 'TMB' && (
              <PermissionGate permissions="sales.destroy">
                <div className="actions cursor-pointer text-danger">
                  <Trash2
                    className="mr-75"
                    onClick={() => {
                      handleDeleteSale(data);
                    }}
                  />
                </div>
              </PermissionGate>
            )}
        </div>
      ),
    },
    Boolean(currentCompany?.integrations?.enotas_status) && {
      headerName: 'NF Serviço',
      field: 'enotas',
      width: 350,
      cellRendererFramework: ({ data }) => {
        const canCreateServiceInvoice = [2, 3].includes(
          data.products?.[0].product_type
        );
        return (
          <span className="d-flex">
            {data?.service_invoices.map((invoice) => (
              <InvoiceInfo key={invoice.id} invoice={invoice} />
            ))}
            {canCreateServiceInvoice && (
              <InvoiceAction
                sale={data}
                invoiceType="service"
                invoices={data.service_invoices}
                invoiceStatus={data.service_invoice_status}
                currentCompany={currentCompany}
                handleCreateInvoice={handleCreateInvoice}
                handleUpdateInvoice={handleUpdateInvoice}
                handleCancelInvoice={handleCancelInvoice}
                handleCreateReturnInvoice={handleCreateReturnInvoice}
              />
            )}
          </span>
        );
      },
    },
    Boolean(currentCompany?.integrations?.enotas_status) && {
      headerName: 'NF Produto',
      field: 'enotas',
      width: 350,
      cellRendererFramework: ({ data }) => {
        const canCreateProductInvoice = [1, 3].includes(
          data.products?.[0].product_type
        );
        return (
          <span className="d-flex">
            {data?.product_invoices.map((invoice) => (
              <InvoiceInfo key={invoice.id} invoice={invoice} />
            ))}
            {canCreateProductInvoice && (
              <InvoiceAction
                sale={data}
                invoiceType="product"
                invoices={data.product_invoices}
                invoiceStatus={data.product_invoice_status}
                currentCompany={currentCompany}
                handleCreateInvoice={handleCreateInvoice}
                handleUpdateInvoice={handleUpdateInvoice}
                handleCancelInvoice={handleCancelInvoice}
                handleCreateReturnInvoice={handleCreateReturnInvoice}
              />
            )}
          </span>
        );
      },
    },
  ];

  const fetchCompany = async () => {
    const { data } = await showCompany({ id: currentCompanyId });
    setCompany(data);
  };

  useEffect(() => {
    fetchCompany();
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

  const handleSync = async (gateway) => {
    const dtinicial = new Date(dateFilterSync[0]);
    const dtfinal = new Date(dateFilterSync[1]);

    const ddincial = String(dtinicial.getDate()).padStart(2, '0');
    const mminicial = String(dtinicial.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyyinicial = dtinicial.getFullYear();

    const dtinicialAjust =
      `${yyyyinicial}/${mminicial}/${ddincial} ` + `00: 00: 00`;

    const ddfinal = String(dtfinal.getDate()).padStart(2, '0');
    const mmfinal = String(dtfinal.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyyfinal = dtfinal.getFullYear();

    const dtfinalAjust = `${yyyyfinal}/${mmfinal}/${ddfinal} ` + `23: 59: 59`;

    const startDate = new Date(dtinicialAjust).getTime();
    const endDate = new Date(dtfinalAjust).getTime();

    const params = { startDate, endDate, companyId: currentCompanyId, gateway };

    const datasync = await syncSales({ params });

    const max_total_results = Math.max(
      datasync.history?.total_results ? datasync.history?.total_results : 0,
      datasync.pricedetails?.total_results
        ? datasync.pricedetails?.total_results
        : 0,
      datasync.commissions?.total_results
        ? datasync.commissions?.total_results
        : 0,
      datasync.users?.total_results ? datasync.users?.total_results : 0
    );

    setSyncResults({
      total_results: max_total_results,
      error_count: datasync.error?.count ? datasync.error?.count : 0,
      qtd_not_updated: datasync.history?.qtd_not_updated
        ? datasync.history?.qtd_not_updated
        : 0,
      transaction_error: datasync.error?.transaction_error,
    });
    setShowSyncModal(false);
    setShowResultSyncModal(true);
    getSales();
  };

  // método para exportar pro excel as transações não sincronizadas
  const handleExportErrorSyncXLS = (transaction_error) => {
    exportersErrorSync(transaction_error);
  };

  const isSyncHotmartActive =
    company?.integrations?.hotmart_status === 1 &&
    company?.integrations?.hotmart_client_id &&
    company?.integrations?.hotmart_client_secret &&
    company?.integrations?.hotmart_basic;

  const isSyncGuruPagarmeActive =
    company?.integrations?.guru_status === 1 &&
    company?.integrations?.guru_account_token &&
    company?.integrations?.guru_pagarme_status === 1;

  const isSyncGuru2Pagarme2Active =
    company?.integrations?.guru_status === 1 &&
    company?.integrations?.guru_account_token &&
    company?.integrations?.guru2_pagarme2_status === 1;

  // const isSyncGuruEduzzActive =
  //   company?.integrations?.guru_status === 1 &&
  //   company?.integrations?.guru_account_token //&&
  //   company?.integrations?.guru_eduzz_status === 1;

  const isSyncProviActive =
    company?.integrations?.provi_status === 1 &&
    company?.integrations?.provi_account_token;

  const isSyncEduzzActive =
    company?.integrations?.eduzz_status === 1 &&
    company?.integrations?.eduzz_public_key &&
    company?.integrations?.eduzz_api_key &&
    company?.integrations?.eduzz_email_key;

  return (
    <>
      <ModalEditGroupSale
        salesToEdit={salesToEdit}
        showModalEditGroupSale={showModalEditGroupSale}
        setShowModalEditGroupSale={setShowModalEditGroupSale}
        costCenters={costCenters}
        projects={projects}
        bankAccounts={bankAccounts}
        categories={categories}
        getSales={getSales}
      />
      <ModalFilterSale
        showModalFilterSale={showModalFilterSale}
        setShowModalFilterSale={setShowModalFilterSale}
        onFilterSubmit={handleFilterSubmit}
        products={products}
        bankAccounts={bankAccounts}
        categories={categories}
      />
      <Row className="app-user-list">
        <Modal
          isOpen={showSyncModal}
          toggle={() => setShowSyncModal(false)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setShowSyncModal(false)}>
            {syncGateway === 'HOTMART' && (
              <FormattedMessage id="sales.sync.hotmart" />
            )}
            {syncGateway === 'GURU_PAGARME' && (
              <FormattedMessage id="sales.sync.guru.pagarme" />
            )}
            {syncGateway === 'GURU2_PAGARME2' && (
              <FormattedMessage id="sales.sync.guru.pagarme2" />
            )}
            {/* {syncGateway === 'GURU_EDUZZ' && (
              <FormattedMessage id="sales.sync.guru.eduzz" />
            )} */}
            {syncGateway === 'PROVI' && (
              <FormattedMessage id="sales.sync.provi" />
            )}
            {syncGateway === 'EDUZZ' && (
              <FormattedMessage id="sales.sync.eduzz" />
            )}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="12" md="12" sm="12">
                <FormGroup>
                  <Label for="dateFilterSync">
                    Selecione a data de início e fim
                  </Label>
                  <InputGroup>
                    <Flatpickr
                      id="dateFilterSync"
                      className="form-control"
                      options={{
                        mode: 'range',
                        dateFormat: 'Y-m-d',
                        altFormat: 'd/m/Y',
                        altInput: true,
                      }}
                      value={dateFilterSync}
                      onChange={(date) => {
                        setDateFilterSync(date);
                      }}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => handleSync(syncGateway)}
              disabled={!dateFilterSync}
            >
              {syncGateway === 'HOTMART' && (
                <FormattedMessage id="sales.sync.hotmart" />
              )}
              {syncGateway === 'GURU_PAGARME' && (
                <FormattedMessage id="sales.sync.guru.pagarme" />
              )}
              {syncGateway === 'GURU2_PAGARME2' && (
                <FormattedMessage id="sales.sync.guru.pagarme2" />
              )}
              {/* {syncGateway === 'GURU_EDUZZ' && (
                <FormattedMessage id="sales.sync.guru.eduzz" />
              )} */}
              {syncGateway === 'PROVI' && (
                <FormattedMessage id="sales.sync.provi" />
              )}
              {syncGateway === 'EDUZZ' && (
                <FormattedMessage id="sales.sync.eduzz" />
              )}
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={showResultSyncModal}
          toggle={() => setShowResultSyncModal(false)}
          className="modal-dialog-centered"
          zIndex="99999"
        >
          <ModalHeader toggle={() => setShowResultSyncModal(false)}>
            <FormattedMessage id="sync.result.text" />
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="12" md="12" sm="12">
                <Label>
                  Total de transações analisadas: {syncResults.total_results}
                </Label>
                <Label>
                  Total de transações sincronizadas com sucesso:{' '}
                  {syncResults.total_results -
                    syncResults.error_count -
                    syncResults.qtd_not_updated}
                </Label>
                {syncResults.qtd_not_updated > 0 && (
                  <Label>
                    Total de transações já existentes:{' '}
                    {syncResults.qtd_not_updated}
                  </Label>
                )}
                <Label>
                  Total de transações em moedas estrangeiras NÃO Sincronizadas:{' '}
                  {syncResults.error_count}
                </Label>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            {syncResults.error_count > 0 && (
              <>
                <Button
                  color="primary"
                  onClick={() =>
                    handleExportErrorSyncXLS(syncResults.transaction_error)
                  }
                >
                  <FormattedMessage id="sync.export.erros" />
                </Button>{' '}
              </>
            )}
          </ModalFooter>
        </Modal>

        <PermissionGate permissions="companies.sales.index">
          <Col md="6" sm="12">
            <Breadcrumbs
              breadCrumbTitle={<FormattedMessage id="sales" />}
              breadCrumbActive={<FormattedMessage id="button.list.sale" />}
            />
          </Col>
          <Col className="d-flex justify-content-end flex-wrap" md="6" sm="12">
            <UncontrolledDropdown className="data-list-dropdown my-1">
              <DropdownToggle className="p-1" color="primary">
                <span className="align-middle mr-1">
                  <MoreVertical />
                </span>
                <ChevronDown size={15} />
              </DropdownToggle>
              <DropdownMenu tag="div" right>
                <PermissionGate permissions="api.companies.sales.import">
                  <DropdownItem
                    tag="a"
                    onClick={() => history.push('/admin/sale/import')}
                  >
                    <FormattedMessage id="sales.import" />
                  </DropdownItem>
                </PermissionGate>

                <PermissionGate permissions="emitir_segunda_via_vendas">
                  <DropdownItem
                    tag="a"
                    onClick={() =>
                      window.open('https://www.asaas.com/segunda-via')
                    }
                  >
                    <FormattedMessage id="sales.second" />
                  </DropdownItem>
                </PermissionGate>

                {isSyncHotmartActive && initialized && (
                  <PermissionGate permissions="api.companies.sales.sync.HOTMART">
                    <DropdownItem
                      tag="a"
                      onClick={() => {
                        setSyncGateway('HOTMART');
                        setShowSyncModal(true);
                      }}
                    >
                      <FormattedMessage id="sales.sync.hotmart" />
                    </DropdownItem>
                  </PermissionGate>
                )}
                {isSyncGuruPagarmeActive && initialized && (
                  <PermissionGate permissions="api.companies.sales.sync.GURUPAGARME">
                    <DropdownItem
                      tag="a"
                      onClick={() => {
                        setSyncGateway('GURU_PAGARME');
                        setShowSyncModal(true);
                      }}
                    >
                      <FormattedMessage id="sales.sync.guru.pagarme" />
                    </DropdownItem>
                  </PermissionGate>
                )}
                {isSyncGuru2Pagarme2Active && initialized && (
                  <PermissionGate permissions="api.companies.sales.sync.GURU2PAGARME2">
                    <DropdownItem
                      tag="a"
                      onClick={() => {
                        setSyncGateway('GURU2_PAGARME2');
                        setShowSyncModal(true);
                      }}
                    >
                      <FormattedMessage id="sales.sync.guru.pagarme2" />
                    </DropdownItem>
                  </PermissionGate>
                )}
                {/* {isSyncGuruEduzzActive && initialized && (
                  <PermissionGate permissions="api.companies.sales.sync.GURUEDUZZ">
                    <DropdownItem
                      tag="a"
                      onClick={() => {
                        setSyncGateway('GURU_EDUZZ');
                        setShowSyncModal(true);
                      }}
                    >
                      <FormattedMessage id="sales.sync.guru.eduzz" />
                    </DropdownItem>
                  </PermissionGate>
                )} */}
                {isSyncProviActive && initialized && (
                  <PermissionGate permissions="api.companies.sales.sync.PROVI">
                    <DropdownItem
                      tag="a"
                      onClick={() => {
                        setSyncGateway('PROVI');
                        setShowSyncModal(true);
                      }}
                    >
                      <FormattedMessage id="sales.sync.provi" />
                    </DropdownItem>
                  </PermissionGate>
                )}
                {isSyncEduzzActive && initialized && (
                  <PermissionGate permissions="api.companies.sales.sync.EDUZZ">
                    <DropdownItem
                      tag="a"
                      onClick={() => {
                        setSyncGateway('EDUZZ');
                        setShowSyncModal(true);
                      }}
                    >
                      <FormattedMessage id="sales.sync.eduzz" />
                    </DropdownItem>
                  </PermissionGate>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
            <PermissionGate permissions="companies.sales.store">
              <Button.Ripple
                onClick={() => history.push('/admin/sale/edit')}
                className="ml-1 my-1"
                color="primary"
              >
                <FormattedMessage id="button.create.sale" />
              </Button.Ripple>
            </PermissionGate>
          </Col>
          <Col sm="12">
            <StockSummary summaryData={summaryData} />
            <Card>
              <CardBody>
                <NewBasicListTable
                  sortModel={[
                    {
                      colId: 'competency_date',
                      sort: 'desc', // 'asc'
                    },
                  ]}
                  hasActions
                  hasFilters
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
                  searchBy={searchBy}
                  setSearchBy={setSearchBy}
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
                  dataType="SALE"
                />
              </CardBody>
            </Card>
          </Col>
        </PermissionGate>
      </Row>

      <div className={showModalHandleDestroyGroupSale ? 'global-dialog' : ''}>
        <SweetAlert
          showCancel
          reverseButtons={false}
          cancelBtnBsStyle="secondary"
          confirmBtnBsStyle="danger"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          warning
          title="Apagar em Lote!"
          show={showModalHandleDestroyGroupSale}
          onConfirm={submitHandleDestroyGroupSale}
          onClose={() => setshowModalHandleDestroyGroupSale(false)}
          onCancel={() => setshowModalHandleDestroyGroupSale(false)}
        >
          <h4 className="sweet-alert-text my-2">
            Confirma que deseja apagar as vendas selecionadas? Esta ação é
            irreversível.
          </h4>
        </SweetAlert>
      </div>
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
