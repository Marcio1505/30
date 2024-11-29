import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, FormGroup } from 'reactstrap';

import { useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../../../utils/formaters';
import TextField from '../../../../../../components/inputs/TextField';

const NewTransactionTransferCard = ({ conciliationItem }) => {
  const intl = useIntl();
  const history = useHistory();

  let linkToNewTransactionOrTransfer = `/admin/transfer/edit?ofxTransactionId=${conciliationItem.ofx_transactions[0].id}`;

  if (conciliationItem.type === 1) {
    linkToNewTransactionOrTransfer = `/admin/receivable/edit?ofxTransactionId=${conciliationItem.ofx_transactions[0].id}`;
  }
  if (conciliationItem.type === 2) {
    linkToNewTransactionOrTransfer = `/admin/payable/edit?ofxTransactionId=${conciliationItem.ofx_transactions[0].id}`;
  }

  const totalValueOfxTransaction = conciliationItem.ofx_transactions.reduce(
    (accumulator, ofxtransaction) => accumulator + ofxtransaction?.value,
    0
  );

  const valueToReconciliate =
    totalValueOfxTransaction !== conciliationItem?.value_reconciled
      ? formatMoney(
          totalValueOfxTransaction - conciliationItem?.value_reconciled
        )
      : formatMoney(totalValueOfxTransaction);

  return (
    <>
      {conciliationItem?.ofx_transactions[0].status === 4 && (
        <Row>
          <Col>
            <h6 className="mb-0 p-0 pb-1 font-weight-normal">
              <FormattedMessage id="reconciled.differences" />{' '}
              {formatMoney(valueToReconciliate)}
            </h6>
          </Col>
        </Row>
      )}
      <Row>
        <Col sm="12">
          <TextField
            readOnly
            id="description"
            required
            label={intl.formatMessage({ id: 'transactions.description' })}
            value={conciliationItem?.ofx_transactions[0].description}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="12">
          <FormGroup>
            <TextField
              readOnly
              id="due_date"
              required
              value={formatDateToHumanString(
                conciliationItem?.ofx_transactions[0].date
              )}
              label={intl.formatMessage({
                id: 'transactions.due_date',
              })}
            />
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <TextField
            readOnly
            id="transaction_value"
            required
            value={valueToReconciliate}
            label={intl.formatMessage({
              id: 'transactions.transaction_value',
            })}
          />
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end flex-wrap" sm="12">
          <Button.Ripple
            className="mt-1"
            color="primary"
            onClick={() => history.push(linkToNewTransactionOrTransfer)}
          >
            <FormattedMessage id="button.reconcilliate.create" />
          </Button.Ripple>
        </Col>
      </Row>
    </>
  );
};

NewTransactionTransferCard.propTypes = {
  conciliationItem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    value_reconciled: PropTypes.number.isRequired,
    ofx_transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default NewTransactionTransferCard;
