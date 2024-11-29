import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const TransfersEndpoints = {
  index: {
    url: 'companies/:company_id/transfers',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/transfers',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'transfers/:transfer_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'transfers/:transfer_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'transfers/:transfer_id',
    method: 'DELETE',
  },

  destroyGroup: {
    url: 'companies/:company_id/transfers/delete-group',
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  },

  selectTransfers: {
    url: 'companies/:company_id/select-transfers',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  unbindReconciledTransfer: {
    url: 'transfers/:transfer_id/unbind-reconciled',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  import: {
    url: 'companies/:company_id/transfers/import',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

};

export const fetchTransfersList = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  let url = TransfersEndpoints.index.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );
  url = params ? url + params : url;

  return API(apiOptions)({
    url,
    method: TransfersEndpoints.index.method,
  });
};

export const showTransfer = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: TransfersEndpoints.show.url.replace(':transfer_id', id),
    method: TransfersEndpoints.show.method,
  });

export const createTransfer = async ({ transfer, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: TransfersEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: TransfersEndpoints.create.method,
    data: { ...transfer },
  });
};

export const updateTransfer = async ({ transfer, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: TransfersEndpoints.update.url.replace(':transfer_id', transfer.id),
    method: TransfersEndpoints.update.method,
    data: { ...transfer },
  });

export const destroyTransfer = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: TransfersEndpoints.destroy.url.replace(':transfer_id', id),
    method: TransfersEndpoints.destroy.method,
  });

export const fetchSelectTransfers = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  const url = params
    ? TransfersEndpoints.selectTransfers.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params
    : TransfersEndpoints.selectTransfers.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      );

  return API(apiOptions)({
    url,
    method: TransfersEndpoints.selectTransfers.method,
  });
};

export const unbindReconciledTransfer = ({
  id,
  params,
  apiOptions = {},
} = {}) => {
  const url = params
    ? TransfersEndpoints.unbindReconciledTransfer.url.replace(
        ':transfer_id',
        id
      ) + params
    : TransfersEndpoints.unbindReconciledTransfer.url.replace(
        ':transfer_id',
        id
      );

  return API(apiOptions)({
    url,
    method: TransfersEndpoints.unbindReconciledTransfer.method,
  });
};

export const importTransfers = async ({
  transfers,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: TransfersEndpoints.import.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: TransfersEndpoints.import.method,
    data: { transfers },
  });
};


export const destroyGroupTransfer = async ({
  transfersIds,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: TransfersEndpoints.destroyGroup.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: TransfersEndpoints.destroyGroup.method,
    data: { transfersIds },
  });
};

