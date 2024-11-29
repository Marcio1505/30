import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const suppliersEndpoints = {
  index: {
    url: 'companies/:company_id/suppliers',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  selectSuppliers: {
    url: 'companies/:company_id/select-suppliers',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'companies/:company_id/suppliers',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'suppliers/:supplier_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'suppliers/:supplier_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'suppliers/:supplier_id',
    method: 'DELETE',
  },
};

export const fetchSuppliersList = ({ apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: suppliersEndpoints.index.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: suppliersEndpoints.index.method,
  });
};

export const fetchSelectSuppliers = ({ apiOptions = {}, params } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: `${suppliersEndpoints.selectSuppliers.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    )}${params}`,
    method: suppliersEndpoints.selectSuppliers.method,
  });
};

export const showSupplier = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: suppliersEndpoints.show.url.replace(':supplier_id', id),
    method: suppliersEndpoints.show.method,
  });

export const createSupplier = async ({ company, apiOptions = {} } = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: suppliersEndpoints.create.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: suppliersEndpoints.create.method,
    data: { ...company },
  });
};

export const updateSupplier = async ({ company, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: suppliersEndpoints.update.url.replace(':supplier_id', company.id),
    method: suppliersEndpoints.update.method,
    data: { ...company },
  });

export const destroySupplier = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: suppliersEndpoints.destroy.url.replace(':supplier_id', id),
    method: suppliersEndpoints.destroy.method,
  });
