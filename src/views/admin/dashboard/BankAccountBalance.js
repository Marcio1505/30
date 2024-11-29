import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Media } from 'reactstrap';
import { Eye, EyeOff } from 'react-feather';
import ContentLoader from 'react-content-loader';

import { formatMoney } from '../../../utils/formaters';
import { getCurrentBalance } from '../../../services/apis/bank_account.api';

const BalanceLoading = () => (
  <ContentLoader viewBox="0 0 100 20" height={20} width={100}>
    <rect x="0" y="0" rx="0" ry="0" width="100" height="20" />
  </ContentLoader>
);

const BankAccountBalance = ({ bankAccount }) => {
  const [showCurrentBalance, setShowCurrentBalance] = useState(false);
  const [currentBankAccountBalance, setCurrentBankAccountBalance] =
    useState(null);
  const [isLoadingCurrentBalance, setIsLoadingCurrentBalance] = useState(null);

  const toggleShowCurrentBalance = async () => {
    if (currentBankAccountBalance === null) {
      setIsLoadingCurrentBalance(true);
      const response = await getCurrentBalance({
        id: bankAccount.id,
        toggleLoading: false,
      });
      setCurrentBankAccountBalance(response.data.current_balance);
      setIsLoadingCurrentBalance(false);
    }
    setShowCurrentBalance(!showCurrentBalance);
  };

  return (
    <>
      <Media>
        <div className="d-flex">
          <Link to={`admin/bank-account/edit/${bankAccount.id}`}>
            <img
              className="rounded mr-1"
              src={
                bankAccount.bank_image ||
                'data:image/png;base64,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'
              }
              height="50"
              alt="bnk-img"
            />
          </Link>
          <div className="d-flex flex-column justify-content-between">
            <h5 className="text-left mb-0">{bankAccount.name}</h5>
            <Link to={`admin/bank-account/statement/${bankAccount.id}`}>
              {showCurrentBalance ? (
                <h4
                  className={`align-self-center mb-0 ${
                    currentBankAccountBalance >= 0
                      ? 'text-success'
                      : 'text-danger'
                  }`}
                >
                  {formatMoney(
                    parseFloat(currentBankAccountBalance) || 0,
                    true
                  )}
                </h4>
              ) : (
                <h4 className="align-self-center mb-0">
                  {isLoadingCurrentBalance ? (
                    <BalanceLoading />
                  ) : (
                    <>
                      R$ <span className="blurry-text">0.000,00</span>
                    </>
                  )}
                </h4>
              )}
            </Link>
          </div>
        </div>
      </Media>
      <div className="d-flex align-items-center">
        <div className="font-weight-bold text-body-heading mr-1">
          {!isLoadingCurrentBalance && (
            <a onClick={toggleShowCurrentBalance}>
              {showCurrentBalance ? <Eye size={25} /> : <EyeOff size={25} />}
            </a>
          )}
        </div>
      </div>
    </>
  );
};

BankAccountBalance.propTypes = {
  bankAccount: PropTypes.object.isRequired,
};

BankAccountBalance.defaultProps = {};

export default BankAccountBalance;
