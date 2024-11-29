import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const userEndpoints = {
  index: {
    url: 'companies/:company_id/users',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/users/:user_id/permissions',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'companies/:company_id/users/:user_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  show_permissions: {
    url: 'companies/:company_id/users/:user_id/permissions',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'companies/:company_id/users/:user_id/permissions',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'companies/:company_id/users/:company_user_id/permissions',
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchCompanyUsersList = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: userEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: userEndpoints.index.method,
  });
};

export const createCompanyUserPermissions = async ({
  userId,
  dataCompanyUserPermissions,
  apiOptions = {},
} = {}) => {
  const state = store.getState();

  return API(apiOptions)({
    url: userEndpoints.create.url
      .replace(':company_id', state.companies.currentCompanyId)
      .replace(':user_id', userId),
    method: userEndpoints.create.method,
    data: { ...dataCompanyUserPermissions },
  });
};

export const showCompanyUser = ({ id, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: userEndpoints.show.url
      .replace(':company_id', state.companies.currentCompanyId)
      .replace(':user_id', id),
    method: userEndpoints.show.method,
  });
};

export const showPermissionsCompanyUser = ({
  user_id,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: userEndpoints.show_permissions.url
      .replace(':company_id', state.companies.currentCompanyId)
      .replace(':user_id', user_id),
    method: userEndpoints.show_permissions.method,
  });
};

export const updateCompanyUser = async ({
  dataCompanyUserPermissions,
  apiOptions = {},
} = {}) => {
  const state = store.getState();

  return API(apiOptions)({
    url: userEndpoints.update.url
      .replace(':company_id', state.companies.currentCompanyId)
      .replace(':user_id', dataCompanyUserPermissions.id),
    method: userEndpoints.update.method,
    data: { ...dataCompanyUserPermissions },
  });
};

export const destroyCompanyUser = ({ id, apiOptions = {} } = {}) => {
  const state = store.getState();

  return API(apiOptions)({
    url: userEndpoints.destroy.url
      .replace(':company_id', state.companies.currentCompanyId)
      .replace(':company_user_id', id),
    method: userEndpoints.destroy.method,
  });
};
