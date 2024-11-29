import API from '../API.redux';

const statesEndpoints = {
  index: {
    url: 'states',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'states/:state_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  showCitiesOfState: {
    url: 'states/:state_id/cities',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchStatesList = ({
  apiOptions = {},
} = {}) => {

  return API(apiOptions)({
    url: statesEndpoints.index.url,
    method: statesEndpoints.index.method,
  });
};

export const fetchCitiesOfStateList = ({
  stateId,
  apiOptions = {},
} = {}) => {

  return API(apiOptions)({
    url: statesEndpoints.showCitiesOfState.url.replace(':state_id', stateId),
    method: statesEndpoints.showCitiesOfState.method,
  });
};

export const showState = ({
  id,
  apiOptions = {},
} = {}) => {

  return API(apiOptions)({
    url: statesEndpoints.show.url.replace(':id', id),
    method: statesEndpoints.show.method,
  });
};
