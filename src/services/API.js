import axios from 'axios';
import { store } from '../redux/storeConfig/store';

let baseURL = 'http://127.0.0.1:8000/api/';
// let baseURL = 'http://localhost/iuli-api-develop/public/api/';

if (process.env.REACT_APP_ENV === 'prod') {
  baseURL = 'https://api.iuli.com.br/api/';
}

if (process.env.REACT_APP_ENV === 'hmg') {
  baseURL = 'https://api.hmg.iuli.com.br/api/';
}

if (process.env.REACT_APP_ENV === 'hmg2') {
  baseURL = 'https://api2.hmg.iuli.com.br/api/';
}

export const API_HOST = baseURL;

const API = (
  apiOptions = {
    method: null,
    baseURL: null,
    headers: {
      Authorization: null,
    },
    params: null,
    body: null,
  }
) => {
  const state = store.getState();

  const axiosConfig = {
    method: apiOptions.method || 'GET',
    baseURL: apiOptions.baseURL || API_HOST,
    headers: apiOptions.headers || {
      Authorization: state.auth?.login?.values?.accessToken
        ? `Bearer ${state.auth?.login?.values?.accessToken}`
        : null,
    },
    params: apiOptions.params || {},
    ...(apiOptions.body && { body: apiOptions.body }),
  };
  console.log(axiosConfig);
  return axios.create(axiosConfig);
};

export default API;
