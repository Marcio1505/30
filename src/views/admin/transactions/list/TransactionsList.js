import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { PropTypes } from 'prop-types';
import { connect, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  CustomInput,
} from 'reactstrap';
import { Edit, Trash2 } from 'react-feather';
import { isEmpty } from 'lodash';

import SweetAlert from 'react-bootstrap-sweetalert';

import ModalEditGroupTransaction from './ModalEditGroupTransaction';
import ModalFilterTransaction from './ModalFilterTransaction';
import Loading from '../../../../components/loading/Loading';
import Radio from '../../../../components/@vuexy/radio/RadioVuexy';

import NewBasicListTable from '../../../../components/tables/NewBasicListTable';
import TransactionsSummary from '../../../../components/summaries/TransactionsSummary';

import TransactionStatusBadge from '../../../../components/badges/TransactionStatusBadge';
import TransactionSourceBadge from '../../../../components/badges/TransactionSourceBadge';
import TransactionReconciledBadge from '../../../../components/badges/TransactionReconciledBadge';
import LockStatusPayedBadge from '../../../../components/badges/LockStatusPayedBadge';

import {
  setFilterBankAccountsIds as setFilterBankAccountsIdsReceivable,
  setFilters as setFiltersReceivable,
} from '../../../../new.redux/receivables/receivables.actions';
import {
  setFilterBankAccountsIds as setFilterBankAccountsIdsPayable,
  setFilters as setFiltersPayable,
} from '../../../../new.redux/payables/payables.actions';

import {
  fetchTransactionsList,
  destroyTransaction,
  updatePayed,
  destroyGroupTransaction,
} from '../../../../services/apis/transaction.api';
import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';
import { fetchCostCentersList } from '../../../../services/apis/cost_center.api';
import { fetchProjectsList } from '../../../../services/apis/project.api';
import { fetchCategoriesList } from '../../../../services/apis/category.api';

import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../utils/formaters';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import { FaPaperclip } from 'react-icons/fa';
import '../../../../assets/scss/pages/users.scss';

import { exportTransactionsXLS } from '../../../../utils/transactions/exporters';

import { history } from '../../../../history';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import PermissionGate from '../../../../PermissionGate';
import { addArrayParams } from '../../../../utils/queryPramsUtils';

const CheckboxPayed = ({
  handleCheckboxPayedChange,
  transaction,
  disabled,
}) => (
  <div className="d-flex">
    <CustomInput
      className="mt-1"
      disabled={disabled}
      type="switch"
      id={`payed_${transaction.id}`}
      name={`payed_${transaction.id}`}
      inline
      checked={!!transaction.payed}
      onChange={() => {
        handleCheckboxPayedChange(transaction);
      }}
    />
    <LockStatusPayedBadge transaction={transaction} />
  </div>
);

