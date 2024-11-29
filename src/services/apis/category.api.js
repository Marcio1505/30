import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const categoriesEndpoints = {
  index: {
    url: 'companies/:company_id/categories',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'categories/:category_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  store: {
    url: 'companies/:company_id/categories',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  updateDefaultCategories: {
    url: 'companies/:company_id/categories/default',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  tree: {
    url: 'companies/:company_id/categories/tree',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'categories/:category_id',
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchCategoriesList = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  let url = categoriesEndpoints.index.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );

  url = params ? url + params : url;

  return API(apiOptions)({
    url,
    method: categoriesEndpoints.index.method,
  });
};

export const updateCategory = ({ category, apiOptions = {} } = {}) => {
  const url = categoriesEndpoints.update.url.replace(
    ':category_id',
    category.id
  );

  return API(apiOptions)({
    url,
    method: categoriesEndpoints.update.method,
    data: {
      ...category,
    },
  });
};

export const storeCategory = ({
  category,
  categoryFather,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  const url = categoriesEndpoints.index.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );
  return API(apiOptions)({
    url,
    method: categoriesEndpoints.store.method,
    data: {
      ...category,
      category_father_id: categoryFather.id,
    },
  });
};

export const updateDefaultCategories = ({
  defaultCategories,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  const url = categoriesEndpoints.updateDefaultCategories.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );
  return API(apiOptions)({
    url,
    method: categoriesEndpoints.updateDefaultCategories.method,
    data: defaultCategories,
  });
};

export const getCategoriesTree = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  let url = categoriesEndpoints.tree.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );

  url = params ? url + params : url;

  return API(apiOptions)({
    url,
    method: categoriesEndpoints.tree.method,
  });
};

export const destroyCategory = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: categoriesEndpoints.destroy.url.replace(':category_id', id),
    method: categoriesEndpoints.destroy.method,
  });
