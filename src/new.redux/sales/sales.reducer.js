import constants from './sales.constants';
import getSalesInitialState from './sales.initialState';

const reducer = (state = getSalesInitialState(), { type, payload }) => {
  switch (type) {
    case constants.SET_FILTER_SALE_COMPETENCY_DATE: {
      const { filterSaleCompetencyDate } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filterSaleCompetencyDate,
        },
      };
    }

    case constants.SET_FILTER_SALE_STATUSES: {
      const { filterSaleStatuses } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filterSaleStatuses,
        },
      };
    }

    case constants.SET_FILTER_SALE_SOURCES: {
      const { filterSaleSources } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filterSaleSources,
        },
      };
    }

    case constants.SET_FILTER_SALE_PRODUCTS: {
      const { filterSaleProducts } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filterSaleProducts,
        },
      };
    }

    case constants.SET_FILTER_SALE_BANK_ACCOUNTS: {
      const { filterSaleBankAccounts } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filterSaleBankAccounts,
        },
      };
    }

    case constants.SET_FILTER_SALE_CATEGORIES: {
      const { filterSaleCategories } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filterSaleCategories,
        },
      };
    }

    case constants.SET_FILTER_INVOICE_DATE: {
      const { filterInvoiceDate } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filterInvoiceDate,
        },
      };
    }

    case constants.SET_FILTER_INVOICE_STATUS: {
      const { filterInvoiceStatus } = payload;
      return {
        ...state,
        filter: {
          ...state.filter,
          filterInvoiceStatus,
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

    case constants.SET_CURRENT_PAGE: {
      const { currentPage } = payload;
      return {
        ...state,
        currentPage,
      };
    }

    case constants.SET_INITIAL_STATE: {
      return getSalesInitialState();
    }

    default:
      return state;
  }
};

export default reducer;
