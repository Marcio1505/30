import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const permissionsCompaniesUsersEndpoints = {
  index_all_permissions: {
    url: 'permissions',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  index: {
    url: 'companies/:company_id/users',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/permissions-users',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'permissions-users/:permission_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'permissions-users/:permission_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'permissions-users/:permission_id',
    method: 'DELETE',
  },
};

export const fetchAllPermissionsList = ({ apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: permissionsCompaniesUsersEndpoints.index_all_permissions.url,
    method: permissionsCompaniesUsersEndpoints.index_all_permissions.method,
  });

// fetchCompanyUserPermissionsList
export const fetchPermissionUsersList = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: permissionsCompaniesUsersEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: permissionsCompaniesUsersEndpoints.index.method,
  });
};

export const showPermissionUser = ({ permission_id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: permissionsCompaniesUsersEndpoints.show.url.replace(
      ':permission_id',
      permission_id
    ),
    method: permissionsCompaniesUsersEndpoints.show.method,
  });

export const createPermissionUser = async ({
  permissionUser,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: permissionsCompaniesUsersEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: permissionsCompaniesUsersEndpoints.create.method,
    data: { ...permissionUser },
  });
};

export const updatePermissionUser = async ({
  permissionUser,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: permissionsCompaniesUsersEndpoints.update.url.replace(
      ':cost_center_id',
      permissionUser.id
    ),
    method: permissionsCompaniesUsersEndpoints.update.method,
    data: { ...permissionUser },
  });

export const destroyPermissionUser = ({
  permission_id,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: permissionsCompaniesUsersEndpoints.destroy.url.replace(
      ':permission_id',
      permission_id
    ),
    method: permissionsCompaniesUsersEndpoints.destroy.method,
  });
