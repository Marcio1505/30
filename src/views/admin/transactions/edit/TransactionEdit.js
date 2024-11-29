import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom-v5-compat';

import SweetAlert from 'react-bootstrap-sweetalert';
import TransactionForm from './TransactionForm';
import AlertIcon from '../../../../components/alerts/AlertIcon';

import { store } from '../../../../redux/storeConfig/store';
import { thunkCreateOrUpdateReceivable } from '../../../../new.redux/receivables/receivables.thunks';
import { thunkCreateOrUpdatePayable } from '../../../../new.redux/payables/payables.thunks';

import { fetchCategoriesList } from '../../../../services/apis/category.api';
import { fetchSuppliersList } from '../../../../services/apis/supplier.api';
import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';
import { showTransaction } from '../../../../services/apis/transaction.api';
import { showOfxTransaction } from '../../../../services/apis/ofx_transaction.api';
import { formatCpfCnpj } from '../../../../utils/formaters';

import PermissionGate from '../../../../PermissionGate';

const TransactionEdit = ({
  transactionId,
  transactionType,
  currentCompanyId,
  // eslint-disable-next-line no-shadow
  thunkCreateOrUpdatePayable,
  // eslint-disable-next-line no-shadow
  thunkCreateOrUpdateReceivable,
}) => {
  const history = useHistory();
  const intl = useIntl();
  const [initialized, setInitialized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transactionSubcategories, setTransactionSubcategories] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transaction, setTransaction] = useState({});
  const [saleId, setSaleId] = useState(null);
  const [iuliBankAccountId, setIuliBankAccountId] = useState(null);
  const [ofxTransaction, setOfxTransaction] = useState({});
  const [margemOfxTransaction, setMargemOfxTransaction] = useState(0);

  const [showModalSubmit, setshowModalSubmit] = useState(false);
  const currentCompany = store.getState()?.companies?.currentCompany;

  const [searchParams] = useSearchParams();
  const ofxTransactionId = searchParams.get('ofxTransactionId');

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const submitTransaction = async () => {
    setshowModalSubmit(false);
    submitForm(false);
  };

  const onSubmit = async () => {
    if (ofxTransaction.id) {
      setshowModalSubmit(true);
    } else {
      submitTransaction();
    }
  };

  let permissionForm = '';

  if (transactionType === 'payable') {
    if (transactionId) {
      permissionForm = 'payables.show';
    } else {
      permissionForm = 'companies.payables.store';
    }
  } else if (transactionType === 'receivable') {
    if (transactionId) {
      permissionForm = 'receivables.show';
    } else {
      permissionForm = 'companies.receivables.store';
    }
  }

  const setSubcategoryOptions = async () => {
    const params =
      transactionType === 'payable'
        ? '?type=2'
        : transactionType === 'receivable'
        ? '?type=1'
        : '';

    let dataSubcategories = [];

    const responseCategoriesList = await fetchCategoriesList({ params });
    dataSubcategories = responseCategoriesList.data;

    setTransactionSubcategories(
      dataSubcategories.map((subcategory) => ({
        value: subcategory.id,
        label: subcategory.name,
      }))
    );
  };

  const submitForm = async (confirmed) => {
    if (transaction.repeat) {
      if (confirmed) {
        toggleModal();
      } else {
        formik.setSubmitting(false);
        toggleModal();
        return false;
      }
    }
    if (ofxTransactionId) {
      if (transactionType === 'receivable') {
        if (await thunkCreateOrUpdateReceivable(transactionId, formik)) {
          history.push(
            `/admin/bank-account/${ofxTransaction.bank_account_id}/reconciliation`
          );
        }
      } else if (transactionType === 'payable') {
        if (await thunkCreateOrUpdatePayable(transactionId, formik)) {
          history.push(
            `/admin/bank-account/${ofxTransaction.bank_account_id}/reconciliation`
          );
        }
      }
    } else if (transactionType === 'receivable') {
      if (await thunkCreateOrUpdateReceivable(transactionId, formik)) {
        history.push(`/admin/receivable/list`);
      }
    } else if (transactionType === 'payable') {
      if (await thunkCreateOrUpdatePayable(transactionId, formik)) {
        history.push(`/admin/payable/list`);
      }
    }
    return true;
  };

  const projects = (transaction.projects || []).map((project) => ({
    ...project,
    rowId: project.id,
  }));

  const cost_centers = (transaction.cost_centers || []).map((cost_center) => ({
    ...cost_center,
    rowId: cost_center.id,
  }));

  const initialValues = {
    bank_account_id:
      ofxTransaction.bank_account_id || transaction.bank_account_id || '',
    to_company_id: transaction.to_company_id || '',
    client: transaction.client || {},
    category_id: transaction.category_id || '',
    due_date: ofxTransaction.date || transaction.due_date || '',
    competency_date: ofxTransaction.date || transaction.competency_date || '',
    payment_date: ofxTransaction.date || transaction.payment_date || '',
    description: ofxTransaction.description || transaction.description || '',
    fiscal_document_text: transaction.fiscal_document_text || '',
    payment_info: transaction.payment_info || '',
    transaction_value:
      margemOfxTransaction || transaction.transaction_value || 0,
    interest_value: transaction.interest_value || 0,
    payed_value: margemOfxTransaction || transaction.payed_value || 0,
    payed: ofxTransaction.id ? 1 : transaction.payed || 0,
    repeat: transaction.repeat || 0,
    frequency: transaction.frequency || 0,
    occurrence: transaction.occurrence || 0,
    show_dfc: transactionId ? transaction.show_dfc : 1,
    show_dre: transactionId ? transaction.show_dre : 1,
    status: transaction.status || 1,
    source: transaction.source || '',
    projects,
    cost_centers,
    edit_all: 0,
    reconciled: ofxTransaction.id ? 1 : transaction.reconciled || 0,
    ofx_transaction_id: ofxTransaction.id ? ofxTransaction.id : 0,
    files: [],
    transaction_receipts: transaction.transaction_receipts || [],
    external_id: transaction.external_id || '',
  };

  const validationSchema = Yup.object().shape({
    to_company_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    bank_account_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    category_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    due_date: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    competency_date: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    transaction_value: Yup.number()
      .positive(intl.formatMessage({ id: 'errors.positive' }))
      .required(intl.formatMessage({ id: 'errors.required' })),
    fiscal_document_text: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    payment_info: Yup.string().max(
      255,
      intl.formatMessage({ id: 'errors.max' }, { max: 255 })
    ),
    payed_value: Yup.string().when('payed', {
      is: (payed) => payed,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    payment_date: Yup.string().when('payed', {
      is: (payed) => payed,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  const getInitialData = async () => {
    await setSubcategoryOptions();

    const { data: dataBankAccounts } = await fetchBankAccountsList();
    setBankAccounts(
      dataBankAccounts.map((bankAccount) => ({
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
      }))
    );

    setIuliBankAccountId(
      (dataBankAccounts.find((bankAccount) => bankAccount.is_iuli) || {}).id
    );

    switch (transactionType) {
      case 'payable':
        const { data: dataSuppliers } = await fetchSuppliersList();
        setSuppliers(
          dataSuppliers.map((supplier) => ({
            value: supplier.id,
            label: `${supplier.company_name} ${
              supplier.document ? `- ${formatCpfCnpj(supplier.document)}` : ''
            }`,
            category_id: supplier.category_id,
          }))
        );
        break;

      case 'receivable':
        // const { data: dataClients } = await fetchSelectClients();
        // setClients(
        //   dataClients.map((client) => ({
        //     value: client.id,
        //     label: `${client.company_name} ${
        //       client.document ? `- ${formatCpfCnpj(client.document)}` : ''
        //     }`,
        //     category_id: client.category_id,
        //   }))
        // );
        break;

      default:
        break;
    }

    let dataTransaction = {};
    if (transactionId) {
      const res = await showTransaction({ id: transactionId });
      dataTransaction = res.data;
      switch (transactionType) {
        case 'payable':
          if (dataTransaction.type !== 2) {
            history.push('/404');
          }
          break;
        case 'receivable':
          if (dataTransaction.type !== 1) {
            history.push('/404');
          }
          break;
        default:
          break;
      }
    }
    setTransaction(dataTransaction);
    setSaleId(dataTransaction.sale_id);
    if (ofxTransactionId) {
      setInitialized(false);
      const res = await showOfxTransaction({ id: ofxTransactionId });
      const dataOfxTransaction = res.data;

      // console.log(dataOfxTransaction);
      // TO DO: verificar se transacao e ofx tem mesmo tipo
      // switch (transactionType) {
      //   case 'payable':
      //     if (dataTransaction.type !== 2) {
      //       history.push('/404');
      //     }
      //     break;
      //   case 'receivable':
      //     if (dataTransaction.type !== 1) {
      //       history.push('/404');
      //     }
      //     break;
      //   default:
      //     break;
      // }

      setOfxTransaction(dataOfxTransaction);

      if (dataOfxTransaction.type == 1) {
        setMargemOfxTransaction(dataOfxTransaction.margem_value);
      } else if (dataOfxTransaction.type == 2) {
        setMargemOfxTransaction(dataOfxTransaction.margem_value);
      }
      setInitialized(true);
    } else {
      setOfxTransaction({});
    }
    setInitialized(true);
  };

  useEffect(() => {
    getInitialData();
  }, [transactionType, transactionId, ofxTransactionId]);

  useEffect(() => {
    if (
      transaction?.company_id &&
      currentCompanyId !== transaction.company_id
    ) {
      history.push(`/admin/${transactionType}/list`);
    }
  }, [currentCompanyId, history, transaction.company_id, transactionType]);

  return (
    <>
      <PermissionGate permissions={permissionForm}>
        {initialized && (
          <>
            {transaction.created_by_message && (
              <AlertIcon type="warning">
                {transaction.created_by_message}
              </AlertIcon>
            )}
            <TransactionForm
              transactionId={transactionId}
              transaction={transaction}
              ofxTransaction={ofxTransaction}
              saleId={saleId}
              transactionType={transactionType}
              showModal={showModal}
              toggleModal={toggleModal}
              submitForm={submitForm}
              formik={formik}
              suppliers={suppliers}
              bankAccounts={bankAccounts}
              iuliBankAccountId={iuliBankAccountId}
              transactionSubcategories={transactionSubcategories}
            />
          </>
        )}

        <div className={showModalSubmit ? 'global-dialog' : ''}>
          <SweetAlert
            showCancel
            reverseButtons={false}
            cancelBtnBsStyle="secondary"
            confirmBtnBsStyle="danger"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            warning
            title="Criar!"
            show={showModalSubmit}
            onConfirm={submitTransaction}
            onClose={() => setshowModalSubmit(false)}
            onCancel={() => setshowModalSubmit(false)}
          >
            <h4 className="sweet-alert-text my-2">
              A conciliação bancária será efetuada automaticamente. Deseja
              continuar?
            </h4>
          </SweetAlert>
        </div>
      </PermissionGate>
    </>
  );
};

TransactionEdit.propTypes = {
  transactionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  transactionType: PropTypes.string.isRequired,
  currentCompanyId: PropTypes.number.isRequired,
  thunkCreateOrUpdateReceivable: PropTypes.func.isRequired,
  thunkCreateOrUpdatePayable: PropTypes.func.isRequired,
};

TransactionEdit.defaultProps = {
  transactionId: null,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

const mapDispatchToProps = {
  thunkCreateOrUpdatePayable,
  thunkCreateOrUpdateReceivable,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionEdit);
