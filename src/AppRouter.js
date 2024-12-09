import React, { Suspense, lazy } from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import {
  CompatRouter,
  CompatRoute,
  Navigate,
  useLocation,
} from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { history } from './history';
import { store } from './redux/storeConfig/store';
import { applicationActions } from './new.redux/actions';

import Spinner from './components/@vuexy/spinner/Loading-spinner';
import AlertIcon from './components/alerts/AlertIcon';
import { ContextLayout } from './utility/context/Layout';
import Loading from './components/loading/Loading';
import Dialog from './components/dialog/Dialog';

const salesDashboard = lazy(() =>
  import('./views/admin/dashboard/SalesDashboard')
);

const financialDashboard = lazy(() =>
  import('./views/admin/dashboard/FinancialDashboard')
);

// const newDashboard3 = lazy(() =>
//   import('./views/ui-elements/cards/statistics/StatisticsCards')
// );
// const newDashboard4 = lazy(() => import('./views/charts/apex/ApexCharts'));

// Route-based code splitting
const analyticsDashboard = lazy(() =>
  import('./views/admin/dashboard/AnalyticsDashboard')
);
const drePage = lazy(() => import('./views/admin/statements/dre/DrePage'));
const dfcPage = lazy(() => import('./views/admin/statements/dfc/DfcPage'));
const detailedStatement = lazy(() =>
  import('./views/admin/statements/detailed/DetailedStatement')
);

const supplierList = lazy(() =>
  import('./views/admin/supplier/list/SupplierList')
);
const supplierEdit = lazy(() =>
  import('./views/admin/supplier/edit/SupplierEdit')
);

const clientList = lazy(() => import('./views/admin/client/list/ClientList'));
const clientEdit = lazy(() => import('./views/admin/client/edit/ClientEdit'));

const companyList = lazy(() =>
  import('./views/admin/company/list/CompanyList')
);
const companyEdit = lazy(() =>
  import('./views/admin/company/edit/CompanyEdit')
);
const CompanyExpired = lazy(() =>
  import('./views/admin/company/expired/CompanyExpired')
);

const categoryList = lazy(() =>
  import('./views/admin/category/list/CategoryList')
);

const ReconciliationRuleList = lazy(() =>
  import('./views/admin/reconciliation-rule/list/ReconciliationRuleList')
);
const ReconciliationRuleEdit = lazy(() =>
  import('./views/admin/reconciliation-rule/edit/ReconciliationRuleEdit')
);

const companyUserList = lazy(() =>
  import('./views/admin/company-user/list/CompanyUserList')
);
const companyUserEdit = lazy(() =>
  import('./views/admin/company-user/edit/CompanyUserEdit')
);

const receivableList = lazy(() =>
  import('./views/admin/receivable/list/ReceivableList')
);
const receivableReport = lazy(() =>
  import('./views/admin/receivable/report/ReceivableReport')
);
const receivableImport = lazy(() =>
  import('./views/admin/receivable/import/ReceivableImport')
);
const receivableEdit = lazy(() =>
  import('./views/admin/receivable/edit/ReceivableEdit')
);

const payableList = lazy(() =>
  import('./views/admin/payable/list/PayableList')
);
const payableReport = lazy(() =>
  import('./views/admin/payable/report/PayableReport')
);
const payableImport = lazy(() =>
  import('./views/admin/payable/import/PayableImport')
);
const payableEdit = lazy(() =>
  import('./views/admin/payable/edit/PayableEdit')
);

const transferList = lazy(() =>
  import('./views/admin/transfer/list/TransferList')
);
const transferEdit = lazy(() =>
  import('./views/admin/transfer/edit/TransferEdit')
);
const transferImport = lazy(() =>
  import('./views/admin/transfer/import/TransferImport')
);

const wireTransferList = lazy(() =>
  import('./views/admin/wire-transfer/list/WireTransferList')
);
const wireTransferEdit = lazy(() =>
  import('./views/admin/wire-transfer/edit/WireTransferEdit')
);
const wireTransferConfirm = lazy(() =>
  import('./views/admin/wire-transfer/confirm/WireTransferConfirm')
);

