import API from '../API.redux';

const iuliPlansEndpoints = {
  index: {
    url: 'admin/iuli-plans',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'admin/iuli-plans',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'admin/iuli-plans/:iuli_plan_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'admin/iuli-plans/:iuli_plan_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'admin/iuli-plans/:iuli_plan_id',
    method: 'DELETE',
  },
};

export const fetchIuliPlansList = ({ apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: iuliPlansEndpoints.index.url,
    method: iuliPlansEndpoints.index.method,
  });

export const showIuliPlan = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: iuliPlansEndpoints.show.url.replace(':iuli_plan_id', id),
    method: iuliPlansEndpoints.show.method,
  });

export const createIuliPlan = async ({ iuliPlan, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: iuliPlansEndpoints.create.url,
    method: iuliPlansEndpoints.create.method,
    data: { ...iuliPlan },
  });

export const updateIuliPlan = async ({ iuliPlan, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: iuliPlansEndpoints.update.url.replace(':iuli_plan_id', iuliPlan.id),
    method: iuliPlansEndpoints.update.method,
    data: { ...iuliPlan },
  });

export const destroyIuliPlan = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: iuliPlansEndpoints.destroy.url.replace(':iuli_plan_id', id),
    method: iuliPlansEndpoints.destroy.method,
  });
