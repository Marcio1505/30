import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const purchaseReceiptEndpoints = {
  destroy: {
    url: 'purchase-receipts/:purchase_receipt_id',
    method: 'DELETE',
  },

  putReceipt: {
    method: 'PUT',
    headers: {},
  },

  getSignedUrl: {
    url: 'companies/:company_id/purchase-receipts/get-signed-url',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const destroyPurchaseReceipt = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: purchaseReceiptEndpoints.destroy.url.replace(
      ':purchase_receipt_id',
      id
    ),
    method: purchaseReceiptEndpoints.destroy.method,
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
  return API(
    apiOptions,
    toggleLoading
  )({
    url: purchaseReceiptEndpoints.getSignedUrl.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: purchaseReceiptEndpoints.getSignedUrl.method,
    params: { file_type },
  });
};
