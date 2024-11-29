import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const statementsEndpoints = {
  getDre: {
    url: 'companies/:company_id/statements/dre',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
  getDfc: {
    url: 'companies/:company_id/statements/dfc',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
  getDetailedStatement: {
    url: 'companies/:company_id/statements/detailed',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const getDre = ({ apiOptions = {}, params = null } = {}) => {
  const state = store.getState();
  let url = statementsEndpoints.getDre.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );
  if (params) {
    url += params;
  }

  return API(apiOptions)({
    url,
    method: statementsEndpoints.getDre.method,
  });
};

export const getDfc = ({ apiOptions = {}, params = null } = {}) => {
  const state = store.getState();
  let url = statementsEndpoints.getDfc.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );
  if (params) {
    url += params;
  }

  return API(apiOptions)({
    url,
    method: statementsEndpoints.getDfc.method,
  });
};

export const getDetailedStatement = ({
  apiOptions = {},
  params = null,
} = {}) => {
  const state = store.getState();
  let url = statementsEndpoints.getDetailedStatement.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );
  if (params) {
    url += params;
  }

  return API(apiOptions)({
    url,
    method: statementsEndpoints.getDetailedStatement.method,
  });
};
