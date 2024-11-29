import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const costCentersEndpoints = {
  index: {
    url: 'companies/:company_id/cost-centers',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/cost-centers',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'cost-centers/:cost_center_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'cost-centers/:cost_center_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'cost-centers/:cost_center_id',
    method: 'DELETE',
  },
};

export const fetchCostCentersList = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: costCentersEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: costCentersEndpoints.index.method,
  });
};

export const showCostCenter = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: costCentersEndpoints.show.url.replace(':cost_center_id', id),
    method: costCentersEndpoints.show.method,
  });

export const createCostCenter = async ({
  costCenter,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: costCentersEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: costCentersEndpoints.create.method,
    data: { ...costCenter },
  });
};

export const updateCostCenter = async ({ costCenter, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: costCentersEndpoints.update.url.replace(
      ':cost_center_id',
      costCenter.id
    ),
    method: costCentersEndpoints.update.method,
    data: { ...costCenter },
  });

export const destroyCostCenter = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: costCentersEndpoints.destroy.url.replace(':cost_center_id', id),
    method: costCentersEndpoints.destroy.method,
  });
