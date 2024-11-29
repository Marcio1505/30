import API from '../API.redux';

const permissionsRolesEndpoints = {
  index: {
    url: 'permissions-roles',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchPermissionsRoles = ({ apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: permissionsRolesEndpoints.index.url,
    method: permissionsRolesEndpoints.index.method,
  });
