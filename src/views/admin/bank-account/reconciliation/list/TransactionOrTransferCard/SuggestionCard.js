import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Card, CardBody } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { Edit, Trash2, CornerUpLeft } from 'react-feather';
import { Link } from 'react-router-dom';

import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../../../utils/formaters';

const SuggestionCard = ({
  conciliationItem,
  submitreconciliation,
  submitUnbind,
}) => {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const totalValueOfxTransaction = conciliationItem.ofx_transactions.reduce(
    (accumulator, ofxtransaction) => accumulator + ofxtransaction?.value,
    0
  );

  const urlSuggestion = (type, id) => {
    let url = '';
    switch (type) {
      case 1:
        url = `/admin/receivable/edit/${id}`;
        break;
      case 2:
        url = `/admin/payable/edit/${id}`;
        break;
      case 3:
      case 4:
        url = `/admin/transfer/edit/${id}`;
        break;
      default:
        break;
    }
    return url;
  };

  const goToEditSuggestion = (type, id) => {
    let url = urlSuggestion(type, id);
    openInNewTab(url);
  };

  return (
    <>
      <Row>
        <Col>
          {conciliationItem?.ofx_transactions[0].status === 4 && (
            <Row>
              <Col>
                <h6 className="mb-0 p-0 pb-1 font-weight-normal">
                  <FormattedMessage id="reconciled.differences" />{' '}
                  {formatMoney(
                    totalValueOfxTransaction -
                      conciliationItem?.value_reconciled || 0
                  )}
                </h6>
              </Col>
            </Row>
          )}

          {/* {console.log('conciliationItem',conciliationItem)} */}
          {conciliationItem?.ofx_transactions[0].status === 6 && (
            <Row>
              <Col>
                <h6 className="mb-0 p-0 pb-1 text-danger text-bold" >
                  {'Falta conciliar alguma transferência no Banco: ' + conciliationItem?.suggestion[0].to_bank_account_id?.name}
                </h6>
              </Col>
            </Row>
          )}

          {conciliationItem?.suggestion.map((suggestion) => (
            <Card
              className={`${suggestion.class_name || conciliationItem.class_name} text-white text-bold`}
              key={suggestion.id}
            >
              <CardBody>
                {(conciliationItem?.ofx_transactions[0].status === 2 ||
                  conciliationItem?.ofx_transactions[0].status === 3 ||
                  conciliationItem?.ofx_transactions[0].status === 4 ||
                  conciliationItem?.ofx_transactions[0].status === 5||
                  conciliationItem?.ofx_transactions[0].status === 6) && (
                  <Row>
                    <Col md="12 mb-1 font-weight-bold">
                      {suggestion.reconciled === 1
                        ? 'Conciliado'
                        : suggestion.reconciled === 2
                        ? 'Parcialmente Conciliado'
                        : suggestion.reconciled === 3
                        ? 'Conciliação Incompleta'
                        : 'Não Conciliado'}
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col md="12 mb-1">
                    <small className="mh-2">
                      Id: 
                      <Link
                        style={{ color: '#ffffff' }}
                        to={urlSuggestion(
                            conciliationItem.type,
                            suggestion.id
                          )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {' ' + suggestion.id}
                      </Link>
                    </small>
                  </Col>
                  <Col md="12 mb-1">
                    valor:
                    <span className="ml-1 font-weight-bold">
                      {formatMoney(suggestion.value || 0)}
                    </span>
                  </Col>
                  <Col md="12 mb-1">
                    Data:
                    <span className="ml-1 font-weight-bold">
                      {formatDateToHumanString(suggestion.date)}
                    </span>
                  </Col>
                  <Col md="12 mb-1">
                    {suggestion.type === 1
                      ? 'Cliente:'
                      : suggestion.type === 2
                      ? 'Fornecedor:'
                      : suggestion.type === 3
                      ? 'Banco Origem:'
                      : suggestion.type === 4
                      ? 'Banco Destino:'
                      : 'Não Identificado: '}
                    <span className="ml-1 font-weight-bold">
                      {suggestion.to_bank_account_id?.name ||
                        suggestion.to_company_name?.company_name}
                    </span>
                  </Col>
                  <Col md="12 mb-1 font-weight-bold">
                    {suggestion.description}
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    {conciliationItem.ofx_transactions[0].status === 1 && (
                      <Button.Ripple
                        className="btn-sm btn mt-1"
                        color="primary"
                        onClick={() => {
                          submitreconciliation(conciliationItem, null);
                        }}
                      >
                        <CornerUpLeft size={14} className="mr-1" />
                        <FormattedMessage id="button.reconcilliate" />
                      </Button.Ripple>
                    )}
                  </Col>
                  <Col md="6">
                    {conciliationItem.ofx_transactions[0].status === 1 && (
                      <Button.Ripple
                        className="btn-sm btn mt-1"
                        color="info"
                        onClick={() =>
                          goToEditSuggestion(
                            conciliationItem.type,
                            suggestion.id
                          )
                        }
                      >
                        <Edit size={14} className="mr-1" />
                        <FormattedMessage id="button.edit" />
                      </Button.Ripple>
                    )}
                  </Col>
                  <Col md="6">
                    {(conciliationItem.ofx_transactions[0].status === 2 ||
                      conciliationItem.ofx_transactions[0].status === 3 ||
                      conciliationItem.ofx_transactions[0].status === 4 ||
                      conciliationItem.ofx_transactions[0].status === 5 ||
                      conciliationItem.ofx_transactions[0].status === 6) && (
                      <Button.Ripple
                        className="btn-sm btn mt-1"
                        color="danger"
                        onClick={() => {
                          submitUnbind(suggestion);
                        }}
                      >
                        <Trash2 size={14} className="mr-1" />
                        <FormattedMessage id="button.reconcilliate.desvinculed" />
                      </Button.Ripple>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}
        </Col>
      </Row>
    </>
  );
};

SuggestionCard.propTypes = {
  conciliationItem: PropTypes.shape({
    type: PropTypes.oneOf([1, 2, 3]).isRequired, // 1 = receivable, 2 = payable, 3 = transfer
    status: PropTypes.oneOf([null, 0, 1, 2, 3, 4, 5, 6]).isRequired,
    company_id: PropTypes.number.isRequired,
    value_reconciled: PropTypes.number.isRequired,
    class_name: PropTypes.string.isRequired,
    suggestion: PropTypes.PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        class_name: PropTypes.string.isRequired,
      })
    ),
    ofx_transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        status: PropTypes.oneOf([null, 0, 1, 2, 3, 4, 5, 6]).isRequired,
      })
    ),
  }).isRequired,
  submitreconciliation: PropTypes.func.isRequired,
  submitUnbind: PropTypes.func.isRequired,
};

export default SuggestionCard;
