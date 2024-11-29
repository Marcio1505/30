import { createStore, applyMiddleware, compose } from 'redux';
import createDebounce from 'redux-debounced';
import thunk from 'redux-thunk';
import { merge } from 'lodash';
import rootReducer from '../reducers/rootReducer';
import getDefaultInitialState from './defaultInitialState';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const defaultInitialState = getDefaultInitialState();
let initialState = defaultInitialState;

try {
  if (localStorage.getItem('iuli')) {
    const storageState = JSON.parse(localStorage.getItem('iuli'));
    initialState = merge(defaultInitialState, storageState);
    initialState = {
      ...initialState,
      application: {
        ...defaultInitialState.application,
        loading: false,
      },
    };
  }
} catch (error) {
  console.log('getError', error);
}

const saver = (store) => (next) => (action) => {
  const stateToSave = store.getState();
  localStorage.setItem('iuli', JSON.stringify({ ...stateToSave }));
  return next(action);
};

const middlewares = [thunk, createDebounce(), saver];

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middlewares))
);

export { store };
