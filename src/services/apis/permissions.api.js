import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const permissionsEndpoints = {
  index: {
    url: 'companies/:company_id/users/:user_id/get-all-permissions',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const apiPermissions = ({ apiOptions = {}, userId } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: permissionsEndpoints.index.url
      .replace(':company_id', state.companies.currentCompanyId)
      .replace(':user_id', userId),
    method: permissionsEndpoints.index.method,
  });
};