const bankAccountList = lazy(() =>
  import('./views/admin/bank-account/list/BankAccountList')
);
const bankAccountEdit = lazy(() =>
  import('./views/admin/bank-account/edit/BankAccountEdit')
);
const bankAccountStatement = lazy(() =>
  import('./views/admin/bank-account/statement/BankAccountStatement')
);
const bankAccountDetailedStatement = lazy(() =>
  import('./views/admin/bank-account/statement/BankAccountDetailedStatement')
);
const bankAccountImportOfx = lazy(() =>
  import(
    './views/admin/bank-account/reconciliation/import/BankAccountImportOfx'
  )
);
const bankAccountIgnoredOfx = lazy(() =>
  import('./views/admin/bank-account/reconciliation/list/OfxIgnoredList')
);
const bankAccountReconciliation = lazy(() =>
  import('./views/admin/bank-account/reconciliation/list/ReconciliationList')
);
const bankAccountConciliationRules = lazy(() =>
  import('./views/admin/bank-account/reconciliation/list/ConciliationRulesList')
);

const ProjectList = lazy(() =>
  import('./views/admin/projetc/list/ProjectList')
);
const ProjectEdit = lazy(() =>
  import('./views/admin/projetc/edit/ProjectEdit')
);

const CostCenterList = lazy(() =>
  import('./views/admin/cost-center/list/CostCenterList')
);
const CostCenterEdit = lazy(() =>
  import('./views/admin/cost-center/edit/CostCenterEdit')
);

const BudgetList = lazy(() => import('./views/admin/budget/list/BudgetList'));
const BudgetEdit = lazy(() => import('./views/admin/budget/edit/BudgetEdit'));

const ProductList = lazy(() =>
  import('./views/admin/product/list/ProductList')
);
const ProductEdit = lazy(() =>
  import('./views/admin/product/edit/ProductEdit')
);

const ProductLinkList = lazy(() =>
  import('./views/admin/product-link/list/ProductLinkList')
);
const ProductLinkEdit = lazy(() =>
  import('./views/admin/product-link/edit/ProductLinkEdit')
);

const SaleList = lazy(() => import('./views/admin/sale/list/SaleList'));
const SaleEdit = lazy(() => import('./views/admin/sale/edit/SaleEdit'));
const SaleImport = lazy(() => import('./views/admin/sale/import/SaleImport'));

const InvoiceDownload = lazy(() =>
  import('./views/admin/invoice/download/InvoiceDownload')
);

const PurchaseList = lazy(() =>
  import('./views/admin/purchase/list/PurchaseList')
);
const PurchaseEdit = lazy(() =>
  import('./views/admin/purchase/edit/PurchaseEdit')
);

const PeriodClosureList = lazy(() =>
  import('./views/admin/period-closure/list/PeriodClosureList')
);

const IuliPlanList = lazy(() =>
  import('./views/admin/iuli-plan/list/IuliPlanList')
);
const IuliPlanEdit = lazy(() =>
  import('./views/admin/iuli-plan/edit/IuliPlanEdit')
);

const IuliPaymentList = lazy(() =>
  import('./views/admin/iuli-payment/list/IuliPaymentList')
);
const IuliPaymentEdit = lazy(() =>
  import('./views/admin/iuli-payment/edit/IuliPaymentEdit')
);

const loginIuli = lazy(() => import('./views/admin/authentication/Login'));
const registerIuli = lazy(() =>
  import('./views/admin/authentication/Register')
);
const confirmAccountIuli = lazy(() =>
  import('./views/admin/authentication/ConfirmAccount')
);
const recoverPasswordIuli = lazy(() =>
  import('./views/admin/authentication/RecoverPassword')
);
const resetPasswordIuli = lazy(() =>
  import('./views/admin/authentication/ResetPassword')
);
const resendConfirmationEmail = lazy(() =>
  import('./views/admin/authentication/ResendConfirmationEmail')
);

