import API from '../API.redux';

const banksEndpoints = {
  index: {
    url: 'banks',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'banks/:bank_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchBanksList = ({
  apiOptions = {},
} = {}) => {

  return API(apiOptions)({
    url: banksEndpoints.index.url,
    method: banksEndpoints.index.method,
  });
};

export const showBank = ({
  id,
  apiOptions = {},
} = {}) => {

  return API(apiOptions)({
    url: banksEndpoints.show.url.replace(':id', id),
    method: banksEndpoints.show.method,
  });
};
