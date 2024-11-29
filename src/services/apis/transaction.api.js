import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const transactionsEndpoints = {
  index: {
    url: 'companies/:company_id/transactions',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  selectTransactions: {
    url: 'companies/:company_id/select-transactions',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/transactions',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  import: {
    url: 'companies/:company_id/transactions/import',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'transactions/:transaction_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  updatePayed: {
    url: 'companies/:company_id/transactions/update-payed',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'transactions/:transaction_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'transactions/:transaction_id',
    method: 'DELETE',
  },

  destroyGroup: {
    url: 'companies/:company_id/transactions/delete-group',
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  },

  updateGroup: {
    url: 'companies/:company_id/transactions/update-group',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  unbindReconciledTransaction: {
    url: 'transactions/:transaction_id/unbind-reconciled',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchTransactionsList = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  const url = params
    ? transactionsEndpoints.index.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params
    : transactionsEndpoints.index.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      );

  return API(apiOptions)({
    url,
    method: transactionsEndpoints.index.method,
  });
};

export const fetchSelectTransactions = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  const url = params
    ? transactionsEndpoints.selectTransactions.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params
    : transactionsEndpoints.selectTransactions.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      );

  return API(apiOptions)({
    url,
    method: transactionsEndpoints.selectTransactions.method,
  });
};

export const showTransaction = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: transactionsEndpoints.show.url.replace(':transaction_id', id),
    method: transactionsEndpoints.show.method,
  });

export const createTransaction = async ({
  transaction,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: transactionsEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: transactionsEndpoints.create.method,
    data: { ...transaction },
  });
};

export const importTransactions = async ({
  transactions,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: transactionsEndpoints.import.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: transactionsEndpoints.import.method,
    data: { transactions },
  });
};

export const updateTransaction = async ({
  transaction,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: transactionsEndpoints.update.url.replace(
      ':transaction_id',
      transaction.id
    ),
    method: transactionsEndpoints.update.method,
    data: { ...transaction },
  });

export const updatePayed = async ({
  transactionsIds,
  apiOptions = {},
  payed,
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: transactionsEndpoints.updatePayed.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: transactionsEndpoints.updatePayed.method,
    data: { transactionsIds, payed },
  });
};

export const destroyTransaction = ({ id, destroyAll, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: transactionsEndpoints.destroy.url.replace(':transaction_id', id),
    method: transactionsEndpoints.destroy.method,
    data: { destroy_all: destroyAll },
  });

export const updateGroupTransaction = async ({
  data,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: transactionsEndpoints.updateGroup.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: transactionsEndpoints.updateGroup.method,
    data,
  });
};

export const destroyGroupTransaction = async ({
  transactionsIds,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: transactionsEndpoints.destroyGroup.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: transactionsEndpoints.destroyGroup.method,
    data: { transactionsIds },
  });
};

export const unbindReconciledTransaction = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: transactionsEndpoints.unbindReconciledTransaction.url.replace(
      ':transaction_id',
      id
    ),
    method: transactionsEndpoints.unbindReconciledTransaction.method,
  });
