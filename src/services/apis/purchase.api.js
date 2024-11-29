import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const PurchasesEndpoints = {
  index: {
    url: 'companies/:company_id/purchases',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  getCreatedByOptions: {
    url: 'companies/:company_id/purchases/get-created-by-options',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/purchases',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'purchases/:purchase_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  approve: {
    url: 'purchases/:purchase_id/approve',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  reprove: {
    url: 'purchases/:purchase_id/reprove',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'purchases/:purchase_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'purchases/:purchase_id',
    method: 'DELETE',
  },
};

export const fetchPurchasesList = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  const url = params
    ? PurchasesEndpoints.index.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params
    : PurchasesEndpoints.index.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      );

  return API(apiOptions)({
    url,
    method: PurchasesEndpoints.index.method,
  });
};

export const fetchCreatedByOptions = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  const url = PurchasesEndpoints.getCreatedByOptions.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );

  return API(apiOptions)({
    url,
    method: PurchasesEndpoints.getCreatedByOptions.method,
  });
};

export const showPurchase = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: PurchasesEndpoints.show.url.replace(':purchase_id', id),
    method: PurchasesEndpoints.show.method,
  });

export const createPurchase = async ({ purchase, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: PurchasesEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: PurchasesEndpoints.create.method,
    data: { ...purchase },
  });
};

export const updatePurchase = async ({ purchase, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: PurchasesEndpoints.update.url.replace(':purchase_id', purchase.id),
    method: PurchasesEndpoints.update.method,
    data: { ...purchase },
  });

export const approvePurchase = async ({ purchase, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: PurchasesEndpoints.approve.url.replace(':purchase_id', purchase.id),
    method: PurchasesEndpoints.approve.method,
    data: { ...purchase },
  });

export const reprovePurchase = async ({
  purchaseId,
  observation,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: PurchasesEndpoints.reprove.url.replace(':purchase_id', purchaseId),
    method: PurchasesEndpoints.reprove.method,
    data: { observation },
  });

export const destroyPurchase = ({ id, destroyAll, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: PurchasesEndpoints.destroy.url.replace(':purchase_id', id),
    method: PurchasesEndpoints.destroy.method,
    data: { destroy_all: destroyAll },
  });
