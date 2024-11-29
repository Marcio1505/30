import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const periodClosureEndpoints = {
  index: {
    url: 'companies/:company_id/period-closures',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchPeriodClosuresList = ({ params, apiOptions = {} } = {}) => {
  const state = store.getState();
  let url = periodClosureEndpoints.index.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );
  if (params) {
    url += `?${params}`;
  }
  return API(apiOptions)({
    url,
    method: periodClosureEndpoints.index.method,
  });
};
