import API from '../API.redux';

const paymentTypesEndpoints = {
  index: {
    url: 'payment-types',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchPaymentTypesList = ({ apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: paymentTypesEndpoints.index.url,
    method: paymentTypesEndpoints.index.method,
  });
