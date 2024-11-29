import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const bankAccountsEndpoints = {
  index: {
    url: 'companies/:company_id/bank-accounts',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  getOptions: {
    url: 'companies/:company_id/bank-accounts/get-options',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/bank-accounts',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'bank-accounts/:bank_account_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'bank-accounts/:bank_account_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  currentBalance: {
    url: 'bank-accounts/:bank_account_id/current-balance',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'bank-accounts/:bank_account_id',
    method: 'DELETE',
  },

  statement: {
    url: 'bank-accounts/:bank_account_id/statement',
    method: 'GET',
  },

  detailedStatement: {
    url: 'bank-accounts/:bank_account_id/detailed-statement',
    method: 'GET',
  },

  importOfx: {
    url: 'bank-accounts/:bank_account_id/ofx/import',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  putBankAccount: {
    method: 'PUT',
    headers: {},
  },

  getSignedUrl: {
    url: 'companies/:company_id/bank-accounts/get-signed-url',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchBankAccountsList = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: bankAccountsEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: bankAccountsEndpoints.index.method,
  });
};

export const fetchBankAccountsOptions = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: bankAccountsEndpoints.getOptions.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: bankAccountsEndpoints.getOptions.method,
  });
};

export const showBankAccount = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: bankAccountsEndpoints.show.url.replace(':bank_account_id', id),
    method: bankAccountsEndpoints.show.method,
  });

export const getCurrentBalance = ({
  id,
  apiOptions = {},
  toggleLoading = true,
} = {}) =>
  API(
    apiOptions,
    toggleLoading
  )({
    url: bankAccountsEndpoints.currentBalance.url.replace(
      ':bank_account_id',
      id
    ),
    method: bankAccountsEndpoints.currentBalance.method,
  });

export const createBankAccount = async ({
  bankAccount,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: bankAccountsEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: bankAccountsEndpoints.create.method,
    data: { ...bankAccount },
  });
};

export const updateBankAccount = async ({
  bankAccount,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: bankAccountsEndpoints.update.url.replace(
      ':bank_account_id',
      bankAccount.id
    ),
    method: bankAccountsEndpoints.update.method,
    data: { ...bankAccount },
  });

export const destroyBankAccount = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: bankAccountsEndpoints.destroy.url.replace(':bank_account_id', id),
    method: bankAccountsEndpoints.destroy.method,
  });

export const getStatementBankAccount = ({
  id,
  apiOptions = {},
  params,
} = {}) => {
  let url = bankAccountsEndpoints.statement.url.replace(':bank_account_id', id);
  if (params) {
    url += params;
  }
  return API(apiOptions)({
    url,
    method: bankAccountsEndpoints.statement.method,
  });
};

export const getDetailedStatementBankAccount = ({
  id,
  apiOptions = {},
  params,
} = {}) => {
  let url = bankAccountsEndpoints.detailedStatement.url.replace(
    ':bank_account_id',
    id
  );
  if (params) {
    url += params;
  }
  return API(apiOptions)({
    url,
    method: bankAccountsEndpoints.detailedStatement.method,
  });
};

export const importOfxBankAccount = async ({
  bank_account_id,
  ofxFile,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: bankAccountsEndpoints.importOfx.url.replace(
      ':bank_account_id',
      bank_account_id
    ),
    method: bankAccountsEndpoints.importOfx.method,
    data: { ofxFile },
  });

export const putBankAccount = ({ signedUrl, file } = {}) =>
  fetch(signedUrl, {
    method: 'PUT',
    body: file,
  });

export const getSignedUrl = ({
  apiOptions = {},
  file_type,
  toggleLoading = false,
} = {}) => {
  const state = store.getState();
  return API(apiOptions)(
    {
      url: bankAccountsEndpoints.getSignedUrl.url.replace(
        ':company_id',
        state.companies.currentCompanyId
      ),
      method: bankAccountsEndpoints.getSignedUrl.method,
      params: { file_type },
    },
    toggleLoading
  );
};
