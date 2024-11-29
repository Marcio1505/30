import constants from './purchases.constants';
import getPurchasesInitialState from './purchases.initialState';

const reducer = (state = getPurchasesInitialState(), { type, payload }) => {
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

    case constants.SET_FILTER_STATUS: {
      const { filter_status } = payload;

      return {
        ...state,
        filter: {
          ...state.filter,
          filter_status,
        },
      };
    }

    case constants.SET_FILTER_CREATED_BY_ID: {
      const { filter_created_by_id } = payload;

      return {
        ...state,
        filter: {
          ...state.filter,
          filter_created_by_id,
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
      return getPurchasesInitialState();
    }

    default:
      return state;
  }
};

export default reducer;
