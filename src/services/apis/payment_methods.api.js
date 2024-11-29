import API from '../API.redux';

const paymentMethodsEndpoints = {
  index: {
    url: 'payment-methods',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchPaymentMethodsList = ({ apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: paymentMethodsEndpoints.index.url,
    method: paymentMethodsEndpoints.index.method,
  });
