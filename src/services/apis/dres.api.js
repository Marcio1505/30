import API from '../API.redux';

const dresEndpoints = {
  index: {
    url: 'dres',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const indexDres = ({ apiOptions = {}, params = null } = {}) => {
  const url = params
    ? dresEndpoints.index.url + params
    : dresEndpoints.index.url;

  return API(apiOptions)({
    url,
    method: dresEndpoints.index.method,
  });
};