CheckboxPayed.propTypes = {
  handleCheckboxPayedChange: PropTypes.func.isRequired,
  transaction: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

const TransactionList = ({
  companies,
  transactionType,
  currentUser,
  setFilterBankAccountsIdsPayable,
  setFilterBankAccountsIdsReceivable,
  setFiltersPayable,
  setFiltersReceivable,
}) => {
  const [searchBy, setSearchBy] = useState('');
  const [order, setOrder] = useState({});
  const [pageCount, setPageCount] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(50);
  const [transactions, setTransactions] = useState(null);
  const [summary, setSummary] = useState({});
  const [bankAccounts, setBankAccounts] = useState([]);
  const [iuliBankAccountId, setIuliBankAccountId] = useState(null);
  const [costCenters, setCostCenters] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [destroyAll, setDestroyAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [summaryData, setSummaryData] = useState({});
  const [showModalEditGroupTransaction, setShowModalEditGroupTransaction] =
    useState(false);

  const [
    showModalHandleWriteGroupTransaction,
    setshowModalHandleWriteGroupTransaction,
  ] = useState(false);

  const [
    showModalHandleDestroyGroupTransaction,
    setshowModalHandleDestroyGroupTransaction,
  ] = useState(false);

  const [transactionsToEdit, setTransactionsToEdit] = useState([]);
  const [
    hasPayedHandleWriteGroupTransaction,
    setHasPayedHandleWriteGroupTransaction,
  ] = useState([]);
  const [showModalFilterTransaction, setShowModalFilterTransaction] =
    useState(false);

  const [modalCheckboxPayedConfirmed, setModalCheckboxPayedConfirmed] =
    useState(false);
  const [showModalCheckboxPayedChange, setShowModalCheckboxPayedChange] =
    useState(false);
  const [transactionToChangePayed, setTransactionToChangePayed] =
    useState(null);

  const loggedUInUser = useSelector(
    (state) => state.auth.login.values.loggedInUser
  );

  const handleSubmitCheckPayed = async () => {
    if (modalCheckboxPayedConfirmed) {
      setModalCheckboxPayedConfirmed(false);
      setShowModalCheckboxPayedChange(false);
      try {
        const respUpdatePayed = await submitPayed(
          [transactionToChangePayed.id],
          !transactionToChangePayed.payed
        );
        if (respUpdatePayed.status === 204) {
          getTransactions();
        }
      } catch (error) {
        console.log({ error });
      }
    }
  };

  const isPayable = transactionType === 'PAYABLE';
  const isReceivable = transactionType === 'RECEIVABLE';

  useEffect(() => {
    handleSubmitCheckPayed();
  }, [modalCheckboxPayedConfirmed]);

  const handleCheckboxPayedChange = async (transaction = null) => {
    if (!modalCheckboxPayedConfirmed) {
      setTransactionToChangePayed(transaction);
      setShowModalCheckboxPayedChange(true);
    }
  };

  const submitPayed = async (transactionId, isChecked) => {
    const respUpdatePayed = await updatePayed({
      transactionsIds: transactionId,
      payed: isChecked,
    });
    return respUpdatePayed;
  };

  const { currentCompanyId, currentCompany } = companies;

  let permissionButtonDelete = '';
  let permissionButtonUpdate = '';

  if (transactionType === 'PAYABLE') {
    permissionButtonDelete = 'payables.destroy';
    permissionButtonUpdate = 'payables.show';
  } else if (transactionType === 'RECEIVABLE') {
    permissionButtonDelete = 'receivables.destroy';
    permissionButtonUpdate = 'receivables.show';
  }

  const filter = useSelector((_store) => {
    if (isPayable) {
      return _store.payables.filter;
    }
    if (isReceivable) {
      return _store.receivables.filter;
    }
    return {};
  });

  const handleSummaryData = (gridApi) => {
    let total = summary.total?.count;
    let totalValue = summary.total?.total_value;

    let paidOrReceived = summary.paid_or_received?.count;
    let paidOrReceivedValue = summary.paid_or_received?.total_value;

    let toPayOrReceive = summary.to_pay_or_receive?.count;
    let toPayOrReceiveValue = summary.to_pay_or_receive?.total_value;

    let overdue = summary.orverdue?.count;
    let overdueValue = summary.orverdue?.total_value;

    const selectedTransactions = gridApi?.current.getSelectedRows();
    if (selectedTransactions?.length) {
      total = selectedTransactions.length;
      totalValue = selectedTransactions.reduce(
        (accumulator, { paid_value, transaction_value_or_paid_value }) =>
          accumulator + (paid_value || transaction_value_or_paid_value),
        0
      );

      const paidOrReceivedTransactions = selectedTransactions.filter(
        ({ computed_status }) => computed_status === 1
      );
      paidOrReceived = paidOrReceivedTransactions.length;
      paidOrReceivedValue = paidOrReceivedTransactions.reduce(
        (accumulator, { paid_value }) => accumulator + parseFloat(paid_value),
        0
      );

      const toPayOrReceiveTransactions = selectedTransactions.filter(
        ({ computed_status }) => computed_status === 2
      );
      toPayOrReceive = toPayOrReceiveTransactions.length;
      toPayOrReceiveValue = toPayOrReceiveTransactions.reduce(
        (accumulator, { paid_value, transaction_value_or_paid_value }) =>
          accumulator + (paid_value || transaction_value_or_paid_value),
        0
      );

      const overdueTransactions = selectedTransactions.filter(
        ({ computed_status }) => computed_status === 3
      );
      overdue = overdueTransactions.length;
      overdueValue = overdueTransactions.reduce(
        (accumulator, { paid_value, transaction_value_or_paid_value }) =>
          accumulator + (paid_value || transaction_value_or_paid_value),
        0
      );
    }

    setSummaryData({
      ...summaryData,
      paid: {
        number: paidOrReceived,
        value: paidOrReceivedValue,
        text_number: paidOrReceived ? `(${paidOrReceived}) ` : '(0) ',
        text_value: formatMoney(paidOrReceivedValue || 0),
      },
      toPay: {
        number: toPayOrReceive,
        value: toPayOrReceiveValue,
        text_number: toPayOrReceive ? `(${toPayOrReceive}) ` : '(0) ',
        text_value: formatMoney(toPayOrReceiveValue || 0),
      },
      overdue: {
        number: overdue,
        value: overdueValue,
        text_number: overdue ? `(${overdue}) ` : '(0) ',
        text_value: formatMoney(overdueValue || 0),
      },
      total: {
        number: total,
        value: totalValue,
        text_number: total ? `(${total}) ` : '(0) ',
        text_value: formatMoney(totalValue || 0),
      },
    });
  };

  const handleEditGroupTransaction = async (transactions) => {
    if (isEmpty(transactions)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: isPayable
            ? 'Nenhuma conta a pagar selecionada'
            : 'Nenhuma conta a receber selecionada',
          message: isPayable
            ? 'Selecione pelo menos uma conta a pagar para editar em grupo'
            : 'Selecione pelo menos uma conta a receber para editar em grupo',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }
    setShowModalEditGroupTransaction(true);
    setTransactionsToEdit(transactions);
  };

  // Update Paid Group
  const handleWriteGroupTransaction = async (transactions) => {
    if (isEmpty(transactions)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: isPayable
            ? 'Nenhuma conta a pagar selecionada'
            : 'Nenhuma conta a receber selecionada',
          message: isPayable
            ? 'Selecione pelo menos uma conta a pagar para dar baixa em grupo'
            : 'Selecione pelo menos uma conta a receber para dar baixa em grupo',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    const hasReconciled = transactions.some(
      (transaction) =>
        transaction.reconciled == 1 || transaction.reconciled == 2
    );

    if (hasReconciled) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: isPayable
            ? 'Foi selecionado pelo menos uma conta a pagar que já está conciliada'
            : 'Foi selecionado pelo menos uma conta a receber que já está conciliada',
          message: isPayable
            ? 'Selecione apenas contas a pagar ainda não conciliadas para dar baixa em grupo'
            : 'Selecione apenas contas a receber ainda não conciliadas para dar baixa em grupo',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    const hasPayed = transactions.some((transaction) => transaction.payed == 1);
    const hasNotPayed = transactions.some(
      (transaction) => transaction.payed !== 1
    );

    if (hasPayed && hasNotPayed) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: isPayable
            ? 'Foi selecionado uma conta a pagar já baixada e outra em aberto'
            : 'Foi selecionado uma conta a receber já baixada e outra em aberto',
          message: isPayable
            ? 'Selecione apenas contas a pagar com o mesmo status. Todas já baixadas ou todas em aberto'
            : 'Selecione apenas contas a receber com o mesmo status. Todas já baixadas ou todas em aberto',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    const hasSync = transactions.some(
      (transaction) => transaction.source === 'ASAAS'
    );

    if (hasSync) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: isPayable
            ? 'Foi selecionado pelo menos uma conta a pagar da Conta Iuli'
            : 'Foi selecionado pelo menos uma conta a receber da Conta Iuli',
          message: isPayable
            ? 'Selecione apenas contas a pagar que não são da Conta Iuli'
            : 'Selecione apenas contas a receber que não são da Conta Iuli',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    setshowModalHandleWriteGroupTransaction(true);

    setTransactionsToEdit(transactions);
    setHasPayedHandleWriteGroupTransaction(hasPayed);
  };

  const handleDestroyGroupTransaction = async (transactions, user) => {
    if (isEmpty(transactions)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: isPayable
            ? 'Nenhuma conta a pagar selecionada'
            : 'Nenhuma conta a receber selecionada',
          message: isPayable
            ? 'Selecione pelo menos uma conta a pagar para apagar em grupo'
            : 'Selecione pelo menos uma conta a receber para apagar em grupo',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    const hasReconciled = transactions.some(
      (transaction) =>
        transaction.reconciled == 1 || transaction.reconciled == 2
    );

    if (hasReconciled) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: isPayable
            ? 'Foi selecionado pelo menos uma conta a pagar que já está conciliada'
            : 'Foi selecionado pelo menos uma conta a receber que já está conciliada',
          message: isPayable
            ? 'Selecione apenas contas a pagar que ainda não estão conciliadas para apagar em grupo'
            : 'Selecione apenas contas a receber que ainda não estão conciliadas para apagar em grupo',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    const hasSync = transactions.some(
      (transaction) =>
        transaction.source === 'HOTMART' ||
        transaction.source === 'ASAAS' ||
        transaction.source === 'GURUPAGARME' ||
        transaction.source === 'GURU2PAGARME2' ||
        transaction.source === 'GURUEDUZZ' ||
        transaction.source === 'PROVI' ||
        transaction.source === 'EDUZZ' ||
        transaction.source === 'TICTO' ||
        transaction.source === 'KIWIFY' ||
        transaction.source === 'HUBLA' ||
        transaction.source === 'DOMINIO' ||
        transaction.source === 'TMB'
    );

    if (hasSync && !loggedUInUser.is_iuli_admin) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: isPayable
            ? 'Foi selecionado pelo menos uma conta a pagar que foi criada por sincronização automática'
            : 'Foi selecionado pelo menos uma conta a receber que foi criada por sincronização automática',
          message: isPayable
            ? 'Selecione apenas contas a pagar que não foram criadas por sincronização automática'
            : 'Selecione apenas contas a receber que não foram criadas por sincronização automática',
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }

    setshowModalHandleDestroyGroupTransaction(true);
    setTransactionsToEdit(transactions);
  };

  const submitHandleWriteGroupTransaction = async () => {
    setshowModalHandleWriteGroupTransaction(false);

    const getSuccessDeletedMessage = () => {
      switch (transactionType) {
        case 'PAYABLE':
          return 'Contas a pagar alteradas com sucesso';
        case 'RECEIVABLE':
          return 'Contas a receber alteradas com sucesso';
        default:
          return 'Dados alterados com sucesso';
      }
    };

    const transactionsId = transactionsToEdit.map(
      (transaction) => transaction.id
    );

    const respUpdatePayed = await submitPayed(
      transactionsId,
      !hasPayedHandleWriteGroupTransaction
    );
    if (respUpdatePayed.status === 204) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: getSuccessDeletedMessage(),
          hasTimeout: true,
        })
      );
      getTransactions();
    }
  };

  const submitHandleDestroyGroupTransaction = async () => {
    setshowModalHandleDestroyGroupTransaction(false);

    const getSuccessDeletedMessage = () => {
      switch (transactionType) {
        case 'PAYABLE':
          return 'Contas a pagar removidas com sucesso';
        case 'RECEIVABLE':
          return 'Contas a receber removidas com sucesso';
        default:
          return 'Dados removidos com sucesso';
      }
    };

    const transactionsIds = transactionsToEdit.map(
      (transaction) => transaction.id
    );

    const respDestroyGroupTransaction = await destroyGroupTransaction({
      transactionsIds,
    });

    if (respDestroyGroupTransaction.status === 204) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: getSuccessDeletedMessage(),
          hasTimeout: true,
        })
      );
      getTransactions();
    }
  };

  const handleExportTransactionsXLS = (transactions) => {
    if (isEmpty(transactions)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Nenhuma venda selecionada',
          message: `Selecione pelo menos uma venda para solicitar exportação XLSX`,
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }
    exportTransactionsXLS(transactionType, transactions, currentCompany);
  };

  const getTransactions = debounce(async ({ searchBy: _searchBy } = {}) => {
    setTransactions([]);
    const {
      filter_due_or_payment_date,
      filter_competency_date,
      filter_computed_status,
      filter_categories_ids,
      filter_bank_accounts_ids,
      filter_cost_centers,
      filter_projects,
      filter_transactions_ids,
      filter_externals_ids,
      filter_sources,
      currentPage,
    } = filter;

    let params = `?page=${currentPage + 1}&per_page=${dataPerPage}`;

    switch (transactionType) {
      case 'RECEIVABLE':
        params += '&type=1';
        break;
      case 'PAYABLE':
        params += '&type=2';
        break;
      default:
        break;
    }

    if (filter_due_or_payment_date?.[0] && filter_due_or_payment_date[1]) {
      params += `&due_or_payment_date_from=${filter_due_or_payment_date[0]}&due_or_payment_date_to=${filter_due_or_payment_date[1]}`;
    }
    if (filter_competency_date?.[0] && filter_competency_date[1]) {
      params += `&competency_date_from=${filter_competency_date[0]}&competency_date_to=${filter_competency_date[1]}`;
    }
    if (filter_computed_status) {
      params += `&computed_status=${filter_computed_status}`;
    }
    params = addArrayParams(params, [
      ['transactions_ids', filter_transactions_ids],
      ['external_ids', filter_externals_ids],
      ['cost_centers_ids', filter_cost_centers, 'value'],
      ['projects_ids', filter_projects, 'value'],
      ['categories_ids', filter_categories_ids, 'value'],
      ['bank_accounts_ids', filter_bank_accounts_ids, 'value'],
      ['sources', filter_sources, 'value'],
    ]);
    if (_searchBy || searchBy) {
      params += `&search_by=${_searchBy || searchBy}`;
    }
    if (order?.by && order?.type) {
      params += `&order_by=${order.by}&order_type=${order.type}`;
    }

    try {
      const respFethcTransactionsList = await fetchTransactionsList({
        params,
      });

      setShowModalFilterTransaction(false);
      setPageCount(respFethcTransactionsList.meta.last_page);
      setDataCount(respFethcTransactionsList.meta.total);
      setTransactions(respFethcTransactionsList.data);
      setSummary(respFethcTransactionsList.summary);
    } catch (error) {
      setShowModalFilterTransaction(true);
    }
  }, 1000);

  const getBankAccounts = async () => {
    const { data: dataBankAccounts } = await fetchBankAccountsList();
    const formatedDataBankAccounts = dataBankAccounts.map((bankAccount) => ({
      id: bankAccount.id,
      name: bankAccount.name,
      value: bankAccount.id,
      label: bankAccount.name,
      type: bankAccount.type,
      bank: {
        id: bankAccount.bank.id,
        name: bankAccount.bank.name,
        type: bankAccount.bank.type,
      },
    }));

    setBankAccounts(formatedDataBankAccounts);

    if (filter.filter_bank_accounts_ids === null) {
      if (isPayable) {
        setFilterBankAccountsIdsPayable({
          filter_bank_accounts_ids: formatedDataBankAccounts.filter(
            (bankAccount) => bankAccount.type === 1
          ),
        });
      } else {
        setFilterBankAccountsIdsReceivable({
          filter_bank_accounts_ids: formatedDataBankAccounts.filter(
            (bankAccount) => bankAccount.type === 1
          ),
        });
      }
    }

    setIuliBankAccountId(
      (
        dataBankAccounts.find((bankAccount) => bankAccount.bank.id === 1002) ||
        dataBankAccounts.find((bankAccount) => bankAccount.type === 9) ||
        {}
      ).id || null
    );
  };

  const getCategories = async () => {
    const params = isPayable ? '?type=2' : '?type=1';
    const respCategoriesList = await fetchCategoriesList({ params });
    const dataCategories = respCategoriesList.data || [];
    setCategories(
      dataCategories.map((category) => ({
        ...category,
        label: category.name,
        value: category.id,
      }))
    );
  };

  const getProjects = async () => {
    const respProjects = await fetchProjectsList();
    const dataProjects = respProjects.data || [];
    setProjects(
      dataProjects.map((project) => ({
        ...project,
        label: project.name,
        value: project.id,
      }))
    );
  };

  const getCostCenters = async () => {
    const respCostCenters = await fetchCostCentersList();
    const dataCostCenters = respCostCenters.data || [];
    setCostCenters(
      dataCostCenters.map((costCenter) => ({
        ...costCenter,
        label: costCenter.name,
        value: costCenter.id,
      }))
    );
  };

  const fetchData = async ({ gridApi = {} } = {}) => {
    setInitialized(false);

    await Promise.all([
      getBankAccounts(),
      getCostCenters(),
      getProjects(),
      getCategories(),
    ]);

    setInitialized(true);
  };

  const getFilterParams = () => ({
    comparator(filterLocalDateAtMidnight, cellValue) {
      const dateAsString = cellValue;
      if (dateAsString == null) return -1;
      const dateParts = dateAsString.split('-');
      const cellDate = new Date(
        Number(dateParts[0]),
        Number(dateParts[1]) - 1,
        Number(dateParts[2])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) return 0;
      if (cellDate < filterLocalDateAtMidnight) return -1;
      if (cellDate > filterLocalDateAtMidnight) return 1;
    },
    inRangeInclusive: true,
    browserDatePicker: true,
  });

  const handleImportXLS = () => {
    switch (transactionType) {
      case 'RECEIVABLE':
        history.push(`/admin/receivable/import/`);
        break;
      case 'PAYABLE':
        history.push(`/admin/payable/import/`);
        break;
      default:
        break;
    }
  };

  const handleShowReport = (transactions) => {
    history.push({
      pathname:
        transactionType === 'RECEIVABLE'
          ? '/admin/receivable/report'
          : '/admin/payable/report',
      company: currentCompany,
      user: currentUser?.login?.values?.loggedInUser,
      transactions,
    });
  };

  const goToEditTransaction = (params) => {
    switch (transactionType) {
      case 'RECEIVABLE':
        history.push(`/admin/receivable/edit/${params.data.id}`);
        break;
      case 'PAYABLE':
        history.push(`/admin/payable/edit/${params.data.id}`);
        break;
      default:
        break;
    }
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const submitDeleteTransaction = async () => {
    toggleDeleteModal();

    await destroyTransaction({
      id: deleteTransactionId,
      destroyAll,
    });

    const getSuccessDeletedMessage = () => {
      switch (transactionType) {
        case 'PAYABLE':
          return 'Conta a pagar deletada com sucesso';
        case 'RECEIVABLE':
          return 'Conta a receber deletada com sucesso';
        default:
          return 'Dados deletados com sucesso';
      }
    };

    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: getSuccessDeletedMessage(),
        hasTimeout: true,
      })
    );

    getTransactions();
  };

  const handleDeleteTransaction = async (transactionId) => {
    store.dispatch(applicationActions.hideDialog());
    setDeleteTransactionId(transactionId);
    setShowDeleteModal(true);
  };

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      colId: 'id',
      width: 110,
      checkboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerCheckboxSelection: true,
      cellClass: 'small-cell',
      comparator: () => 0,
      cellRendererFramework: (params) => <small>{params.data.id}</small>,
    },
    {
      headerName: 'ID Externo',
      field: 'external_id',
      colId: 'external_id',
      width: 140,
      filter: true,
      cellClass: 'small-cell',
      comparator: () => 0,
      cellRendererFramework: (params) => (
        <small>{params.data.external_id || ''}</small>
      ),
    },
    {
      headerName: 'Data',
      field: 'due_or_payment_date',
      colId: 'due_or_payment_date',
      // filter: 'agDateColumnFilter',
      filterParams: getFilterParams,
      width: 120,
      tooltipField: 'due_or_payment_date',
      comparator: () => 0,
      cellRendererFramework: (params) =>
        `${formatDateToHumanString(params.data?.due_or_payment_date)}`,
    },
    {
      headerName: '',
      field: 'computed_status',
      colId: 'computed_status',
      sortable: false,
      width: 160,
      cellRendererFramework: (params) => {
        const hasReceipts = params.data.transaction_receipts?.length > 0;
    
        return (
          <>
            <TransactionStatusBadge
              computedStatus={params.data.computed_status}
              transactionType={transactionType}
            />
            <TransactionSourceBadge
              entity={
                transactionType === 'PAYABLE'
                  ? 'Conta a Pagar'
                  : 'Conta a Receber'
              }
              transactionSource={params.data.source}
            />
            <TransactionReconciledBadge
              transactionReconciled={params.data.reconciled}
            />
           {hasReceipts && <FaPaperclip size={20} color="gray" className="ml-1" />}
          </>
        );
      },
    },    
    {
      headerName: 'Categoria',
      field: 'category.name',
      colId: 'category',
      width: 120,
      cellRendererFramework: (params) => params.data.category?.name || '-',
      comparator: () => 0,
    },
    {
      headerName:
        transactionType === 'PAYABLE'
          ? 'Fornecedor'
          : transactionType === 'RECEIVABLE'
          ? 'Cliente'
          : '',
      field:
        transactionType === 'PAYABLE'
          ? 'supplier.company_name'
          : 'client.company_name',
      colId: transactionType === 'PAYABLE' ? 'supplier' : 'client',
      width: 250,
      cellRendererFramework: (params) => {
        if (transactionType === 'PAYABLE') {
          return params.data?.supplier?.company_name || '-';
        }
        if (transactionType === 'RECEIVABLE') {
          return params.data?.client?.company_name || '-';
        }
        return '-';
      },
      comparator: () => 0,
    },
    {
      headerName: 'Valor',
      field: 'transaction_value_or_paid_value',
      colId: 'transaction_value_or_paid_value',
      width: 140,
      cellRendererFramework: (params) => formatMoney(params.value),
      comparator: () => 0,
    },

    {
      headerName:
        transactionType === 'PAYABLE'
          ? 'Pago'
          : transactionType === 'RECEIVABLE'
          ? 'Recebido'
          : '',
      field: 'payed',
      colId: 'paid',
      width: 90,
      cellRendererFramework: (params) => (
        <PermissionGate permissions={permissionButtonUpdate}>
          <CheckboxPayed
            handleCheckboxPayedChange={handleCheckboxPayedChange}
            transaction={params.data}
            disabled={
              params.data.reconciled ||
              params.data.source === 'HOTMART' ||
              params.data.source === 'ASAAS' ||
              params.data.source === 'GURUPAGARME' ||
              params.data.source === 'GURU2PAGARME2' ||
              params.data.source === 'GURUEDUZZ' ||
              params.data.source === 'PROVI' ||
              params.data.source === 'EDUZZ' ||
              params.data.source === 'TICTO' ||
              params.data.source === 'KIWIFY' ||
              params.data.source === 'HUBLA' ||
              params.data.source === 'DOMINIO' ||
              params.data.source === 'TMB'
            }
          />
        </PermissionGate>
      ),
    },

    {
      headerName: 'Ações',
      field: 'transactions',
      width: 150,
      sortable: false,
      cellRendererFramework: (params) => (
        <div className="d-flex">
          <PermissionGate permissions={permissionButtonUpdate}>
            <div className="actions cursor-pointer text-success">
              <Edit
                className="mr-50"
                onClick={() => goToEditTransaction(params)}
              />
            </div>
          </PermissionGate>

          {!params.data.reconciled &&
            params.data.source !== 'HOTMART' &&
            // params.data.source !== 'ASAAS' &&
            params.data.source !== 'GURUPAGARME' &&
            params.data.source !== 'GURU2PAGARME2' &&
            params.data.source !== 'GURUEDUZZ' &&
            params.data.source !== 'PROVI' &&
            params.data.source !== 'EDUZZ' &&
            params.data.source !== 'TICTO' &&
            params.data.source !== 'KIWIFY' &&
            params.data.source !== 'HUBLA' &&
            params.data.source !== 'DOMINIO' &&
            params.data.source !== 'TMB' && (
              <div className="actions cursor-pointer text-danger">
                <PermissionGate permissions={permissionButtonDelete}>
                  <Trash2
                    onClick={() => {
                      if (!params.data.is_deletable) {
                        store.dispatch(
                          applicationActions.toggleDialog({
                            type: 'warning',
                            title: 'Ação não permitida',
                            message: (
                              <>
                                Esta transação está associada a uma venda. Para
                                excluí-la você deve excluir a{' '}
                                <a
                                  href={`/admin/sale/edit/${params.data.sale_id}`}
                                >
                                  venda que a gerou
                                </a>
                              </>
                            ),
                            confirmBtnText: 'Ok',
                            onConfirm: () => {
                              store.dispatch(applicationActions.hideDialog());
                            },
                          })
                        );
                      } else {
                        store.dispatch(
                          applicationActions.toggleDialog({
                            type: 'warning',
                            title: 'Deletar Transação',
                            message:
                              'Você tem certeza que deseja deletar esta transação. Esta ação é irreversível',
                            showCancel: true,
                            reverseButtons: false,
                            cancelBtnBsStyle: 'secondary',
                            confirmBtnBsStyle: 'danger',
                            confirmBtnText: 'Sim, deletar!',
                            cancelBtnText: 'Cancelar',
                            onConfirm: () => {
                              handleDeleteTransaction(params.data.id);
                            },
                          })
                        );
                      }
                    }}
                  />
                </PermissionGate>
              </div>
            )}
        </div>
      ),
    },
    // {
    //   headerName: 'Competência',
    //   field: 'competency_date',
    //   filter: true,
    //   filter: 'agDateColumnFilter',
    //   filterParams: getFilterParams,
    //   width: 150,
    //   cellRendererFramework: (params) =>
    //     `${formatDateToHumanString(params.data?.competency_date)}`,
    //   hide: true,
    //   // width: 0,
    // },
    // {
    //   headerName: 'Categoria',
    //   field: 'category_id',
    //   filter: true,
    //   hide: true,
    //   width: 0,
    // },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSummaryData();
  }, [summary, filter]);

  useEffect(() => {
    getTransactions();
  }, [filter]);

  return (
    <>
      {!initialized && <Loading />}
      <ModalEditGroupTransaction
        transactionsToEdit={transactionsToEdit}
        isPayable={isPayable}
        showModalEditGroupTransaction={showModalEditGroupTransaction}
        setShowModalEditGroupTransaction={setShowModalEditGroupTransaction}
        costCenters={costCenters}
        projects={projects}
        bankAccounts={bankAccounts}
        iuliBankAccountId={iuliBankAccountId}
        categories={categories}
        getTransactions={getTransactions}
      />
      <ModalFilterTransaction
        transactionType={transactionType}
        isPayable={isPayable}
        filter={filter}
        showModalFilterTransaction={showModalFilterTransaction}
        setShowModalFilterTransaction={setShowModalFilterTransaction}
        onFilterSubmit={getTransactions}
        bankAccounts={bankAccounts}
        categories={categories}
        projects={projects}
        costCenters={costCenters}
      />
      <Row className={initialized ? 'app-user-list' : 'd-none'}>
        <Modal
          isOpen={showDeleteModal}
          toggle={toggleDeleteModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={toggleDeleteModal}>Deletar</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Radio
                className="my-2"
                label="Deletar somente este"
                defaultChecked
                name="destroy_all"
                id="destroy_all"
                onChange={() => setDestroyAll(false)}
              />
              <Radio
                label="Deletar este e todos os futuros"
                name="destroy_all"
                id="destroy_all"
                onChange={() => setDestroyAll(true)}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={submitDeleteTransaction}>
              Deletar
            </Button>{' '}
          </ModalFooter>
        </Modal>
        <Col sm="12">
          <TransactionsSummary
            isPayable={isPayable}
            summaryData={summaryData}
          />
          <Card>
            <CardBody>
              {transactions !== null ? (
                <>
                  <NewBasicListTable
                    // sortModel={[
                    //   {
                    //     colId: 'competency_date',
                    //     sort: 'desc', // 'asc'
                    //   },
                    // ]}
                    hasActions
                    hasFilters
                    isActiveFilterByDate={
                      filter.filter_competency_date?.length === 2 ||
                      filter.filter_due_or_payment_date?.length === 2
                    }
                    isActiveFilterByStatus={filter.filter_computed_status}
                    isActiveFilterByProduct={filter.filterProduct}
                    isActiveFilterByBankAccount={filter.filter_bank_account}
                    isActiveFilterBySaleSource={filter.filter_source}
                    isActiveFilterByInvoiceDate={
                      filter.filterInvoiceDate?.length === 2
                    }
                    isActiveFilterByInvoiceStatus={
                      filter.filterInvoiceStatus &&
                      filter.filterInvoiceStatus !== 'all'
                    }
                    filter={filter}
                    setFilters={
                      isPayable ? setFiltersPayable : setFiltersReceivable
                    }
                    searchBy={searchBy}
                    setSearchBy={setSearchBy}
                    order={order}
                    setOrder={setOrder}
                    pageCount={pageCount}
                    dataCount={dataCount}
                    dataPerPage={dataPerPage}
                    setDataPerPage={setDataPerPage}
                    initialized={initialized}
                    handleSummaryData={handleSummaryData}
                    handleEditGroup={handleEditGroupTransaction}
                    handleWriteGroup={handleWriteGroupTransaction}
                    handleDestroyGroup={handleDestroyGroupTransaction}
                    handleExportXLS={handleExportTransactionsXLS}
                    handleImportXLS={handleImportXLS}
                    handleShowReport={handleShowReport}
                    toggleShowModalFilter={() =>
                      setShowModalFilterTransaction(!showModalFilterTransaction)
                    }
                    rowData={transactions}
                    columnDefs={columnDefs}
                    defaultColDef={{
                      sortable: true,
                      resizable: true,
                    }}
                    fetchData={getTransactions}
                    dataType={transactionType}
                  />
                </>
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <div
        className={showModalHandleWriteGroupTransaction ? 'global-dialog' : ''}
      >
        <SweetAlert
          showCancel
          reverseButtons={false}
          cancelBtnBsStyle="secondary"
          confirmBtnBsStyle="danger"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          warning
          title="Baixa em Lote!"
          show={showModalHandleWriteGroupTransaction}
          onConfirm={submitHandleWriteGroupTransaction}
          onClose={() => setshowModalHandleWriteGroupTransaction(false)}
          onCancel={() => setshowModalHandleWriteGroupTransaction(false)}
        >
          <h4 className="sweet-alert-text my-2">
            Confirma que deseja alterar a baixa das transações selecionadas?
          </h4>
        </SweetAlert>
      </div>
      <div
        className={
          showModalHandleDestroyGroupTransaction ? 'global-dialog' : ''
        }
      >
        <SweetAlert
          showCancel
          reverseButtons={false}
          cancelBtnBsStyle="secondary"
          confirmBtnBsStyle="danger"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          warning
          title="Apagar em Lote!"
          show={showModalHandleDestroyGroupTransaction}
          onConfirm={submitHandleDestroyGroupTransaction}
          onClose={() => setshowModalHandleDestroyGroupTransaction(false)}
          onCancel={() => setshowModalHandleDestroyGroupTransaction(false)}
        >
          <h4 className="sweet-alert-text my-2">
            Confirma que deseja apagar as transações selecionadas? Esta ação é
            irreversível.
          </h4>
        </SweetAlert>
      </div>

      <div className={showModalCheckboxPayedChange ? 'global-dialog' : ''}>
        <SweetAlert
          showCancel
          reverseButtons={false}
          cancelBtnBsStyle="secondary"
          confirmBtnBsStyle="danger"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          warning
          title="Alterar Transação!"
          show={showModalCheckboxPayedChange}
          onConfirm={() => {
            setModalCheckboxPayedConfirmed(true);
          }}
          onClose={() => setShowModalCheckboxPayedChange(false)}
          onCancel={() => setShowModalCheckboxPayedChange(false)}
        >
          <h4 className="sweet-alert-text my-2">
            Confirma que deseja alterar a baixa desta transação?
          </h4>
        </SweetAlert>
      </div>
    </>
  );
};

TransactionList.propTypes = {
  companies: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  transactionType: PropTypes.string.isRequired,
  setFilterBankAccountsIdsPayable: PropTypes.func.isRequired,
  setFilterBankAccountsIdsReceivable: PropTypes.func.isRequired,
  setFiltersPayable: PropTypes.func.isRequired,
  setFiltersReceivable: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  companies: state.companies,
  currentUser: state.auth,
});

const mapDispatchToProps = {
  setFilterBankAccountsIdsPayable,
  setFilterBankAccountsIdsReceivable,
  setFiltersPayable,
  setFiltersReceivable,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList);
