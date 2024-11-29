import API from '../API.redux';
import { store } from "../../redux/storeConfig/store";

const budgetsEndpoints = {
  index: {
    url: 'companies/:company_id/budgets',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/budgets',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'budgets/:budget_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'budgets/:budget_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'budgets/:budget_id',
    method: 'DELETE',
  },
};

export const fetchBudgetsList = ({
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: budgetsEndpoints.index.url.replace(':company_id', state.companies.currentCompanyId),
    method: budgetsEndpoints.index.method,
  });
};

export const showBudget = ({
  id,
  apiOptions = {},
} = {}) => {
  return API(apiOptions)({
    url: budgetsEndpoints.show.url.replace(':budget_id', id),
    method: budgetsEndpoints.show.method,
  });
};

export const createBudget = async ({
  budget,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: budgetsEndpoints.create.url.replace(':company_id', state.companies.currentCompanyId),
    method: budgetsEndpoints.create.method,
    data: { ...budget },
  });
};

export const updateBudget = async ({
  budget,
  apiOptions = {},
} = {}) => {
  return API(apiOptions)({
    url: budgetsEndpoints.update.url.replace(':budget_id', budget.id),
    method: budgetsEndpoints.update.method,
    data: { ...budget },
  });
};

export const destroyBudget = ({
  id,
  apiOptions = {},
} = {}) => {
  return API(apiOptions)({
    url: budgetsEndpoints.destroy.url.replace(':budget_id', id),
    method: budgetsEndpoints.destroy.method,
  });
};
