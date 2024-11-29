import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, FormGroup, Label, Form } from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import SelectLabelFindConciliation from '../SelectLabelFindConciliation';

import { formatMoney } from '../../../../../../utils/formaters';

import { fetchSelectOfxTransactions } from '../../../../../../services/apis/ofx_transaction.api';

const FindOfxTransactionCard = ({
  conciliationItem,
  submitReconciliationFindOfx,
}) => {
  const intl = useIntl();
  const initialValues = {
    selected_ofx_transactions: [],
    ofx_transaction: conciliationItem,
  };

  const totalValueOfxTransaction = conciliationItem.ofx_transactions.reduce(
    (accumulator, ofxtransaction) => accumulator + ofxtransaction?.value,
    0
  );

  const validationSchema = Yup.object().shape({
    selected_ofx_transactions: Yup.array().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
  });

  const onSubmit = () => {
    submitReconciliationFindOfx(
      conciliationItem,
      formik.values.selected_ofx_transactions
    );
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const getAsyncOptions = async (inputValue) => {
    const params = '?';
    let { data: dataOfxTransactions } = await fetchSelectOfxTransactions({
      bank_account_id: conciliationItem.bank_account_id,
      params: `${params}&type=${conciliationItem.type}&search=${inputValue}&year_month=${conciliationItem.year_month}`,
    });

    dataOfxTransactions = dataOfxTransactions.map((ofxTransaction) => ({
      ...ofxTransaction,
      label: <SelectLabelFindConciliation item={ofxTransaction} />,
    }));
    return new Promise((resolve) =>
      setTimeout(resolve, 1, dataOfxTransactions)
    );
  };

  const loadOptions = useCallback(
    debounce((inputText, callback) => {
      getAsyncOptions(inputText).then((options) => callback(options));
    }, 1000),
    []
  );

  return (
    <Form onSubmit={formik.handleSubmit}>
      {conciliationItem?.ofx_transactions[0].status === 5 && (
        <Row>
          <Col>         
            <FormattedMessage id="reconciled.differences" />{' '}
            {formatMoney(
              (totalValueOfxTransaction - //conciliationItem?.ofx_transactions[0].value -
                conciliationItem?.value_reconciled) *
                -1 || 0
            )}
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
              id="selected_ofx_transactions"
              onBlur={formik.handleBlur}
              loadOptions={loadOptions}
              defaultValue={[]}
              onChange={(options) => {
                const newOfxTransactionsSelected = (options || []).map(
                  (option) => ({
                    ...option,
                  })
                );
                formik.setFieldValue(
                  'selected_ofx_transactions',
                  newOfxTransactionsSelected
                );
              }}
            />
            {formik.errors.selected_ofx_transactions &&
            formik.touched.selected_ofx_transactions ? (
              <div className="invalid-tooltip mt-25">
                {formik.errors.selected_ofx_transactions}
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

FindOfxTransactionCard.propTypes = {
  conciliationItem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    bank_account_id: PropTypes.number.isRequired,
    type: PropTypes.oneOf([1, 2, 3]).isRequired, // 1 = receivable, 2 = payable, 3 = transfer
    year_month: PropTypes.string.isRequired,
    value_reconciled: PropTypes.number.isRequired,
    ofx_transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        status: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired, // 1 = pending, 2 = reconciled, 3 = not reconciled, 4 = not found, 5 = differences
        value: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  submitReconciliationFindOfx: PropTypes.func.isRequired,
};

export default FindOfxTransactionCard;
