export const login = (state = { userRole: 'admin' }, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return { ...state, values: action.payload };
    }
    case 'LOGOUT': {
      // return { ...state, values: action.payload };
      return {
        ...state,
        values: {
          accessToken: '',
          loggedInUser: {},
        },
      };
    }
    case 'SET_USER_AUTHENTICATED': {
      return {
        ...state,
        values: {
          ...state.values,
          isUserAuthenticated: action.payload,
        },
      };
    }
    case 'LOGOUT_WITH_FIREBASE': {
      return { ...state, values: action.payload };
    }
    case 'CHANGE_ROLE': {
      return { ...state, userRole: action.userRole };
    }
    default: {
      return state;
    }
  }
};
