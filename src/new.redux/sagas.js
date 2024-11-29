// TO DO Check to exclude
import { fork, all } from 'redux-saga/effects';
import application from './application/application.saga';

export default function* rootSaga() {
  yield all([fork(application)]);
}
