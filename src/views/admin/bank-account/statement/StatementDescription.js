import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const StatementDescription = ({ statement }) => {
  const getStatementCompanyName = () =>
    statement.client?.company_name || statement.supplier?.company_name;

  return (
    <span>
      {statement.statement_type === 1 ? (
        <>
          {Boolean(statement.type === 1) && (
            <Link
              className="text-success"
              to={`/admin/receivable/edit/${statement.id}`}
            >
              <p className="font-weight-bold mb-0">
                {getStatementCompanyName(statement)}
              </p>
              <small>{statement.description}</small>
            </Link>
          )}
          {Boolean(statement.type === 2) && (
            <Link
              className="text-danger"
              to={`/admin/payable/edit/${statement.id}`}
            >
              <p className="font-weight-bold mb-0">
                {getStatementCompanyName(statement)}
              </p>
              <small>{statement.description}</small>
            </Link>
          )}
        </>
      ) : (
        <>
          {Boolean(statement.statement_type === 2) && (
            <Link
              className={`${
                statement.type === 1 ? 'text-success' : 'text-danger'
              }`}
              to={`/admin/transfer/edit/${statement.id}`}
            >
              <p className="font-weight-bold">
                {statement.type === 1 ? (
                  <span>{`Transferência recebida de ${statement.bank_account.name}`}</span>
                ) : (
                  <span>
                    {`Transferência feita para ${statement.to_bank_account.name}`}
                  </span>
                )}
              </p>
              <small>{statement.description}</small>
            </Link>
          )}
        </>
      )}
    </span>
  );
};

StatementDescription.propTypes = {
  statement: propTypes.shape({
    id: propTypes.number,
    type: propTypes.number,
    statement_type: propTypes.number,
    company_name: propTypes.string,
    description: propTypes.string,
    reconciled: propTypes.number,
    transfer_bank_reconciled: propTypes.arrayOf({
      bank_account_id: propTypes.number,
    }),
    to_bank_account:
      propTypes.shape({
        name: propTypes.string,
      }) || null,
    bank_account:
      propTypes.shape({
        name: propTypes.string,
      }) || null,
  }).isRequired,
};

export default StatementDescription;