const stock = lazy(() => import('./views/admin/stock/list/StockList'));
// Set Layout and Component Using App Route
const AppRoute = (
  { component: Component, fullLayout, isPublic, ...rest },
  props
) => {
  const userRole = useSelector((state) => state.auth.login.userRole);
  const user = useSelector((state) => state.auth.login.values?.loggedInUser);
  const loading = useSelector((state) => state.application.loading);
  const dialog = useSelector((state) => state.application.dialog);
  const authValues = useSelector((state) => state.auth.login.values);
  const currentCompany = useSelector((state) => state.companies.currentCompany);
  const currentCompanyId = useSelector(
    (state) => state.companies.currentCompanyId
  );

  let daysToExpire = 1000;
  if (currentCompany.date_expiry_at) {
    const today = moment().startOf('day');
    daysToExpire = moment(currentCompany.date_expiry_at).diff(today, 'days');
  }
  const isExpired = daysToExpire <= 0;
  const isAboutToExpire = Boolean(daysToExpire >= 1 && daysToExpire <= 7);
  const showExpiredCard = isExpired && !isPublic;
  const showAboutToExpireCard = isAboutToExpire && !isPublic;
  const showPageContent = Boolean(!isExpired || isPublic || user.is_iuli_admin);

  const location = useLocation();

  const hideDialog = React.useCallback((...args) => {
    store.dispatch(applicationActions.hideDialog(...args));
  }, []);

  return (
    <ContextLayout.Consumer>
      {(context) => {
        const LayoutTag =
          fullLayout === true
            ? context.fullLayout
            : context.state.activeLayout === 'horizontal'
            ? context.horizontalLayout
            : context.VerticalLayout;
        return (
          <>
            {loading && <Loading />}
            <Dialog
              isVisible={dialog.visible}
              type={dialog.type}
              hasTimeout={dialog.hasTimeout}
              timeout={dialog.timeout}
              title={dialog.title}
              message={dialog.message}
              details={dialog.details}
              allErrors={dialog.allErrors}
              requestedUrl={dialog.requestedUrl}
              showCancel={dialog.showCancel}
              reverseButtons={dialog.reverseButtons}
              cancelBtnBsStyle={dialog.cancelBtnBsStyle}
              confirmBtnBsStyle={dialog.confirmBtnBsStyle}
              confirmBtnText={dialog.confirmBtnText}
              cancelBtnText={dialog.cancelBtnText}
              onConfirm={dialog.onConfirm || hideDialog}
              onClose={dialog.onClose || hideDialog}
              onCancel={dialog.onCancel || hideDialog}
            />

            {!authValues?.isUserAuthenticated &&
            !isPublic &&
            location.pathname !== '/login' ? (
              <Navigate to="/login" replace />
            ) : !authValues?.isUserAuthenticated &&
              !isPublic &&
              location.pathname !== '/login' ? (
              <Navigate to="/unauthorized" replace />
            ) : (
              <LayoutTag permission={userRole}>
                <Suspense fallback={<Spinner />}>
                  {showExpiredCard && <CompanyExpired />}
                  {showAboutToExpireCard && (
                    <AlertIcon type="warning">
                      {`${
                        daysToExpire === 1
                          ? `Falta ${daysToExpire} dia`
                          : `Faltam ${daysToExpire} dias`
                      } para o acesso dessa empresa expirar. Consulte os `}
                      {` `}
                      <Link
                        to={{ pathname: 'https://assine.iuli.com.br/planos' }}
                        target="_blank"
                      >
                        planos disponíveis
                      </Link>
                      {` e faça a renovação do seu plano para esta empresa.`}
                    </AlertIcon>
                  )}
                  {Boolean(!currentCompanyId && !isPublic) && (
                    <AlertIcon type="success">
                      {`Bem-vindo ao IULI. `}
                      <Link to="/admin/company/edit">
                        Cadastre sua primeira empresa para iniciar
                      </Link>
                    </AlertIcon>
                  )}
                  {showPageContent && <Component {...props} />}
                </Suspense>
              </LayoutTag>
            )}
          </>
        );
      }}
    </ContextLayout.Consumer>
  );
};

