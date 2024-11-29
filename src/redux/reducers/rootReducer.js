import { combineReducers } from 'redux';
import calenderReducer from './calendar';
import emailReducer from './email';
import chatReducer from './chat';
import todoReducer from './todo';
import customizer from './customizer';
import auth from './auth';
import navbar from './navbar/Index';
import dataList from './data-list';
import companies from './companies';

import applicationReducer from '../../new.redux/application/application.reducer';
import receivablesReducer from '../../new.redux/receivables/receivables.reducer';
import payablesReducer from '../../new.redux/payables/payables.reducer';
import salesReducer from '../../new.redux/sales/sales.reducer';
import invoiceDownloadsReducer from '../../new.redux/invoiceDownloads/invoiceDownloads.reducer';
import purchasesReducer from '../../new.redux/purchases/purchases.reducer';
import permissionsReducer from '../../new.redux/permissions/permissions.reducer';

const rootReducer = combineReducers({
  calendar: calenderReducer,
  emailApp: emailReducer,
  todoApp: todoReducer,
  chatApp: chatReducer,
  customizer,
  auth,
  navbar,
  dataList,
  application: applicationReducer,
  receivables: receivablesReducer,
  payables: payablesReducer,
  sales: salesReducer,
  invoiceDownloads: invoiceDownloadsReducer,
  purchases: purchasesReducer,
  permissions: permissionsReducer,
  companies,
});

export default rootReducer;
