import API from '../API.redux';

const transactionCategoriesEndpoints = {
  index: {
    url: 'transaction-categories',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchTransactionCategoriesList = ({
  apiOptions = {},
  params = null,
} = {}) => {
  const url = params
    ? transactionCategoriesEndpoints.index.url + params
    : transactionCategoriesEndpoints.index.url;

  return API(apiOptions)({
    url,
    method: transactionCategoriesEndpoints.index.method,
  });
};
