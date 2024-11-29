import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const dashboardEndpoints = {
  index: {
    url: 'companies/:company_id/dashboards',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
  getCashFlow: {
    url: 'companies/:company_id/dashboards/get-cash-flow',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  getCashGeneration: {
    url: 'companies/:company_id/dashboards/get-cash-generation',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  getInvoicing: {
    url: 'companies/:company_id/dashboards/get-invoicing',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  getInputsAndOutputs: {
    url: 'companies/:company_id/dashboards/get-inputs-and-outputs',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  getCashFlowMonth: {
    url: 'companies/:company_id/dashboards/get-cash-flow-month',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  getEbitda: {
    url: 'companies/:company_id/dashboards/get-ebitda',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  getDayBalance: {
    url: 'companies/:company_id/dashboards/get-day-balance',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  getDashboard: {
    url: 'companies/:company_id/dashboards/get-dashboard',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const indexDashboards = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: dashboardEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: dashboardEndpoints.index.method,
  });
};

export const getCashFlow = ({ apiOptions = {}, toggleLoading = true } = {}) => {
  const state = store.getState();
  return API(
    apiOptions,
    toggleLoading
  )({
    url: dashboardEndpoints.getCashFlow.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: dashboardEndpoints.getCashFlow.method,
  });
};

export const getCashGeneration = async ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url:
      dashboardEndpoints.getCashGeneration.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params,
    method: dashboardEndpoints.getCashGeneration.method,
  });
};

export const getInvoicing = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url:
      dashboardEndpoints.getInvoicing.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params,
    method: dashboardEndpoints.getInvoicing.method,
  });
};

export const getInputsAndOutputs = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url:
      dashboardEndpoints.getInputsAndOutputs.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params,
    method: dashboardEndpoints.getInputsAndOutputs.method,
  });
};

export const getCashFlowMonth = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url:
      dashboardEndpoints.getCashFlowMonth.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params,
    method: dashboardEndpoints.getCashFlowMonth.method,
  });
};

export const getEbitda = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url:
      dashboardEndpoints.getEbitda.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params,
    method: dashboardEndpoints.getEbitda.method,
  });
};

export const getDayBalance = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url:
      dashboardEndpoints.getDayBalance.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params,
    method: dashboardEndpoints.getDayBalance.method,
  });
};

export const getDashboard = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url:
      dashboardEndpoints.getDashboard.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ) + params,
    method: dashboardEndpoints.getDashboard.method,
  });
};
