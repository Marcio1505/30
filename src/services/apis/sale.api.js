import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const salesEndpoints = {
  index: {
    url: 'companies/:company_id/sales',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/sales',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  import: {
    url: 'companies/:company_id/sales/import',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'sales/:sale_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  updateGroup: {
    url: 'companies/:company_id/sales/update-group',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'sales/:sale_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'sales/:sale_id',
    method: 'DELETE',
  },

  destroyGroup: {
    url: 'companies/:company_id/sales/delete-group',
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  },

  refund: {
    url: 'sales/:sale_id/refund',
    method: 'PUT',
  },

  cancelSale: {
    url: 'sales/:sale_id/cancel-sale',
    method: 'PUT',
  },

  cancelSubscription: {
    url: 'sales/:sale_id/cancel-subscription',
    method: 'PUT',
  },

  sync: {
    url: 'companies/:company_id/sales/sync',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchSalesList = ({ apiOptions = {}, params = null } = {}) => {
  const state = store.getState();
  let url = salesEndpoints.index.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );
  if (params) {
    url += `?${params}`;
  }
  return API(
    apiOptions,
    false
  )({
    url,
    method: salesEndpoints.index.method,
  });
};

export const showSale = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: salesEndpoints.show.url.replace(':sale_id', id),
    method: salesEndpoints.show.method,
  });

export const createSale = async ({ sale, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: salesEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: salesEndpoints.create.method,
    data: { ...sale },
  });
};

export const importSales = async ({ sales, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: salesEndpoints.import.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: salesEndpoints.import.method,
    data: { sales },
  });
};

export const updateSale = async ({ sale, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: salesEndpoints.update.url.replace(':sale_id', sale.id),
    method: salesEndpoints.update.method,
    data: { ...sale },
  });

export const updateGroupSale = async ({
  sales_ids,
  sale,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: salesEndpoints.updateGroup.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: salesEndpoints.updateGroup.method,
    data: { sales_ids, sale },
  });
};

export const destroySale = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: salesEndpoints.destroy.url.replace(':sale_id', id),
    method: salesEndpoints.destroy.method,
  });

export const refundSale = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: salesEndpoints.refund.url.replace(':sale_id', id),
    method: salesEndpoints.refund.method,
  });

export const cancelSale = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: salesEndpoints.cancelSale.url.replace(':sale_id', id),
    method: salesEndpoints.cancelSale.method,
  });

export const cancelSubscription = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: salesEndpoints.cancelSubscription.url.replace(':sale_id', id),
    method: salesEndpoints.cancelSubscription.method,
  });

export const syncSales = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: salesEndpoints.sync.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: salesEndpoints.sync.method,
    data: { ...params },
  });
};

export const destroyGroupSale = async ({ salesIds, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: salesEndpoints.destroyGroup.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: salesEndpoints.destroyGroup.method,
    data: { salesIds },
  });
};