const AppRouter = () => (
  // Set the directory path if you are deploying in sub-folder
  <Router history={history}>
    <CompatRouter>
      <Switch>
        <Route
          path="/login"
          component={() => (
            <AppRoute component={loginIuli} fullLayout isPublic />
          )}
        />
        <Route
          path="/register"
          component={() => (
            <AppRoute component={registerIuli} fullLayout isPublic />
          )}
        />
        <Route
          path="/confirm-account/:document/:confirm_email_token"
          component={() => (
            <AppRoute component={confirmAccountIuli} fullLayout isPublic />
          )}
        />
        <Route
          path="/recover-password"
          component={() => (
            <AppRoute component={recoverPasswordIuli} fullLayout isPublic />
          )}
        />
        <Route
          path="/resend-confirmation-email"
          component={() => (
            <AppRoute component={resendConfirmationEmail} fullLayout isPublic />
          )}
        />
        <Route
          path="/reset-password/:document/:recover_password_token"
          component={() => (
            <AppRoute component={resetPasswordIuli} fullLayout isPublic />
          )}
        />

        <Route
          exact
          path="/sales-dashboard"
          component={() => <AppRoute component={salesDashboard} />}
        />

        <Route
          exact
          path="/financial-dashboard"
          component={() => <AppRoute component={financialDashboard} />}
        />
        {/* 
        <Route
          exact
          path="/new-dashboard3"
          component={() => <AppRoute component={newDashboard3} />}
        />

        <Route
          exact
          path="/new-dashboard4"
          component={() => <AppRoute component={newDashboard4} />}
        /> */}

        <Route
          exact
          path="/"
          component={() => <AppRoute component={analyticsDashboard} />}
        />
        <Route
          exact
          path="/admin"
          component={() => <AppRoute component={analyticsDashboard} />}
        />
        <CompatRoute
          path="/dre"
          component={() => <AppRoute component={drePage} />}
        />
        <CompatRoute
          path="/dfc"
          component={() => <AppRoute component={dfcPage} />}
        />
        <CompatRoute
          path="/admin/statements/detailed"
          component={() => <AppRoute component={detailedStatement} />}
        />
        {/* SUPPLIERS */}
        <CompatRoute
          path="/admin/supplier/list"
          component={() => <AppRoute component={supplierList} />}
        />
        <CompatRoute
          path="/admin/supplier/edit/:company_id"
          component={() => <AppRoute component={supplierEdit} />}
        />
        <CompatRoute
          path="/admin/supplier/edit/"
          component={() => <AppRoute component={supplierEdit} />}
        />
        {/* CLIENTS */}
        <CompatRoute
          path="/admin/client/list"
          component={() => <AppRoute component={clientList} />}
        />
        <CompatRoute
          path="/admin/client/edit/:company_id"
          component={() => <AppRoute component={clientEdit} />}
        />
        <CompatRoute
          path="/admin/client/edit/"
          component={() => <AppRoute component={clientEdit} />}
        />
        {/* COMPANIES */}
        <CompatRoute
          path="/admin/company/list"
          component={() => <AppRoute component={companyList} />}
        />
        <CompatRoute
          path="/admin/company/edit/:company_id"
          component={() => <AppRoute component={companyEdit} />}
        />
        <CompatRoute
          path="/admin/company/edit/"
          component={() => <AppRoute component={companyEdit} />}
        />
        {/* CATEGORIES */}
        <CompatRoute
          path="/admin/category/list"
          component={() => <AppRoute component={categoryList} />}
        />
        {/* RECONCILIATION RULE */}
        <CompatRoute
          path="/admin/reconciliation-rule/list"
          component={() => <AppRoute component={ReconciliationRuleList} />}
        />
        <CompatRoute
          path="/admin/reconciliation-rule/edit/:reconciliation_rule_id"
          component={() => <AppRoute component={ReconciliationRuleEdit} />}
        />
        <CompatRoute
          path="/admin/reconciliation-rule/edit/"
          component={() => <AppRoute component={ReconciliationRuleEdit} />}
        />
        {/* COMPANY USERS */}
        <CompatRoute
          path="/admin/company-user/list"
          component={() => <AppRoute component={companyUserList} />}
        />
        <CompatRoute
          path="/admin/company-user/edit/:user_id"
          component={() => <AppRoute component={companyUserEdit} />}
        />
        <CompatRoute
          path="/admin/company-user/edit/"
          component={() => <AppRoute component={companyUserEdit} />}
        />
        {/* RECEIVABLES */}
        <CompatRoute
          path="/admin/receivable/list"
          component={() => <AppRoute component={receivableList} />}
        />
        <CompatRoute
          path="/admin/receivable/report"
          component={() => <AppRoute component={receivableReport} />}
        />
        <CompatRoute
          path="/admin/receivable/import"
          component={() => <AppRoute component={receivableImport} />}
        />
        <CompatRoute
          path="/admin/receivable/edit/:transaction_id"
          component={() => <AppRoute component={receivableEdit} />}
        />
        <CompatRoute
          path="/admin/receivable/edit/"
          component={() => <AppRoute component={receivableEdit} />}
        />
        {/* PAYABLES */}
        <CompatRoute
          path="/admin/payable/list"
          component={() => <AppRoute component={payableList} />}
        />
        <CompatRoute
          path="/admin/payable/report"
          component={() => <AppRoute component={payableReport} />}
        />
        <CompatRoute
          path="/admin/payable/import"
          component={() => <AppRoute component={payableImport} />}
        />
        <CompatRoute
          path="/admin/payable/edit/:transaction_id"
          component={() => <AppRoute component={payableEdit} />}
        />
        <CompatRoute
          path="/admin/payable/edit/"
          component={() => <AppRoute component={payableEdit} />}
        />
        {/* TRANSFERS */}
        <CompatRoute
          path="/admin/transfer/list"
          component={() => <AppRoute component={transferList} />}
        />
        <CompatRoute
          path="/admin/transfer/edit/:transfer_id"
          component={() => <AppRoute component={transferEdit} />}
        />
        <CompatRoute
          path="/admin/transfer/edit/"
          component={() => <AppRoute component={transferEdit} />}
        />
        <CompatRoute
          path="/admin/transfer/import"
          component={() => <AppRoute component={transferImport} />}
        />
        {/* WIRETRANSFERS */}
        <CompatRoute
          path="/admin/wire-transfer/list"
          component={() => <AppRoute component={wireTransferList} />}
        />
        <CompatRoute
          path="/admin/wire-transfer/edit/:wire_transfer_id"
          component={() => <AppRoute component={wireTransferEdit} />}
        />
        <CompatRoute
          path="/admin/wire-transfer/edit/"
          component={() => <AppRoute component={wireTransferEdit} />}
        />
        <CompatRoute
          path="/admin/wire-transfer/confirm/:wire_transfer_id/:token"
          component={() => <AppRoute component={wireTransferConfirm} />}
        />
        {/* BANK ACCOUNTS */}
        <CompatRoute
          path="/admin/bank-account/list"
          component={() => <AppRoute component={bankAccountList} />}
        />
        <CompatRoute
          path="/admin/bank-account/edit/:bank_account_id"
          component={() => <AppRoute component={bankAccountEdit} />}
        />
        <CompatRoute
          path="/admin/bank-account/edit/"
          component={() => <AppRoute component={bankAccountEdit} />}
        />
        <CompatRoute
          path="/admin/bank-account/statement/:bank_account_id"
          component={() => <AppRoute component={bankAccountStatement} />}
        />
        <CompatRoute
          path="/admin/bank-account/detailed-statement/:bank_account_id"
          component={() => (
            <AppRoute component={bankAccountDetailedStatement} />
          )}
        />
        <CompatRoute
          path="/admin/bank-account/:bank_account_id/ofx/import"
          component={() => <AppRoute component={bankAccountImportOfx} />}
        />
        <CompatRoute
          path="/admin/bank-account/:bank_account_id/reconciliation/ofx-transactions/ignored"
          component={() => <AppRoute component={bankAccountIgnoredOfx} />}
        />
        <CompatRoute
          path="/admin/bank-account/:bank_account_id/reconciliation-rules/list"
          component={() => (
            <AppRoute component={bankAccountConciliationRules} />
          )}
        />
        <CompatRoute
          path="/admin/bank-account/:bank_account_id/reconciliation"
          component={() => <AppRoute component={bankAccountReconciliation} />}
        />

        {/* PROJECTS */}
        <CompatRoute
          path="/admin/project/list"
          component={() => <AppRoute component={ProjectList} />}
        />
        <CompatRoute
          path="/admin/project/edit/:project_id"
          component={() => <AppRoute component={ProjectEdit} />}
        />
        <CompatRoute
          path="/admin/project/edit/"
          component={() => <AppRoute component={ProjectEdit} />}
        />
        {/* COST CENTERS */}
        <CompatRoute
          path="/admin/cost-center/list"
          component={() => <AppRoute component={CostCenterList} />}
        />
        <CompatRoute
          path="/admin/cost-center/edit/:cost_center_id"
          component={() => <AppRoute component={CostCenterEdit} />}
        />
        <CompatRoute
          path="/admin/cost-center/edit/"
          component={() => <AppRoute component={CostCenterEdit} />}
        />
        {/* BUDGETS */}
        <CompatRoute
          path="/admin/budget/list"
          component={() => <AppRoute component={BudgetList} />}
        />
        <CompatRoute
          path="/admin/budget/edit/:budget_id"
          component={() => <AppRoute component={BudgetEdit} />}
        />
        <CompatRoute
          path="/admin/budget/edit/"
          component={() => <AppRoute component={BudgetEdit} />}
        />
        {/* PRODUCTS */}
        <CompatRoute
          path="/admin/product/list"
          component={() => <AppRoute component={ProductList} />}
        />
        <CompatRoute
          path="/admin/product/edit/:product_id"
          component={() => <AppRoute component={ProductEdit} />}
        />
        <CompatRoute
          path="/admin/product/edit/"
          component={() => <AppRoute component={ProductEdit} />}
        />

        {/* PRODUCT LINKS */}
        <CompatRoute
          path="/admin/product-link/list"
          component={() => <AppRoute component={ProductLinkList} />}
        />
        <CompatRoute
          path="/admin/product-link/edit/:product_link_id"
          component={() => <AppRoute component={ProductLinkEdit} />}
        />
        <CompatRoute
          path="/admin/product-link/edit/"
          component={() => <AppRoute component={ProductLinkEdit} />}
        />

        {/* SALES */}
        <CompatRoute
          path="/admin/sale/list"
          component={() => <AppRoute component={SaleList} />}
        />
        <CompatRoute
          path="/admin/sale/edit/:sale_id"
          component={() => <AppRoute component={SaleEdit} />}
        />
        <CompatRoute
          path="/admin/sale/edit/"
          component={() => <AppRoute component={SaleEdit} />}
        />
        <CompatRoute
          path="/admin/sale/import"
          component={() => <AppRoute component={SaleImport} />}
        />
        <CompatRoute
          path="/admin/invoice/download"
          component={() => <AppRoute component={InvoiceDownload} />}
        />

        {/* PURCHASES */}
        <CompatRoute
          path="/admin/purchase/list"
          component={() => <AppRoute component={PurchaseList} />}
        />
        <CompatRoute
          path="/admin/purchase/edit/:purchase_id"
          component={() => <AppRoute component={PurchaseEdit} />}
        />
        <CompatRoute
          path="/admin/purchase/edit/"
          component={() => <AppRoute component={PurchaseEdit} />}
        />
        <CompatRoute
          path="/admin/period-closure/list"
          component={() => <AppRoute component={PeriodClosureList} />}
        />

        {/* IULI PLAN */}
        <CompatRoute
          path="/admin/iuli-plan/list"
          component={() => <AppRoute component={IuliPlanList} />}
        />
        <CompatRoute
          path="/admin/iuli-plan/edit/:iuli_plan_id"
          component={() => <AppRoute component={IuliPlanEdit} />}
        />
        <CompatRoute
          path="/admin/iuli-plan/edit/"
          component={() => <AppRoute component={IuliPlanEdit} />}
        />

        {/* IULI PAYMENT */}
        <CompatRoute
          path="/admin/iuli-payment/list"
          component={() => <AppRoute component={IuliPaymentList} />}
        />
        <CompatRoute
          path="/admin/iuli-payment/edit/:iuli_payment_id"
          component={() => <AppRoute component={IuliPaymentEdit} />}
        />
        <CompatRoute
          path="/stock"
          component={() => <AppRoute component={stock} />}
        />
      </Switch>
    </CompatRouter>
  </Router>
);
export default AppRouter;
