import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';
import { useIntl } from 'react-intl';

import BankAccountBalance from './BankAccountBalance';

const BankAccounts = ({ bankAccountsInfo }) => {
  const intl = useIntl();
  const bankAccounts = bankAccountsInfo.map((bankAccount) => ({
    avatar: '',
    name: bankAccount.name,
    id: bankAccount.id,
    bank_image: bankAccount.bank.image,
  }));

  return (
    <Card className="card-browser-states">
      <CardHeader>
        <div>
          <CardTitle tag="h4">
            {intl.formatMessage({ id: 'dashboard.bank_accounts.title' })}
          </CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        {bankAccounts.map((bankAccount, index) => (
          <div
            key={bankAccount.id}
            className={`browser-states ${index ? 'my-3' : 'mt-1 mb-3'}`}
          >
            <BankAccountBalance bankAccount={bankAccount} />
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

BankAccounts.propTypes = {
  bankAccountsInfo: PropTypes.array.isRequired,
};

BankAccounts.defaultProps = {};

export default BankAccounts;
