import constants from './sales.constants';

const setFilterSaleCompetencyDate = ({ filterSaleCompetencyDate }) => ({
  type: constants.SET_FILTER_SALE_COMPETENCY_DATE,
  payload: { filterSaleCompetencyDate },
});

const setFilterSaleStatus = ({ filterSaleStatus }) => ({
  type: constants.SET_FILTER_SALE_STATUS,
  payload: { filterSaleStatus },
});

const setFilterSaleProduct = ({ filterSaleProduct }) => ({
  type: constants.SET_FILTER_SALE_PRODUCT,
  payload: { filterSaleProduct },
});

const setFilterSaleBankAccount = ({ filterSaleBankAccount }) => ({
  type: constants.SET_FILTER_SALE_BANK_ACCOUNT,
  payload: { filterSaleBankAccount },
});

const setFilterSaleCategory = ({ filterSaleCategory }) => ({
  type: constants.SET_FILTER_SALE_CATEGORY,
  payload: { filterSaleCategory },
});

const setFilterSaleSource = ({ filterSaleSource }) => ({
  type: constants.SET_FILTER_SALE_SOURCE,
  payload: { filterSaleSource },
});

const setFilterInvoiceDate = ({ filterInvoiceDate }) => ({
  type: constants.SET_FILTER_INVOICE_DATE,
  payload: { filterInvoiceDate },
});

const setFilterInvoiceStatus = ({ filterInvoiceStatus }) => ({
  type: constants.SET_FILTER_INVOICE_STATUS,
  payload: { filterInvoiceStatus },
});

const setFilters = ({ filters }) => ({
  type: constants.SET_FILTERS,
  payload: { filters },
});

const setSortModel = ({ sortModel }) => ({
  type: constants.SET_SORT_MODEL,
  payload: { sortModel },
});

const setPageSize = ({ pageSize }) => ({
  type: constants.SET_PAGE_SIZE,
  payload: { pageSize },
});

const setCurrentPage = ({ currentPage }) => ({
  type: constants.SET_CURRENT_PAGE,
  payload: { currentPage },
});

export {
  setFilterSaleCompetencyDate,
  setFilterSaleStatus,
  setFilterSaleProduct,
  setFilterSaleBankAccount,
  setFilterSaleCategory,
  setFilterSaleSource,
  setFilterInvoiceDate,
  setFilterInvoiceStatus,
  setFilters,
  setSortModel,
  setPageSize,
  setCurrentPage,
};
