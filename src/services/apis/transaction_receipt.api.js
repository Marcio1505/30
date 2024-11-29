import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const transactionReceiptEndpoints = {
  destroy: {
    url: 'transaction-receipts/:transaction_receipt_id',
    method: 'DELETE',
  },

  putReceipt: {
    method: 'PUT',
    headers: {},
  },

  getSignedUrl: {
    url: 'companies/:company_id/transaction-receipts/get-signed-url',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const destroyTransactionReceipt = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: transactionReceiptEndpoints.destroy.url.replace(
      ':transaction_receipt_id',
      id
    ),
    method: transactionReceiptEndpoints.destroy.method,
  });

export const putReceipt = ({ signedUrl, file } = {}) =>
  fetch(signedUrl, {
    method: 'PUT',
    body: file,
  });

export const getSignedUrl = ({
  apiOptions = {},
  file_type,
  toggleLoading = false,
} = {}) => {
  const state = store.getState();
  return API(apiOptions)(
    {
      url: transactionReceiptEndpoints.getSignedUrl.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ),
      method: transactionReceiptEndpoints.getSignedUrl.method,
      params: { file_type },
    },
    toggleLoading
  );
};
