const initialState = {
  companies: [],
  currentCompanyId: null,
  currentCompany: {},
};

const companiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_COMPANIES':
      let currentCompanyId = null;
      if (action.companies.length === 1) {
        currentCompanyId = action.companies[0].id;
      }
      return {
        ...state,
        ...(currentCompanyId && { currentCompanyId }),
        companies: action.companies,
      };

    case 'UPDATE_CURRENT_COMPANY':
      return {
        ...state,
        currentCompanyId: action.currentCompanyId,
        currentCompany:
          state.companies.find(
            (company) => action.currentCompanyId === company.id
          ) || {},
      };

    default:
      return state;
  }
};

export default companiesReducer;
