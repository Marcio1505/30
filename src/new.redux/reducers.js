// TO DO Check to exclude
import { combineReducers } from 'redux';

import applicationConstants from './application/application.constants';
import applicationReducer from './application/application.reducer';

const rootReducer = combineReducers({
  [applicationConstants.REDUX_NAMESPACE]: applicationReducer,
});

export default rootReducer;
