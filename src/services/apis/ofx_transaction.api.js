import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const ofxTransactionsEndpoints = {
  indexOfx: {
    url: 'bank-accounts/:bank_account_id/ofx-transactions',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  showOfxTransaction: {
    url: 'ofx-transactions/:ofx_transaction_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  restoreIgnored: {
    url: 'ofx-transactions/restore-ignoreds',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  ofxIgnored: {
    url: 'ofx-transactions/:ofx_transaction_id/ignored',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  ofxUnbindReconciled: {
    url: 'ofx-transactions/:ofx_transaction_id/unbind-reconciled',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  ofxTransactionsSuggestions: {
    url: 'bank-accounts/:bank_account_id/ofx-transactions-suggestions',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  reconciledTransactionsTransfers: {
    url: 'ofx-transactions/:ofx_transaction_id/reconciled-transactions',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  ofxTypeUpdate: {
    url: 'ofx-transactions/:ofx_transaction_id/type-update',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  selectOfxTransactions: {
    url: 'bank-accounts/:bank_account_id/select-ofx-transactions',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const showOfxTransaction = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: ofxTransactionsEndpoints.showOfxTransaction.url.replace(
      ':ofx_transaction_id',
      id
    ),
    method: ofxTransactionsEndpoints.showOfxTransaction.method,
  });

export const fetchOfxList = ({ id, apiOptions = {}, params } = {}) => {
  let url = ofxTransactionsEndpoints.indexOfx.url.replace(
    ':bank_account_id',
    id
  );
  if (params) {
    url += params;
  }
  return API(apiOptions)({
    url,
    method: ofxTransactionsEndpoints.indexOfx.method,
  });
};

export const restoreOfxIgnored = async ({ apiOptions = {}, params } = {}) => {
  let { url } = ofxTransactionsEndpoints.restoreIgnored;
  if (params) {
    url += params;
  }
  return API(apiOptions)({
    url,
    method: ofxTransactionsEndpoints.restoreIgnored.method,
  });
};

export const ofxIgnored = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: ofxTransactionsEndpoints.ofxIgnored.url.replace(
      ':ofx_transaction_id',
      id
    ),
    method: ofxTransactionsEndpoints.ofxIgnored.method,
  });

  export const ofxUnbindReconciled = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: ofxTransactionsEndpoints.ofxUnbindReconciled.url.replace(
      ':ofx_transaction_id',
      id
    ),
    method: ofxTransactionsEndpoints.ofxUnbindReconciled.method,
  });

export const fetchOfxreconciliationList = ({
  id,
  apiOptions = {},
  params,
} = {}) => {
  let url = ofxTransactionsEndpoints.ofxTransactionsSuggestions.url.replace(
    ':bank_account_id',
    id
  );
  if (params) {
    url += params;
  }
  return API(apiOptions)({
    url,
    method: ofxTransactionsEndpoints.ofxTransactionsSuggestions.method,
  });
};

export const reconciledTransactionsTransfers = async ({
  id,
  apiOptions = {},
  params,
} = {}) => {
  let url =
    ofxTransactionsEndpoints.reconciledTransactionsTransfers.url.replace(
      ':ofx_transaction_id',
      id
    );
  if (params) {
    url += params;
  }
  return API(apiOptions)({
    url,
    method: ofxTransactionsEndpoints.reconciledTransactionsTransfers.method,
  });
};

export const ofxTypeUpdate = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: ofxTransactionsEndpoints.ofxTypeUpdate.url.replace(
      ':ofx_transaction_id',
      id
    ),
    method: ofxTransactionsEndpoints.ofxTypeUpdate.method,
  });

export const fetchSelectOfxTransactions = ({
  bank_account_id,
  params,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  const url = params
    ? ofxTransactionsEndpoints.selectOfxTransactions.url.replace(
        ':bank_account_id',
        bank_account_id
      ) + params
    : ofxTransactionsEndpoints.selectOfxTransactions.url.replace(
        ':bank_account_id',
        bank_account_id
      );

  return API(apiOptions)({
    url,
    method: ofxTransactionsEndpoints.selectOfxTransactions.method,
  });
};
