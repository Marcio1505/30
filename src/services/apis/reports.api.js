import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const reportsEndpoints = {
  index: {
    url: 'companies/:company_id/reports',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'reports/:company_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'reports/:company_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchReportsList = ({ apiOptions = {}, params = null } = {}) => {
  const state = store.getState();

  return API(apiOptions)({
    url: reportsEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: reportsEndpoints.index.method,
    params,
  });
};

export const updateReports = async ({ company, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: reportsEndpoints.update.url.replace(':company_id', company.id),
    method: reportsEndpoints.update.method,
    data: { ...company },
  });
