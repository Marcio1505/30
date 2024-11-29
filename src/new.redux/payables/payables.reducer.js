import constants from './payables.constants';
import getPayablesInitialState from './payables.initialState';

const reducer = (state = getPayablesInitialState, { type, payload }) => {
  switch (type) {
    case constants.SET_FILTER_DUE_OR_PAYMENT_DATE: {
      const { filter_due_or_payment_date } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_due_or_payment_date,
        },
      };
    }

    case constants.SET_FILTER_COMPETENCY_DATE: {
      const { filter_competency_date } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_competency_date,
        },
      };
    }

    case constants.SET_FILTER_COMPUTED_STATUS: {
      const { filter_computed_status } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_computed_status,
        },
      };
    }

    case constants.SET_FILTER_CATEGORY_ID: {
      const { filter_category_id } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_category_id,
        },
      };
    }

    case constants.SET_FILTER_CATEGORIES_IDS: {
      const { filter_categories_ids } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_categories_ids,
        },
      };
    }

    case constants.SET_FILTER_BANK_ACCOUNTS_IDS: {
      const { filter_bank_accounts_ids } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_bank_accounts_ids,
        },
      };
    }

    case constants.SET_FILTER_SOURCES: {
      const { filter_sources } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_sources,
        },
      };
    }

    case constants.SET_FILTER_PROJECTS: {
      const { filter_projects } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_projects,
        },
      };
    }

    case constants.SET_FILTER_COST_CENTERS: {
      const { filter_cost_centers } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_cost_centers,
        },
      };
    }

    case constants.SET_FILTER_TRANSACTIONS_IDS: {
      const { filter_transactions_ids } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_transactions_ids,
        },
      };
    }

    case constants.SET_FILTER_EXTERNALS_IDS: {
      const { filter_externals_ids } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filter_externals_ids,
        },
      };
    }

    case constants.SET_FILTERS: {
      const { filters } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          ...filters,
        },
      };
    }

    case constants.SET_SORT_MODEL: {
      const { sortModel } = payload;
      return {
        ...state,
        sortModel,
      };
    }

    case constants.SET_PAGE_SIZE: {
      const { pageSize } = payload;
      return {
        ...state,
        pageSize,
      };
    }

    case constants.SET_INITIAL_STATE: {
      return getPayablesInitialState();
    }

    default:
      return state;
  }
};

export default reducer;
