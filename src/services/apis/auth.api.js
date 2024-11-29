import API from '../API.redux';

const AuthEndpoints = {
  register: {
    url: 'auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  confirmEmail: {
    url: 'auth/confirm-email',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  recoverPassword: {
    url: 'auth/recover-password',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  resetPassword: {
    url: 'auth/reset-password',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  resendConfirmationEmail: {
    url: 'auth/resend-confirmation-email',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  login: {
    url: 'auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  logout: {
    url: 'auth/logout',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  getAuthenticatedUser: {
    url: 'auth/user',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

const authRegister = async ({ data, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: AuthEndpoints.register.url,
    method: AuthEndpoints.register.method,
    data: { ...data },
  });

const confirmEmail = async ({
  document,
  confirm_email_token,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: AuthEndpoints.confirmEmail.url,
    method: AuthEndpoints.confirmEmail.method,
    data: {
      document,
      confirm_email_token,
    },
  });

const recoverPassword = async ({ data, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: AuthEndpoints.recoverPassword.url,
    method: AuthEndpoints.recoverPassword.method,
    data: { ...data },
  });

const resendConfirmationEmail = async ({ data, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: AuthEndpoints.resendConfirmationEmail.url,
    method: AuthEndpoints.resendConfirmationEmail.method,
    data: { ...data },
  });

const resetPassword = async ({ data, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: AuthEndpoints.resetPassword.url,
    method: AuthEndpoints.resetPassword.method,
    data: { ...data },
  });

const authLogin = async ({ data, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: AuthEndpoints.login.url,
    method: AuthEndpoints.login.method,
    data: { ...data },
  });

const authLogout = async ({ apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: AuthEndpoints.logout.url,
    method: AuthEndpoints.logout.method,
  });

const getAuthenticatedUser = async ({ apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: AuthEndpoints.getAuthenticatedUser.url,
    method: AuthEndpoints.getAuthenticatedUser.method,
  });

export {
  authRegister,
  confirmEmail,
  recoverPassword,
  resendConfirmationEmail,
  resetPassword,
  authLogin,
  authLogout,
  getAuthenticatedUser,
};
