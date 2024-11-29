import constants from './purchases.constants';

const setFilterDueOrPaymentDate = ({ filter_due_or_payment_date }) => ({
  type: constants.SET_FILTER_DUE_OR_PAYMENT_DATE,
  payload: { filter_due_or_payment_date },
});

const setFilterCompetencyDate = ({ filter_competency_date }) => ({
  type: constants.SET_FILTER_COMPETENCY_DATE,
  payload: { filter_competency_date },
});

const setFilterStatus = ({ filter_status }) => ({
  type: constants.SET_FILTER_STATUS,
  payload: { filter_status },
});

const setFilterCreatedById = ({ filter_created_by_id }) => ({
  type: constants.SET_FILTER_CREATED_BY_ID,
  payload: { filter_created_by_id },
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
  setFilterStatus,
  setFilterCreatedById,
  setSortModel,
  setPageSize,
};
