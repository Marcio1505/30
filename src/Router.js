import React, { Suspense, lazy } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { history } from './history';

import { store } from './redux/storeConfig/store';
import { applicationActions } from './new.redux/actions';

import Spinner from './components/@vuexy/spinner/Loading-spinner';
import knowledgeBaseCategory from './views/pages/knowledge-base/Category';
import knowledgeBaseQuestion from './views/pages/knowledge-base/Questions';
import { ContextLayout } from './utility/context/Layout';
import Loading from './components/loading/Loading';
import Dialog from './components/dialog/Dialog';

// Route-based code splitting
const analyticsDashboard = lazy(() =>
  import('./views/admin/dashboard/AnalyticsDashboard')
);
const drePage = lazy(() => import('./views/admin/statements/dre/DrePage'));
const dfcPage = lazy(() => import('./views/admin/statements/dfc/DfcPage'));

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

const categoryList = lazy(() =>
  import('./views/admin/category/list/CategoryList')
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
const bankAccountReconciliation = lazy(() =>
  import('./views/admin/bank-account/reconciliation/list/OfxIgnoredList')
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

const PermissionUserList = lazy(() =>
  import('./views/admin/permissions-users/list/PermissionUserList')
);
const PermissionUserEdit = lazy(() =>
  import('./views/admin/permissions-users/edit/PermissionUserEdit')
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

const publicLogin = lazy(() =>
  import('./views/public/authentication/login/Login')
);
const publicForgotPassword = lazy(() =>
  import('./views/public/authentication/ForgotPassword')
);
const publicLockScreen = lazy(() =>
  import('./views/public/authentication/LockScreen')
);
const publicResetPassword = lazy(() =>
  import('./views/public/authentication/ResetPassword')
);
const publicRegister = lazy(() =>
  import('./views/public/authentication/register/Register')
);

const themeAnalyticsDashboard = lazy(() =>
  import('./views/dashboard/analytics/AnalyticsDashboard')
);
const ecommerceDashboard = lazy(() =>
  import('./views/dashboard/ecommerce/EcommerceDashboard')
);
const email = lazy(() => import('./views/apps/email/Email'));
const chat = lazy(() => import('./views/apps/chat/Chat'));
const todo = lazy(() => import('./views/apps/todo/Todo'));
const calendar = lazy(() => import('./views/apps/calendar/Calendar'));
const shop = lazy(() => import('./views/apps/ecommerce/shop/Shop'));
const wishlist = lazy(() => import('./views/apps/ecommerce/wishlist/Wishlist'));
const checkout = lazy(() => import('./views/apps/ecommerce/cart/Cart'));
const productDetail = lazy(() =>
  import('./views/apps/ecommerce/detail/Detail')
);
const grid = lazy(() => import('./views/ui-elements/grid/Grid'));
const typography = lazy(() =>
  import('./views/ui-elements/typography/Typography')
);
const textutilities = lazy(() =>
  import('./views/ui-elements/text-utilities/TextUtilities')
);
const syntaxhighlighter = lazy(() =>
  import('./views/ui-elements/syntax-highlighter/SyntaxHighlighter')
);
const colors = lazy(() => import('./views/ui-elements/colors/Colors'));
const reactfeather = lazy(() =>
  import('./views/ui-elements/icons/FeatherIcons')
);
const basicCards = lazy(() => import('./views/ui-elements/cards/basic/Cards'));
const statisticsCards = lazy(() =>
  import('./views/ui-elements/cards/statistics/StatisticsCards')
);
const analyticsCards = lazy(() =>
  import('./views/ui-elements/cards/analytics/Analytics')
);
const actionCards = lazy(() =>
  import('./views/ui-elements/cards/actions/CardActions')
);
const Alerts = lazy(() => import('./components/reactstrap/alerts/Alerts'));
const Buttons = lazy(() => import('./components/reactstrap/buttons/Buttons'));
const Breadcrumbs = lazy(() =>
  import('./components/reactstrap/breadcrumbs/Breadcrumbs')
);
const Carousel = lazy(() =>
  import('./components/reactstrap/carousel/Carousel')
);
const Collapse = lazy(() =>
  import('./components/reactstrap/collapse/Collapse')
);
const Dropdowns = lazy(() =>
  import('./components/reactstrap/dropdowns/Dropdown')
);
const ListGroup = lazy(() =>
  import('./components/reactstrap/listGroup/ListGroup')
);
const Modals = lazy(() => import('./components/reactstrap/modal/Modal'));
const Pagination = lazy(() =>
  import('./components/reactstrap/pagination/Pagination')
);
const NavComponent = lazy(() =>
  import('./components/reactstrap/navComponent/NavComponent')
);
const Navbar = lazy(() => import('./components/reactstrap/navbar/Navbar'));
const Tabs = lazy(() => import('./components/reactstrap/tabs/Tabs'));
const TabPills = lazy(() =>
  import('./components/reactstrap/tabPills/TabPills')
);
const Tooltips = lazy(() =>
  import('./components/reactstrap/tooltips/Tooltips')
);
const Popovers = lazy(() =>
  import('./components/reactstrap/popovers/Popovers')
);
const Badge = lazy(() => import('./components/reactstrap/badge/Badge'));
const BadgePill = lazy(() =>
  import('./components/reactstrap/badgePills/BadgePill')
);
const Progress = lazy(() =>
  import('./components/reactstrap/progress/Progress')
);
const Media = lazy(() => import('./components/reactstrap/media/MediaObject'));
const Spinners = lazy(() =>
  import('./components/reactstrap/spinners/Spinners')
);
const Toasts = lazy(() => import('./components/reactstrap/toasts/Toasts'));
const avatar = lazy(() => import('./components/@vuexy/avatar/Avatar'));
const AutoComplete = lazy(() =>
  import('./components/@vuexy/autoComplete/AutoComplete')
);
const chips = lazy(() => import('./components/@vuexy/chips/Chips'));
const divider = lazy(() => import('./components/@vuexy/divider/Divider'));
const vuexyWizard = lazy(() => import('./components/@vuexy/wizard/Wizard'));
const listView = lazy(() => import('./views/ui-elements/data-list/ListView'));
const thumbView = lazy(() => import('./views/ui-elements/data-list/ThumbView'));
const select = lazy(() => import('./views/forms/form-elements/select/Select'));
const switchComponent = lazy(() =>
  import('./views/forms/form-elements/switch/Switch')
);
const checkbox = lazy(() =>
  import('./views/forms/form-elements/checkboxes/Checkboxes')
);
const radio = lazy(() => import('./views/forms/form-elements/radio/Radio'));
const input = lazy(() => import('./views/forms/form-elements/input/Input'));
const group = lazy(() =>
  import('./views/forms/form-elements/input-groups/InputGoups')
);
const numberInput = lazy(() =>
  import('./views/forms/form-elements/number-input/NumberInput')
);
const textarea = lazy(() =>
  import('./views/forms/form-elements/textarea/Textarea')
);
const pickers = lazy(() =>
  import('./views/forms/form-elements/datepicker/Pickers')
);
const inputMask = lazy(() =>
  import('./views/forms/form-elements/input-mask/InputMask')
);
const layout = lazy(() => import('./views/forms/form-layouts/FormLayouts'));
const formik = lazy(() => import('./views/forms/formik/Formik'));
const tables = lazy(() => import('./views/tables/reactstrap/Tables'));
const ReactTables = lazy(() =>
  import('./views/tables/react-tables/ReactTables')
);
const Aggrid = lazy(() => import('./views/tables/aggrid/Aggrid'));
const DataTable = lazy(() => import('./views/tables/data-tables/DataTables'));
const profile = lazy(() => import('./views/pages/profile/Profile'));
const faq = lazy(() => import('./views/pages/faq/FAQ'));
const knowledgeBase = lazy(() =>
  import('./views/pages/knowledge-base/KnowledgeBase')
);
const search = lazy(() => import('./views/pages/search/Search'));
const accountSettings = lazy(() =>
  import('./views/pages/account-settings/AccountSettings')
);
const invoice = lazy(() => import('./views/pages/invoice/Invoice'));
const comingSoon = lazy(() => import('./views/pages/misc/ComingSoon'));
const error404 = lazy(() => import('./views/pages/misc/error/404'));
const error500 = lazy(() => import('./views/pages/misc/error/500'));
const authorized = lazy(() => import('./views/pages/misc/NotAuthorized'));
const maintenance = lazy(() => import('./views/pages/misc/Maintenance'));
const apex = lazy(() => import('./views/charts/apex/ApexCharts'));
const chartjs = lazy(() => import('./views/charts/chart-js/ChartJS'));
const extreme = lazy(() => import('./views/charts/recharts/Recharts'));
const leafletMaps = lazy(() => import('./views/maps/Maps'));
const toastr = lazy(() => import('./extensions/toastify/Toastify'));
const sweetAlert = lazy(() => import('./extensions/sweet-alert/SweetAlert'));
const rcSlider = lazy(() => import('./extensions/rc-slider/Slider'));
const uploader = lazy(() => import('./extensions/dropzone/Dropzone'));
const editor = lazy(() => import('./extensions/editor/Editor'));
const drop = lazy(() => import('./extensions/drag-and-drop/DragAndDrop'));
const tour = lazy(() => import('./extensions/tour/Tour'));
const clipboard = lazy(() =>
  import('./extensions/copy-to-clipboard/CopyToClipboard')
);
const menu = lazy(() => import('./extensions/contexify/Contexify'));
const swiper = lazy(() => import('./extensions/swiper/Swiper'));
const i18n = lazy(() => import('./extensions/i18n/I18n'));
const reactPaginate = lazy(() => import('./extensions/pagination/Pagination'));
const tree = lazy(() => import('./extensions/treeview/TreeView'));
const Import = lazy(() => import('./extensions/import-export/Import'));
const Export = lazy(() => import('./extensions/import-export/Export'));
const ExportSelected = lazy(() =>
  import('./extensions/import-export/ExportSelected')
);
const userList = lazy(() => import('./views/apps/user/list/List'));
const userEdit = lazy(() => import('./views/apps/user/edit/Edit'));
const userView = lazy(() => import('./views/apps/user/view/View'));
const Login = lazy(() => import('./views/pages/authentication/login/Login'));
const forgotPassword = lazy(() =>
  import('./views/pages/authentication/ForgotPassword')
);
const lockScreen = lazy(() =>
  import('./views/pages/authentication/LockScreen')
);
const resetPassword = lazy(() =>
  import('./views/pages/authentication/ResetPassword')
);
const register = lazy(() =>
  import('./views/pages/authentication/register/Register')
);
const accessControl = lazy(() =>
  import('./extensions/access-control/AccessControl')
);

// Set Layout and Component Using App Route
const AppRoute = ({ component: Component, fullLayout, ...rest }) => {
  const user = useSelector((state) => state.auth.login.userRole);
  const loading = useSelector((state) => state.application.loading);
  const dialog = useSelector((state) => state.application.dialog);
  const authValues = useSelector((state) => state.auth.login.values);

  const hideDialog = React.useCallback((...args) => {
    store.dispatch(applicationActions.hideDialog(...args));
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => (
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
                {(fullLayout || authValues?.isUserAuthenticated) && (
                  <LayoutTag {...props} permission={user}>
                    <Suspense fallback={<Spinner />}>
                      <Component {...props} />
                    </Suspense>
                  </LayoutTag>
                )}
              </>
            );
          }}
        </ContextLayout.Consumer>
      )}
    />
  );
};

