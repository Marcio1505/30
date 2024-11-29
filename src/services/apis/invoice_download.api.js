import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const invoicesEndpoints = {
  list: {
    url: 'companies/:company_id/invoice-downloads',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  getSummary: {
    url: 'companies/:company_id/invoice-downloads/summary',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/invoice-downloads',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  downloadZip: {
    url: 'invoice-downloads/:invoice_download_id/download-zip',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const listInvoiceDownload = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: invoicesEndpoints.list.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: invoicesEndpoints.list.method,
  });
};

export const getSummary = async ({ params = null, apiOptions = {} } = {}) => {
  const state = store.getState();
  let url = invoicesEndpoints.getSummary.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );
  if (params) {
    url += `?${params}`;
  }
  return API(apiOptions)({
    url,
    method: invoicesEndpoints.getSummary.method,
  });
};

export const createInvoiceDownload = async ({
  invoiceDownload,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: invoicesEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: invoicesEndpoints.create.method,
    data: { ...invoiceDownload },
  });
};

export const downloadZip = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: invoicesEndpoints.downloadZip.url.replace(':invoice_download_id', id),
    method: invoicesEndpoints.downloadZip.method,
    responseType: 'blob', // important
  });
