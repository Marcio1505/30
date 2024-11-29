import {
  updateTransaction,
  createTransaction,
} from '../../services/apis/transaction.api';
import { formatDateToString } from '../../utils/formaters';

import { applicationActions } from '../actions';

const mountPayload = (transactionId, formik) => ({
  transaction: {
    ...(transactionId && { id: transactionId }),
    bank_account_id: formik.values.bank_account_id,
    to_company_id: formik.values.to_company_id,
    category_id: formik.values.category_id,
    due_date:
      typeof formik.values.due_date === 'string'
        ? formik.values.due_date
        : formatDateToString(formik.values.due_date[0]),
    competency_date:
      typeof formik.values.competency_date === 'string'
        ? formik.values.competency_date
        : formatDateToString(formik.values.competency_date[0]),
    payment_date:
      typeof formik.values.payment_date === 'string'
        ? formik.values.payment_date
        : formatDateToString(formik.values.payment_date[0]),
    description: formik.values.description,
    fiscal_document_text: formik.values.fiscal_document_text,
    payment_info: formik.values.payment_info,
    transaction_value: formik.values.transaction_value,
    interest_value: formik.values.payed_value
      ? formik.values.payed_value - formik.values.transaction_value
      : null,
    // total_value: formik.values.transaction_value + formik.values.interest_value,
    payed: formik.values.payed,
    payed_value: formik.values.payed_value,
    repeat: formik.values.repeat,
    show_dfc: formik.values.show_dfc,
    show_dre: formik.values.show_dre,
    occurrences: formik.values.occurrences,
    frequency: formik.values.frequency,
    type: 1,
    status: formik.values.status,
    projects: formik.values.projects,
    cost_centers: formik.values.cost_centers,
    edit_all: formik.values.edit_all,
    reconciled: formik.values.reconciled,
    ofx_transaction_id: formik.values.ofx_transaction_id,
    receipts: formik.values.files,
  },
});

export const thunkCreateOrUpdateReceivable =
  (transactionId, formik) => async (dispatch) => {
    try {
      if (transactionId) {
        await updateTransaction(mountPayload(transactionId, formik));
        dispatch(
          applicationActions.toggleDialog({
            type: 'success',
            title: 'Sucesso',
            message: 'Conta a receber atualizada com sucesso',
            hasTimeout: true,
          })
        );
      } else {
        await createTransaction(mountPayload(transactionId, formik));
        formik.setSubmitting(false);
        dispatch(
          applicationActions.toggleDialog({
            type: 'success',
            title: 'Sucesso',
            message: 'Conta a receber criada com sucesso',
            hasTimeout: true,
          })
        );
      }
      return true;
    } catch (error) {
      formik.setSubmitting(false);
      return false;
    }
  };
