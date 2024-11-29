// TO DO Check to exclude
import { applyMiddleware, createStore, compose } from 'redux';
// import { persistStore } from 'redux-persist';
// import createSagaMiddleware from 'redux-saga';

// import logger from 'redux-logger';

import reducers from './reducers';
// import watcher from './sagas';

// const sagaMiddleware = createSagaMiddleware();

// const middlewares = applyMiddleware(sagaMiddleware);

// const middlewares = process.env.NODE_ENV === 'production'
//   ? applyMiddleware(sagaMiddleware)
// : compose(applyMiddleware(sagaMiddleware), applyMiddleware(logger));

const store = createStore(
  reducers
  // middlewares,
);

// sagaMiddleware.run(watcher);

// export const persistor = persistStore(store, null, () => store.getState());

export default store;
