import API from '../API.redux';

const iuliPaymentsEndpoints = {
  index: {
    url: 'admin/iuli-payments',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'admin/iuli-payments/:iuli_payment_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'admin/iuli-payments/:iuli_payment_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchIuliPaymentsList = ({ apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: iuliPaymentsEndpoints.index.url,
    method: iuliPaymentsEndpoints.index.method,
  });

export const showIuliPayment = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: iuliPaymentsEndpoints.show.url.replace(':iuli_payment_id', id),
    method: iuliPaymentsEndpoints.show.method,
  });

export const updateIuliPayment = async ({
  iuliPayment,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: iuliPaymentsEndpoints.update.url.replace(
      ':iuli_payment_id',
      iuliPayment.id
    ),
    method: iuliPaymentsEndpoints.update.method,
    data: {
      ...iuliPayment,
    },
  });
