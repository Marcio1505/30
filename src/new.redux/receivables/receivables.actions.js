import constants from './receivables.constants';

const setFilterDueOrPaymentDate = ({ filter_due_or_payment_date }) => ({
  type: constants.SET_FILTER_DUE_OR_PAYMENT_DATE,
  payload: { filter_due_or_payment_date },
});

const setFilterCompetencyDate = ({ filter_competency_date }) => ({
  type: constants.SET_FILTER_COMPETENCY_DATE,
  payload: { filter_competency_date },
});

const setFilterComputedStatus = ({ filter_computed_status }) => ({
  type: constants.SET_FILTER_COMPUTED_STATUS,
  payload: { filter_computed_status },
});

const setFilterCategoryId = ({ filter_category_id }) => ({
  type: constants.SET_FILTER_CATEGORY_ID,
  payload: { filter_category_id },
});

const setFilterCategoriesIds = ({ filter_categories_ids }) => ({
  type: constants.SET_FILTER_CATEGORIES_IDS,
  payload: { filter_categories_ids },
});

const setFilterBankAccountsIds = ({ filter_bank_accounts_ids }) => ({
  type: constants.SET_FILTER_BANK_ACCOUNTS_IDS,
  payload: { filter_bank_accounts_ids },
});

const setFilterSources = ({ filter_sources }) => ({
  type: constants.SET_FILTER_SOURCES,
  payload: { filter_sources },
});

const setFilterProjects = ({ filter_projects }) => ({
  type: constants.SET_FILTER_PROJECTS,
  payload: { filter_projects },
});

const setFilterCostCentes = ({ filter_cost_centers }) => ({
  type: constants.SET_FILTER_COST_CENTERS,
  payload: { filter_cost_centers },
});

const setFilterTransactionsIds = ({ filter_transactions_ids }) => ({
  type: constants.SET_FILTER_TRANSACTIONS_IDS,
  payload: { filter_transactions_ids },
});

const setFilterExternalsIds = ({ filter_externals_ids }) => ({
  type: constants.SET_FILTER_EXTERNALS_IDS,
  payload: { filter_externals_ids },
});

const setFilters = ({ filters }) => ({
  type: constants.SET_FILTERS,
  payload: { filters },
});

const setSortModel = ({ sortModel }) => ({
  type: constants.SET_SORT_MODEL,
  payload: { sortModel },
});

const setPageSize = ({ pageSize }) => ({
  type: constants.SET_PAGE_SIZE,
  payload: { pageSize },
});

export {
  setFilterDueOrPaymentDate,
  setFilterCompetencyDate,
  setFilterComputedStatus,
  setFilterCategoryId,
  setFilterCategoriesIds,
  setFilterBankAccountsIds,
  setFilterSources,
  setFilterProjects,
  setFilterCostCentes,
  setFilterTransactionsIds,
  setFilters,
  setSortModel,
  setPageSize,
};
