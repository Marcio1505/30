import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const WireTransfersEndpoints = {
  index: {
    url: 'companies/:company_id/wire-transfers',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/wire-transfers',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  confirm: {
    url: 'wire-transfers/:wire_transfer_id/confirm',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'wire-transfers/:transfer_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchWireTransfersList = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  const url = params
    ? WireTransfersEndpoints.index.url + params
    : WireTransfersEndpoints.index.url;

  return API(apiOptions)({
    url: url.replace(':company_id', state.companies.currentCompanyId),
    method: WireTransfersEndpoints.index.method,
  });
};

export const showWireTransfer = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: WireTransfersEndpoints.show.url.replace(':transfer_id', id),
    method: WireTransfersEndpoints.show.method,
  });

export const createWireTransfer = async ({
  wireTransfer,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: WireTransfersEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: WireTransfersEndpoints.create.method,
    data: { ...wireTransfer },
  });
};

export const confirmWireTransfer = async ({
  wire_transfer_id,
  token,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: WireTransfersEndpoints.confirm.url.replace(
      ':wire_transfer_id',
      wire_transfer_id
    ),
    method: WireTransfersEndpoints.create.method,
    data: { token },
  });
