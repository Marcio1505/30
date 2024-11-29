import React from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import { Repeat, Trash } from 'react-feather';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../../../utils/formaters';

const OfxSuggestionCard = ({
  conciliationItem,
  handleIgnoreOfxTransaction,
  handleTypeUpdateOfxTransaction,
  handleUnbindReconciledOfxTransaction,
}) => {
  const totalValueOfxTransaction = conciliationItem.ofx_transactions.reduce(
    (accumulator, ofxtransaction) => accumulator + ofxtransaction?.value,
    0
  );

  return (
    <>
      <Row>
        <Col md="12">
          <div className="d-flex justify-content-between align-items-center mb-1 align-items-center">
            <h5 className="mb-0 p-0 pt-1">{conciliationItem.type_text}</h5>
            {(conciliationItem.ofx_transactions[0].status === 0 ||
              conciliationItem.ofx_transactions[0].status === 1) && (
              <Button.Ripple
                className="btn-sm btn mt-1"
                color="info"
                onClick={() => {
                  handleTypeUpdateOfxTransaction(
                    conciliationItem.ofx_transactions[0].id
                  );
                }}
              >
                <Repeat size={14} className="mr-1" />
                Alterar Tipo
              </Button.Ripple>
            )}
          </div>
        </Col>
      </Row>

      {conciliationItem?.ofx_transactions[0].status === 5 && (
        <Row>
          <Col>
            <h6 className="mb-0 p-0 pb-1 font-weight-normal">
              <FormattedMessage id="reconciled.differences" />{' '}
              {formatMoney(
                (totalValueOfxTransaction -
                  conciliationItem?.value_reconciled) *
                  -1 || 0
              )}
            </h6>
          </Col>
        </Row>
      )}

      {conciliationItem?.ofx_transactions.map((ofx_transaction) => (
        <Card
          key={ofx_transaction.id}
          className={`${conciliationItem.class_name} text-white text-bold`}
        >
          <CardBody>
            <Row>
              <Col md="12 mb-1">
                <small className="mh-2">Id: {ofx_transaction.id}</small>
              </Col>
              <Col md="12 mb-1">
                valor:
                <span className="ml-1 font-weight-bold">
                  {formatMoney(ofx_transaction.value || 0)}
                </span>
              </Col>
              <Col md="12 mb-1">
                Data:
                <span className="ml-1 font-weight-bold">
                  {formatDateToHumanString(ofx_transaction.date)}
                </span>
              </Col>
              <Col md="12 mb-1 font-weight-bold">
                {ofx_transaction.description}
              </Col>
            </Row>
            <Row>
              <Col md="12">
                {(conciliationItem.status === 0 ||
                  conciliationItem.status === 1) ? (
                  <Button.Ripple
                    className="btn-sm btn mt-1"
                    color={conciliationItem.status === 1 ? 'danger' : 'warning'}
                    onClick={() => {
                      handleIgnoreOfxTransaction(conciliationItem.id);
                    }}
                  >
                    <Trash size={14} className="mr-1" />
                    Ignorar
                  </Button.Ripple>
                )
              :
                (
                  <Button.Ripple
                    className="btn-sm btn mt-1"
                    color="danger"
                    onClick={() => {
                      handleUnbindReconciledOfxTransaction(conciliationItem.id);
                    }}
                  >
                    <Trash size={14} className="mr-1" />
                    Desconciliar Tudo
                  </Button.Ripple>
                )
              }
              </Col>
            </Row>
          </CardBody>
        </Card>
      ))}
    </>
  );
};

OfxSuggestionCard.propTypes = {
  conciliationItem: PropTypes.shape({
    background_color: PropTypes.string,
    id: PropTypes.number,
    date: PropTypes.string,
    description: PropTypes.string,
    value: PropTypes.number,
    status: PropTypes.number,
    text_status: PropTypes.string,
    status_style: PropTypes.string,
    status_text: PropTypes.string,
    type: PropTypes.number,
    type_text: PropTypes.string,
    class_name: PropTypes.string,
    ofx_transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        date: PropTypes.string,
        description: PropTypes.string,
        value: PropTypes.number,
        status: PropTypes.number,
        status_text: PropTypes.string,
        status_style: PropTypes.string,
        type: PropTypes.number,
        type_text: PropTypes.string,
        class_name: PropTypes.string,
      })
    ),
  }).isRequired,
  handleIgnoreOfxTransaction: PropTypes.func.isRequired,
  handleUnbindReconciledOfxTransaction: PropTypes.func.isRequired,
  handleTypeUpdateOfxTransaction: PropTypes.func.isRequired,
};

export default OfxSuggestionCard;
