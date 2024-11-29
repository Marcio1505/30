import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const productLinksEndpoints = {
  index: {
    url: 'product-links',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  listByCompany: {
    url: 'companies/:company_id/product-links',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/products/:product_id/product-links',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'product-links/:product_link_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'product-links/:product_link_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'product-links/:product_link_id',
    method: 'DELETE',
  },
};

export const listProductLinksByCompany = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: productLinksEndpoints.listByCompany.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: productLinksEndpoints.listByCompany.method,
  });
};

export const fetchProductLinksList = ({ product_id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: productLinksEndpoints.index.url.replace(':product_id', product_id),
    method: productLinksEndpoints.index.method,
  });

export const showProductLink = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: productLinksEndpoints.show.url.replace(':product_link_id', id),
    method: productLinksEndpoints.show.method,
  });

export const createProductLink = async ({
  productLink,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: productLinksEndpoints.create.url
      .replace(':product_id', productLink.product_id)
      .replace(':company_id', state.companies.currentCompanyId),
    method: productLinksEndpoints.create.method,
    data: { ...productLink },
  });
};

export const updateProductLink = async ({
  productLink,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: productLinksEndpoints.update.url.replace(
      ':product_link_id',
      productLink.id
    ),
    method: productLinksEndpoints.update.method,
    data: { ...productLink },
  });

export const destroyProductLink = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: productLinksEndpoints.destroy.url.replace(':product_link_id', id),
    method: productLinksEndpoints.destroy.method,
  });
