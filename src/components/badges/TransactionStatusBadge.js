import React, { useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { PopoverHeader, PopoverBody, Popover } from 'reactstrap';
import { Check, X } from 'react-feather';

const TransactionStatusBadge = ({ computedStatus, transactionType }) => {
  const [popoverTransactionStatusOpen, setPopoverTransactionStatusOpen] =
    useState(false);

  const togglePopoverSaleSource = () =>
    setPopoverTransactionStatusOpen(!popoverTransactionStatusOpen);

  const popoverSaleSourceRef = useRef();

  return (
    <>
      {computedStatus === 1 && (
        <>
          <div
            className="badge badge-pill badge-light-success mr-1"
            ref={popoverSaleSourceRef}
            onMouseEnter={() => setPopoverTransactionStatusOpen(true)}
            onMouseLeave={() => setPopoverTransactionStatusOpen(false)}
          >
            <Check size={16} />
          </div>
          <Popover
            placement="top"
            isOpen={popoverTransactionStatusOpen}
            target={popoverSaleSourceRef}
            toggle={togglePopoverSaleSource}
          >
            <PopoverHeader>
              {transactionType === 'RECEIVABLE' ? 'Recebido' : 'Pago'}
            </PopoverHeader>
            <PopoverBody>
              {transactionType === 'RECEIVABLE'
                ? 'Conta recebida'
                : 'Conta paga'}
            </PopoverBody>
          </Popover>
        </>
      )}
      {computedStatus === 3 && (
        <>
          <div
            className="badge badge-pill badge-light-danger mr-1"
            ref={popoverSaleSourceRef}
            onMouseEnter={() => setPopoverTransactionStatusOpen(true)}
            onMouseLeave={() => setPopoverTransactionStatusOpen(false)}
          >
            <X size={16} />
          </div>
          <Popover
            placement="top"
            isOpen={popoverTransactionStatusOpen}
            target={popoverSaleSourceRef}
            toggle={togglePopoverSaleSource}
          >
            <PopoverHeader>Em atraso</PopoverHeader>
            <PopoverBody>
              {transactionType === 'RECEIVABLE'
                ? 'Conta a receber em atraso'
                : 'Conta a pagar em atraso'}
            </PopoverBody>
          </Popover>
        </>
      )}
    </>
  );
};

TransactionStatusBadge.propTypes = {
  computedStatus: PropTypes.oneOfType([PropTypes.string || PropTypes.number]),
  transactionType: PropTypes.oneOf(['PAYABLE', 'RECEIVABLE']).isRequired,
};

TransactionStatusBadge.defaultProps = {
  computedStatus: null,
};

export default TransactionStatusBadge;
