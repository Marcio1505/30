import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const projectsEndpoints = {
  index: {
    url: 'companies/:company_id/projects',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/projects',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'projects/:project_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'projects/:project_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'projects/:project_id',
    method: 'DELETE',
  },
};

export const fetchProjectsList = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: projectsEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: projectsEndpoints.index.method,
  });
};

export const showProject = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: projectsEndpoints.show.url.replace(':project_id', id),
    method: projectsEndpoints.show.method,
  });

export const createProject = async ({ project, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: projectsEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: projectsEndpoints.create.method,
    data: { ...project },
  });
};

export const updateProject = async ({ project, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: projectsEndpoints.update.url.replace(':project_id', project.id),
    method: projectsEndpoints.update.method,
    data: { ...project },
  });

export const destroyProject = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: projectsEndpoints.destroy.url.replace(':project_id', id),
    method: projectsEndpoints.destroy.method,
  });
