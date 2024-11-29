import API from '../API.redux';

const companiesEndpoints = {
  index: {
    url: 'companies',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  selectCompanies: {
    url: 'select-companies',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'companies/:company_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'companies/:company_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'companies/:company_id',
    method: 'DELETE',
  },
};

export const fetchCompaniesList = ({ apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: companiesEndpoints.index.url,
    method: companiesEndpoints.index.method,
  });

export const fetchSelectCompanies = ({ apiOptions = {}, params } = {}) =>
  API(apiOptions)({
    url: `${companiesEndpoints.selectCompanies.url}${params}`,
    method: companiesEndpoints.selectCompanies.method,
  });

export const showCompany = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: companiesEndpoints.show.url.replace(':company_id', id),
    method: companiesEndpoints.show.method,
  });

export const createCompany = async ({ company, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: companiesEndpoints.create.url,
    method: companiesEndpoints.create.method,
    data: { ...company },
  });

export const updateCompany = async ({ company, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: companiesEndpoints.update.url.replace(':company_id', company.id),
    method: companiesEndpoints.update.method,
    data: { ...company },
  });

export const uploadCertificate = async ({ company }, apiOptions = ({} = {})) =>
  API(apiOptions)({
    url: companiesEndpoints.update.url.replace(':company_id', company.id),
    method: companiesEndpoints.update.method,
    data: { ...company },
  });

export const destroyCompany = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: companiesEndpoints.destroy.url.replace(':company_id', id),
    method: companiesEndpoints.destroy.method,
  });
