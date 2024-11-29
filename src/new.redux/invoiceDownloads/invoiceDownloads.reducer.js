import constants from './invoiceDownloads.constants';
import getInvoiceDownloadsInitialState from './invoiceDownloads.initialState';

const reducer = (
  state = getInvoiceDownloadsInitialState(),
  { type, payload }
) => {
  switch (type) {
    case constants.SET_FILTER_INVOICE_DATE: {
      const { filter_invoice_date } = payload;

      return {
        ...state,
        filter: {
          ...state.filter,
          filter_invoice_date,
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

    case constants.SET_FILTER_INVOICE_STATUS: {
      const { filter_invoice_status } = payload;

      return {
        ...state,
        filter: {
          ...state.filter,
          filter_invoice_status,
        },
      };
    }

    case constants.SET_FILTER_INVOICE_OPERATION: {
      const { filter_invoice_operation } = payload;

      return {
        ...state,
        filter: {
          ...state.filter,
          filter_invoice_operation,
        },
      };
    }

    case constants.SET_FILTER_INVOICE_TYPE: {
      const { filter_invoice_type } = payload;

      return {
        ...state,
        filter: {
          ...state.filter,
          filter_invoice_type,
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
      return getInvoiceDownloadsInitialState();
    }

    default:
      return state;
  }
};

export default reducer;
