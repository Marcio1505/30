import API from '../API.redux';

const countriesEndpoints = {
  index: {
    url: 'countries',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchCountriesList = ({
  apiOptions = {},
} = {}) => {

  return API(apiOptions)({
    url: countriesEndpoints.index.url,
    method: countriesEndpoints.index.method,
  });
};
