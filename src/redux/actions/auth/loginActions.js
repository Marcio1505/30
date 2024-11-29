import { history } from '../../../history';
import constantSales from '../../../new.redux/sales/sales.constants';

import { authLogin, authLogout } from '../../../services/apis/auth.api';

export const login = (user) => async (dispatch) => {
  const data = await authLogin({
    data: {
      document: user.document,
      password: user.password,
    },
  });

  if (data.access_token) {
    dispatch({
      type: 'LOGIN',
      payload: {
        accessToken: data.access_token,
        loggedInUser: {
          ...data.user,
        },
      },
    });

    dispatch({
      type: 'SET_USER_AUTHENTICATED',
      payload: true,
    });

    dispatch({
      type: 'UPDATE_COMPANIES',
      companies: data.companies,
    });

    dispatch({
      type: constantSales.SET_INITIAL_STATE,
    });

    if (data.companies.length) {
      dispatch({
        type: 'UPDATE_CURRENT_COMPANY',
        currentCompanyId: data.companies[0].id,
      });
    } else {
      dispatch({
        type: 'UPDATE_CURRENT_COMPANY',
        currentCompanyId: null,
      });
    }
    if (data.companies[0]?.id && data.permissions.length) {
      dispatch({
        type: 'PERMISSIONS/SET_CURRENT_PERMISSIONS',
        payload: {
          currentPermissions: data.permissions,
        },
      });
      history.push('/');
    } else {
      history.push('/admin/company/edit');
    }
  }
};

export const logout = () => async (dispatch) => {
  const data = await authLogout();
  console.log({ data });
  dispatch({ type: 'SET_USER_AUTHENTICATED', payload: false });
  dispatch({ type: 'LOGOUT' });
  dispatch({
    type: 'PERMISSIONS/SET_CURRENT_PERMISSIONS',
    payload: {
      currentPermissions: [],
    },
  });
  history.push('/login');
};

export const changeRole = (role) => (dispatch) =>
  dispatch({ type: 'CHANGE_ROLE', userRole: role });
