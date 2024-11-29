import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, FormGroup, Form } from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import SelectLabelFindConciliation from '../SelectLabelFindConciliation';

import { formatMoney } from '../../../../../../utils/formaters';

import { fetchSelectTransactions } from '../../../../../../services/apis/transaction.api';
import { fetchSelectTransfers } from '../../../../../../services/apis/transfers.api';

const FindTransactionTransferCard = ({
  conciliationItem,
  submitreconciliationFind,
}) => {
  const intl = useIntl();
  const initialValues = {
    transactions_id: [],
    ofx_transaction: conciliationItem,
  };

  const totalValueOfxTransaction = conciliationItem.ofx_transactions.reduce(
    (accumulator, ofxtransaction) => accumulator + ofxtransaction?.value,
    0
  );

  const validationSchema = Yup.object().shape({
    transactions_id: Yup.array().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
  });

  const onSubmit = () => {
    submitreconciliationFind(conciliationItem, formik.values.transactions_id);
    formik.resetForm({
      values: initialValues,
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const getAsyncOptions = async (inputValue) => {
    if (conciliationItem.type === 1 || conciliationItem.type === 2) {
      let { data: dataTransactions } = await fetchSelectTransactions({
        params: `?type=${conciliationItem.type}&bank_account_id=${conciliationItem.bank_account_id}&search=${inputValue}&year_month=${conciliationItem.year_month}`,
      });
      dataTransactions = dataTransactions.map((transaction) => ({
        ...transaction,
        label: <SelectLabelFindConciliation item={transaction} />,
      }));
      return new Promise((resolve) => setTimeout(resolve, 1, dataTransactions));
    }
    if (conciliationItem.type === 3 || conciliationItem.type === 4) {
      let { data: dataTransfers } = await fetchSelectTransfers({
        params: `?type=${conciliationItem.type}&bank_account_id=${conciliationItem.bank_account_id}&search=${inputValue}&year_month=${conciliationItem.year_month}`,
      });
      dataTransfers = dataTransfers.map((transfer) => ({
        ...transfer,
        label: <SelectLabelFindConciliation item={transfer} />,
      }));
      return new Promise((resolve) => setTimeout(resolve, 1, dataTransfers));
    }
    return null;
  };

  const loadOptions = useCallback(
    debounce((inputText, callback) => {
      getAsyncOptions(inputText).then((options) => callback(options));
    }, 1000),
    []
  );

  return (
    <Form onSubmit={formik.handleSubmit}>
      {conciliationItem?.ofx_transactions[0].status === 4 && (
        <Row>
          <Col>
            <h6 className="mb-0 p-0 pb-1 font-weight-normal">
              <FormattedMessage id="reconciled.differences" />{' '}
              {formatMoney(
                totalValueOfxTransaction - conciliationItem?.value_reconciled ||
                  0
              )}
            </h6>
          </Col>
        </Row>
      )}
      <Row>
        <Col className="mt-1" sm="12">
          <FormGroup>
            <AsyncSelect
              isMulti
              className="React"
              classNamePrefix="select"
              id="transactions_id"
              onBlur={formik.handleBlur}
              loadOptions={loadOptions}
              defaultValue={[]}
              value={formik.values.transactions_id}
              onChange={(options) => {
                const newTransactionsIds = (options || []).map((option) => ({
                  ...option,
                }));
                formik.setFieldValue('transactions_id', newTransactionsIds);
              }}
            />
            {formik.errors.transactions_id && formik.touched.transactions_id ? (
              <div className="invalid-tooltip mt-25">
                {formik.errors.transactions_id}
              </div>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col className="d-flex justify-content-end flex-wrap" sm="12">
          <Button.Ripple className="mt-1" color="primary" type="submit">
            <FormattedMessage id="button.reconcilliate" />
          </Button.Ripple>
        </Col>
      </Row>
    </Form>
  );
};

FindTransactionTransferCard.propTypes = {
  conciliationItem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    bank_account_id: PropTypes.number.isRequired,
    ofx_transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
        status: PropTypes.number.isRequired,
      })
    ).isRequired,
    type: PropTypes.number.isRequired,
    year_month: PropTypes.string.isRequired,
    value_reconciled: PropTypes.number.isRequired,
  }).isRequired,
  submitreconciliationFind: PropTypes.func.isRequired,
};

export default FindTransactionTransferCard;
