import constantSales from '../../../new.redux/sales/sales.constants';

export const updateCompanies = (companies) => (dispatch) => {
  dispatch({
    type: 'UPDATE_COMPANIES',
    companies,
  });
};

export const updateCurrentCompany = (currentCompanyId) => (dispatch) => {
  dispatch({
    type: 'UPDATE_CURRENT_COMPANY',
    currentCompanyId,
  });
  dispatch({
    type: constantSales.SET_INITIAL_STATE,
  });
};
