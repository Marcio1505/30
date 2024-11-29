import API from '../API.redux';

const usersEndpoints = {
  search: {
    url: 'users/search',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const searchUserByCpf = ({ cpf, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: `${usersEndpoints.search.url}?cpf=${cpf}`,
    method: usersEndpoints.search.method,
  });