const AppRouter = () => (
  // Set the directory path if you are deploying in sub-folder
  <Router history={history}>
    <Switch>
      <AppRoute path="/login" component={loginIuli} fullLayout />
      <AppRoute path="/register" component={registerIuli} fullLayout />
      <AppRoute
        path="/confirm-account/:document/:confirm_email_token"
        component={confirmAccountIuli}
        fullLayout
      />
      <AppRoute
        path="/recover-password"
        component={recoverPasswordIuli}
        fullLayout
      />
      <AppRoute
        path="/resend-confirmation-email"
        component={resendConfirmationEmail}
        fullLayout
      />
      <AppRoute
        path="/reset-password/:document/:recover_password_token"
        component={resetPasswordIuli}
        fullLayout
      />
      {/* Routes for IULI */}
      {/* <AppRoute exact path="/" component={themeAnalyticsDashboard} /> */}
      <AppRoute exact path="/" component={analyticsDashboard} />
      <AppRoute exact path="/admin" component={analyticsDashboard} />
      <AppRoute exact path="/dre" component={drePage} />
      <AppRoute exact path="/dfc" component={dfcPage} />
      <AppRoute path="/admin/supplier/list" component={supplierList} />
      <AppRoute
        path="/admin/supplier/edit/:company_id?"
        component={supplierEdit}
      />
      <AppRoute path="/admin/client/list" component={clientList} />
      <AppRoute path="/admin/client/edit/:company_id?" component={clientEdit} />
      <AppRoute path="/admin/company/list" component={companyList} />
      <AppRoute
        path="/admin/company/edit/:company_id?"
        component={companyEdit}
      />
      <AppRoute path="/admin/category/list" component={categoryList} />
      <AppRoute path="/admin/company-user/list" component={companyUserList} />
      <AppRoute
        path="/admin/company-user/edit/:user_id?"
        component={companyUserEdit}
      />
      <AppRoute path="/admin/receivable/list" component={receivableList} />
      <AppRoute path="/admin/receivable/report" component={receivableReport} />
      <AppRoute path="/admin/receivable/import" component={receivableImport} />
      <AppRoute
        path="/admin/receivable/edit/:transaction_id?"
        component={receivableEdit}
      />
      <AppRoute path="/admin/payable/list" component={payableList} />
      <AppRoute path="/admin/payable/report" component={payableReport} />
      <AppRoute path="/admin/payable/import" component={payableImport} />
      <AppRoute
        path="/admin/payable/edit/:transaction_id?"
        component={payableEdit}
      />
      <AppRoute path="/admin/transfer/list" component={transferList} />
      <AppRoute
        path="/admin/transfer/edit/:transfer_id?"
        component={transferEdit}
      />
      <AppRoute path="/admin/transfer/import" component={transferImport} />
      <AppRoute path="/admin/wire-transfer/list" component={wireTransferList} />
      <AppRoute
        path="/admin/wire-transfer/edit/:wire_transfer_id?"
        component={wireTransferEdit}
      />
      <AppRoute
        path="/admin/wire-transfer/confirm/:wire_transfer_id/:token?"
        component={wireTransferConfirm}
      />
      <AppRoute path="/admin/project/list" component={ProjectList} />
      <AppRoute
        path="/admin/project/edit/:project_id?"
        component={ProjectEdit}
      />
      <AppRoute path="/admin/cost-center/list" component={CostCenterList} />
      <AppRoute
        path="/admin/cost-center/edit/:cost_center_id?"
        component={CostCenterEdit}
      />
      <AppRoute
        path="/admin/permissions-users/list"
        component={PermissionUserList}
      />
      <AppRoute
        path="/admin/permissions-users/edit/:permission_id?"
        component={PermissionUserEdit}
      />
      <AppRoute path="/admin/budget/list" component={BudgetList} />
      <AppRoute path="/admin/budget/edit/:budget_id?" component={BudgetEdit} />
      <AppRoute path="/admin/product/list" component={ProductList} />
      <AppRoute
        path="/admin/product/edit/:product_id?"
        component={ProductEdit}
      />
      <AppRoute path="/admin/product-link/list" component={ProductLinkList} />
      <AppRoute
        path="/admin/product-link/edit/:product_link_id?"
        component={ProductLinkEdit}
      />
      <AppRoute path="/admin/sale/list" component={SaleList} />
      <AppRoute path="/admin/sale/edit/:sale_id?" component={SaleEdit} />
      <AppRoute path="/admin/sale/import" component={SaleImport} />
      <AppRoute path="/admin/invoice/download" component={InvoiceDownload} />
      <AppRoute path="/admin/purchase/list" component={PurchaseList} />
      <AppRoute
        path="/admin/purchase/edit/:purchase_id?"
        component={PurchaseEdit}
      />
      <AppRoute path="/admin/bank-account/list" component={bankAccountList} />
      <AppRoute
        path="/admin/bank-account/edit/:bank_account_id?"
        component={bankAccountEdit}
      />
      <AppRoute
        path="/admin/bank-account/statement/:bank_account_id?"
        component={bankAccountStatement}
      />
      <AppRoute
        path="/admin/bank-account/detailed-statement/:bank_account_id?"
        component={bankAccountDetailedStatement}
      />
      <AppRoute
        path="/admin/bank-account/:bank_account_id/ofx/import?"
        component={bankAccountImportOfx}
      />
      <AppRoute
        path="/admin/bank-account/:bank_account_id/reconciliation-rules/list"
        component={bankAccountConciliationRules}
      />
      <AppRoute
        path="/admin/bank-account/:bank_account_id/reconciliation"
        component={bankAccountReconciliation}
      />
      {/* Routes from theme */}
      <AppRoute path="/register" component={publicRegister} fullLayout />
      <AppRoute
        path="/forgot-password"
        component={publicForgotPassword}
        fullLayout
      />
      <AppRoute path="/lock-screen" component={publicLockScreen} fullLayout />
      <AppRoute
        path="/reset-password"
        component={publicResetPassword}
        fullLayout
      />
      <AppRoute path="/ecommerce-dashboard" component={ecommerceDashboard} />
      <AppRoute
        path="/email"
        exact
        component={() => <Redirect to="/email/inbox" />}
      />
      <AppRoute path="/email/:filter" component={email} />
      <AppRoute path="/chat" component={chat} />
      <AppRoute
        path="/todo"
        exact
        component={() => <Redirect to="/todo/all" />}
      />
      <AppRoute path="/todo/:filter" component={todo} />
      <AppRoute path="/calendar" component={calendar} />
      <AppRoute path="/ecommerce/shop" component={shop} />
      <AppRoute path="/ecommerce/wishlist" component={wishlist} />
      <AppRoute path="/ecommerce/product-detail" component={productDetail} />
      <AppRoute
        path="/ecommerce/checkout"
        component={checkout}
        permission="admin"
      />
      <AppRoute path="/data-list/list-view" component={listView} />
      <AppRoute path="/data-list/thumb-view" component={thumbView} />
      <AppRoute path="/ui-element/grid" component={grid} />
      <AppRoute path="/ui-element/typography" component={typography} />
      <AppRoute path="/ui-element/textutilities" component={textutilities} />
      <AppRoute
        path="/ui-element/syntaxhighlighter"
        component={syntaxhighlighter}
      />
      <AppRoute path="/colors/colors" component={colors} />
      <AppRoute path="/icons/reactfeather" component={reactfeather} />
      <AppRoute path="/cards/basic" component={basicCards} />
      <AppRoute path="/cards/statistics" component={statisticsCards} />
      <AppRoute path="/cards/analytics" component={analyticsCards} />
      <AppRoute path="/cards/action" component={actionCards} />
      <AppRoute path="/components/alerts" component={Alerts} />
      <AppRoute path="/components/buttons" component={Buttons} />
      <AppRoute path="/components/breadcrumbs" component={Breadcrumbs} />
      <AppRoute path="/components/carousel" component={Carousel} />
      <AppRoute path="/components/collapse" component={Collapse} />
      <AppRoute path="/components/dropdowns" component={Dropdowns} />
      <AppRoute path="/components/list-group" component={ListGroup} />
      <AppRoute path="/components/modals" component={Modals} />
      <AppRoute path="/components/pagination" component={Pagination} />
      <AppRoute path="/components/nav-component" component={NavComponent} />
      <AppRoute path="/components/navbar" component={Navbar} />
      <AppRoute path="/components/tabs-component" component={Tabs} />
      <AppRoute path="/components/pills-component" component={TabPills} />
      <AppRoute path="/components/tooltips" component={Tooltips} />
      <AppRoute path="/components/popovers" component={Popovers} />
      <AppRoute path="/components/badges" component={Badge} />
      <AppRoute path="/components/pill-badges" component={BadgePill} />
      <AppRoute path="/components/progress" component={Progress} />
      <AppRoute path="/components/media-objects" component={Media} />
      <AppRoute path="/components/spinners" component={Spinners} />
      <AppRoute path="/components/toasts" component={Toasts} />
      <AppRoute
        path="/extra-components/auto-complete"
        component={AutoComplete}
      />
      <AppRoute path="/extra-components/avatar" component={avatar} />
      <AppRoute path="/extra-components/chips" component={chips} />
      <AppRoute path="/extra-components/divider" component={divider} />
      <AppRoute path="/forms/wizard" component={vuexyWizard} />
      <AppRoute path="/forms/elements/select" component={select} />
      <AppRoute path="/forms/elements/switch" component={switchComponent} />
      <AppRoute path="/forms/elements/checkbox" component={checkbox} />
      <AppRoute path="/forms/elements/radio" component={radio} />
      <AppRoute path="/forms/elements/input" component={input} />
      <AppRoute path="/forms/elements/input-group" component={group} />
      <AppRoute path="/forms/elements/number-input" component={numberInput} />
      <AppRoute path="/forms/elements/textarea" component={textarea} />
      <AppRoute path="/forms/elements/pickers" component={pickers} />
      <AppRoute path="/forms/elements/input-mask" component={inputMask} />
      <AppRoute path="/forms/layout/form-layout" component={layout} />
      <AppRoute path="/forms/formik" component={formik} />{' '}
      <AppRoute path="/tables/reactstrap" component={tables} />
      <AppRoute path="/tables/react-tables" component={ReactTables} />
      <AppRoute path="/tables/agGrid" component={Aggrid} />
      <AppRoute path="/tables/data-tables" component={DataTable} />
      <AppRoute path="/pages/profile" component={profile} />
      <AppRoute path="/pages/faq" component={faq} />
      <AppRoute path="/pages/knowledge-base" component={knowledgeBase} exact />
      <AppRoute
        path="/pages/knowledge-base/category"
        component={knowledgeBaseCategory}
        exact
      />
      <AppRoute
        path="/pages/knowledge-base/category/questions"
        component={knowledgeBaseQuestion}
      />
      <AppRoute path="/pages/search" component={search} />
      <AppRoute path="/pages/account-settings" component={accountSettings} />
      <AppRoute path="/pages/invoice" component={invoice} />
      <AppRoute path="/misc/coming-soon" component={comingSoon} fullLayout />
      <AppRoute path="/misc/error/404" component={error404} fullLayout />
      <AppRoute path="/pages/login" component={Login} fullLayout />
      <AppRoute path="/pages/register" component={register} fullLayout />
      <AppRoute
        path="/pages/forgot-password"
        component={forgotPassword}
        fullLayout
      />
      <AppRoute path="/pages/lock-screen" component={lockScreen} fullLayout />
      <AppRoute
        path="/pages/reset-password"
        component={resetPassword}
        fullLayout
      />
      <AppRoute path="/misc/error/500" component={error500} fullLayout />
      <AppRoute path="/misc/not-authorized" component={authorized} fullLayout />
      <AppRoute path="/misc/maintenance" component={maintenance} fullLayout />
      <AppRoute path="/app/user/list" component={userList} />
      <AppRoute path="/app/user/edit" component={userEdit} />
      <AppRoute path="/app/user/view" component={userView} />
      <AppRoute path="/charts/apex" component={apex} />
      <AppRoute path="/charts/chartjs" component={chartjs} />
      <AppRoute path="/charts/recharts" component={extreme} />
      <AppRoute path="/maps/leaflet" component={leafletMaps} />
      <AppRoute path="/extensions/sweet-alert" component={sweetAlert} />
      <AppRoute path="/extensions/toastr" component={toastr} />
      <AppRoute path="/extensions/slider" component={rcSlider} />
      <AppRoute path="/extensions/file-uploader" component={uploader} />
      <AppRoute path="/extensions/wysiwyg-editor" component={editor} />
      <AppRoute path="/extensions/drag-and-drop" component={drop} />
      <AppRoute path="/extensions/tour" component={tour} />
      <AppRoute path="/extensions/clipboard" component={clipboard} />
      <AppRoute path="/extensions/context-menu" component={menu} />
      <AppRoute path="/extensions/swiper" component={swiper} />
      <AppRoute path="/extensions/access-control" component={accessControl} />
      <AppRoute path="/extensions/i18n" component={i18n} />
      <AppRoute path="/extensions/tree" component={tree} />
      <AppRoute path="/extensions/import" component={Import} />
      <AppRoute path="/extensions/export" component={Export} />
      <AppRoute path="/extensions/export-selected" component={ExportSelected} />
      <AppRoute path="/extensions/pagination" component={reactPaginate} />
      <AppRoute component={error404} fullLayout />
    </Switch>
  </Router>
);

export default AppRouter;
