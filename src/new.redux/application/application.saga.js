// TO DO Check to exclude
import { takeLatest, takeEvery, take, race, put } from 'redux-saga/effects';

import c from './application.constants';
import actions from './application.actions';

// import { userActions, companyActions, authActions } from '../actions';

// Prototype saga for controlling an application dialog
function* toggleDialog({ payload }) {
  const { onSubmit, onCancel } = payload;

  const { yes } = yield race({
    yes: take(c.DIALOG_CONFIRM_YES),
    no: take(c.DIALOG_CONFIRM_NO),
  });

  if (yes) {
    onSubmit();
  } else {
    onCancel();
  }

  yield put(actions.hideDialog());
  return Boolean(yes);
}

function* resetLoading() {
  // yield put(userActions.resetLoading());
  // yield put(companyActions.resetLoading());
  // yield put(authActions.resetLoading());
  yield put(actions.hideLoading());
}

export default function* tagsSaga() {
  yield takeEvery(c.TOGGLE_DIALOG, toggleDialog);
  yield takeLatest(c.RESET_APPLICATION_LOADING, resetLoading);
}
