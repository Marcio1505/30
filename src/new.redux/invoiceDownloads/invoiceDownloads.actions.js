import constants from './invoiceDownloads.constants';

const setFilterInvoiceDate = ({ filter_invoice_date }) => ({
  type: constants.SET_FILTER_INVOICE_DATE,
  payload: { filter_invoice_date },
});

const setFilterCompetencyDate = ({ filter_competency_date }) => ({
  type: constants.SET_FILTER_COMPETENCY_DATE,
  payload: { filter_competency_date },
});

const setFilterInvoiceStatus = ({ filter_invoice_status }) => ({
  type: constants.SET_FILTER_INVOICE_STATUS,
  payload: { filter_invoice_status },
});

const setFilterInvoiceOperation = ({ filter_invoice_operation }) => ({
  type: constants.SET_FILTER_INVOICE_OPERATION,
  payload: { filter_invoice_operation },
});

const setFilterInvoiceType = ({ filter_invoice_type }) => ({
  type: constants.SET_FILTER_INVOICE_TYPE,
  payload: { filter_invoice_type },
});

const setSortModel = ({ sortModel }) => ({
  type: constants.SET_SORT_MODEL,
  payload: { sortModel },
});

const setPageSize = ({ pageSize }) => ({
  type: constants.SET_PAGE_SIZE,
  payload: { pageSize },
});

export {
  setFilterInvoiceDate,
  setFilterCompetencyDate,
  setFilterInvoiceStatus,
  setFilterInvoiceOperation,
  setFilterInvoiceType,
  setSortModel,
  setPageSize,
};
