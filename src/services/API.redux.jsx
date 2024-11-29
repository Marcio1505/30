import { store } from '../redux/storeConfig/store';
import { applicationActions } from '../new.redux/actions';

import API from './API';
import { history } from '../history';

const APIRedux = (apiOptions = {}, toggleLoading = true) => {
  const apiInstance = API(apiOptions);
  apiInstance.interceptors.request.use(
    (instanceConfig) => {
      if (toggleLoading) {
        store.dispatch(applicationActions.toggleLoading());
      }
      return instanceConfig;
    },

    (error) => {
      store.dispatch(applicationActions.hideLoading());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'error',
          title: 'Ops!',
          message: error.message,
        })
      );

      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response) => {
      store.dispatch(applicationActions.hideLoading());
      // On Success return only the response data. If there's no data on responde, return all response
      return response.data || response;
    },

    (error) => {
      const { response } = error;
      let { code, message } = error;
      if (response) {
        code = response.status;
        message = response.data.errors
          ? response.data.errors[Object.keys(response.data.errors)[0]][0]
          : message;
      }
      const _error = { code, message };

      if (_error.message === 'Network Error') {
        _error.message = 'Verifique sua conexão com a internet';
      }

      if (_error.code === 401) {
        if (response.config.url === 'auth/login') {
          store.dispatch(applicationActions.hideLoading());
          store.dispatch(
            applicationActions.toggleDialog({
              type: 'error',
              title: 'Ops!',
              message: response?.data?.error,
            })
          );
        } else if (response?.data?.message === 'Unauthenticated.') {
          store.dispatch(applicationActions.hideLoading());
          store.dispatch({ type: 'SET_USER_AUTHENTICATED', payload: false });
          store.dispatch({ type: 'LOGOUT' });
          history.push('/login');
        } else {
          store.dispatch(applicationActions.hideLoading());
          history.push('/login');
        }
      } else if (_error.code === 403) {
        store.dispatch(applicationActions.hideLoading());
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'error',
            title: 'Ops!',
            message: 'Acesso não autorizado',
          })
        );
        // history.push('/admin')
      } else if (_error.code === 422) {
        const requestedUrl = error.config?.url;
        console.log({ requestedUrl });
        const isImportExcelError =
          requestedUrl.includes('/import') &&
          !requestedUrl.includes('ofx/import');
        let messageError = 'Ops! Falha na validação dos dados.';
        if (isImportExcelError) {
          messageError =
            'Ops! Falha na validação dos dados. Nenhum dado foi importado.';
        } else {
          const firstErrorMessage =
            response.data.errors?.[
              Object.keys(response.data?.errors || {})?.[0]
            ]?.[0];
          messageError =
            response.data.error || firstErrorMessage || response.data.message;
        }

        store.dispatch(applicationActions.hideLoading());
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'error',
            title: 'Ops!',
            message: messageError,
            requestedUrl,
            ...(isImportExcelError && {
              allErrors: Object.keys(response.data?.errors || {}).map(
                (key) => ({
                  row: key.split('.')[1],
                  message: response.data.errors[key][0],
                })
              ),
            }),
          })
        );
      } else if (_error.code === 500) {
        store.dispatch(applicationActions.hideLoading());
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'error',
            title: 'Ops!',
            message: 'Tente novamente mais tarde.',
            details: 'Ocorreu um erro inesperado.',
          })
        );
      } else {
        store.dispatch(applicationActions.hideLoading());
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'error',
            title: 'Ops!',
            message: _error.message,
            details: response?.data?.message || '',
          })
        );
      }
      return Promise.reject(response);
    }
  );

  return apiInstance;
};

export default APIRedux;
