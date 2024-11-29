import API from '../API.redux';

const paymentPlataformsEndpoints = {
  index: {
    url: 'payment-plataforms',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchPaymentPlataformsList = ({ apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: paymentPlataformsEndpoints.index.url,
    method: paymentPlataformsEndpoints.index.method,
  });
