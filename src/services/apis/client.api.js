import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const ClientsEndpoints = {
  index: {
    url: 'companies/:company_id/clients',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  dashClients: {
    url: 'companies/:company_id/dash-clients',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  selectClients: {
    url: 'companies/:company_id/select-clients',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/clients',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'clients/:client_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'clients/:client_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  dashClient: {
    url: 'clients/:client_id/dash-client',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'clients/:client_id',
    method: 'DELETE',
  },
};

export const fetchClientsList = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: ClientsEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: ClientsEndpoints.index.method,
  });
};

export const dashClients = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: ClientsEndpoints.dashClients.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: ClientsEndpoints.dashClients.method,
  });
};

export const fetchSelectClients = ({ apiOptions = {}, params } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: `${ClientsEndpoints.selectClients.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    )}${params}`,
    method: ClientsEndpoints.selectClients.method,
  });
};

export const showClient = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: ClientsEndpoints.show.url.replace(':client_id', id),
    method: ClientsEndpoints.show.method,
  });

export const dashClient = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: ClientsEndpoints.dashClient.url.replace(':client_id', id),
    method: ClientsEndpoints.dashClient.method,
  });

export const createClient = async ({ company, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: ClientsEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: ClientsEndpoints.create.method,
    data: { ...company },
  });
};

export const updateClient = async ({ company, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: ClientsEndpoints.update.url.replace(':client_id', company.id),
    method: ClientsEndpoints.update.method,
    data: { ...company },
  });

export const destroyClient = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: ClientsEndpoints.destroy.url.replace(':client_id', id),
    method: ClientsEndpoints.destroy.method,
  });
