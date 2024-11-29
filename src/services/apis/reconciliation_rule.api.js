import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const reconciliationRuleEndpoints = {
  index: {
    url: 'companies/:company_id/reconciliation-rules',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/reconciliation-rules',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'reconciliation-rules/:reconciliation_rule_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'reconciliation-rules/:reconciliation_rule_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'reconciliation-rules/:reconciliation_rule_id',
    method: 'DELETE',
  },
};

export const fetchReconciliationRuleList = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: reconciliationRuleEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: reconciliationRuleEndpoints.index.method,
  });
};

export const showReconciliationRule = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: reconciliationRuleEndpoints.show.url.replace(
      ':reconciliation_rule_id',
      id
    ),
    method: reconciliationRuleEndpoints.show.method,
  });

export const createReconciliationRule = async ({
  reconciliationRule,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: reconciliationRuleEndpoints.create.url
      .replace(
        ':reconciliation_rule_id',
        reconciliationRule.reconciliation_rule_id
      )
      .replace(':company_id', state.companies.currentCompanyId),
    method: reconciliationRuleEndpoints.create.method,
    data: { ...reconciliationRule },
  });
};

export const updateReconciliationRule = async ({
  reconciliationRule,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: reconciliationRuleEndpoints.update.url.replace(
      ':reconciliation_rule_id',
      reconciliationRule.id
    ),
    method: reconciliationRuleEndpoints.update.method,
    data: { ...reconciliationRule },
  });

export const destroyReconciliationRule = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: reconciliationRuleEndpoints.destroy.url.replace(
      ':reconciliation_rule_id',
      id
    ),
    method: reconciliationRuleEndpoints.destroy.method,
  });
