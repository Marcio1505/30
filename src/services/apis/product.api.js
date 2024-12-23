import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const productsEndpoints = {
  index: {
    url: 'companies/:company_id/products',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/products',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'products/:product_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'products/:product_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'products/:product_id',
    method: 'DELETE',
  },

  expiration: {
    url: 'companies/:company_id/products',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchProductsListexpiration = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: productsEndpoints.expiration.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: productsEndpoints.expiration.method,
  });
};

export const fetchProductsList = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: productsEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: productsEndpoints.index.method,
  });
};

export const showProduct = ({ id, apiOptions = {} } = {}) => {
  return API(apiOptions)({
    url: productsEndpoints.show.url.replace(':product_id', id),
    method: productsEndpoints.show.method,
  });
};

export const createProduct = async ({ product, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: productsEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: productsEndpoints.create.method,
    data: { ...product },
  });
};

export const updateProduct = async ({ product, apiOptions = {} } = {}) => {
  return API(apiOptions)({
    url: productsEndpoints.update.url.replace(':product_id', product.id),
    method: productsEndpoints.update.method,
    data: { ...product },
  });
};

export const destroyProduct = ({ id, apiOptions = {} } = {}) => {
  return API(apiOptions)({
    url: productsEndpoints.destroy.url.replace(':product_id', id),
    method: productsEndpoints.destroy.method,
  });
};
