import getSalesInitialState from '../../new.redux/sales/sales.initialState';
import getReceivablesInitialState from '../../new.redux/receivables/receivables.initialState';
import getPayablesInitialState from '../../new.redux/payables/payables.initialState';
import getPurchasesInitialState from '../../new.redux/purchases/purchases.initialState';
import getInvoiceDownloadsInitialState from '../../new.redux/invoiceDownloads/invoiceDownloads.initialState';
import applicationInitialState from '../../new.redux/application/application.initialState';

const getDefaultInitialState = () => ({
  application: applicationInitialState,
  sales: getSalesInitialState(),
  receivables: getReceivablesInitialState(),
  payables: getPayablesInitialState(),
  purchases: getPurchasesInitialState(),
  invoiceDownloads: getInvoiceDownloadsInitialState(),
});

export default getDefaultInitialState;
