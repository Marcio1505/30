import React, { useState, useRef } from 'react';
import propTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Badge, Button, PopoverHeader, PopoverBody, Popover } from 'reactstrap';
import { Check, X } from 'react-feather';
import { FaUndoAlt } from 'react-icons/fa';

import { getReconciledInformation } from '../../../../utils/sourceUtils';

import PermissionGate from '../../../../PermissionGate';

const StatementStatusBadge = ({
  submitDesvinculed,
  statement,
  bank_account_id,
}) => {
  const [
    popoverTransactionReconciledOpen,
    setPopoverTransactionReconciledOpen,
  ] = useState(false);
  const [popoverButtonDesvinculedOpen, setPopoverButtonDesvinculedOpen] =
    useState(false);

  const togglePopovertransactionReconciled = () =>
    setPopoverTransactionReconciledOpen(!popoverTransactionReconciledOpen);
  const popoverTransactionReconciledRef = useRef();

  const togglePopoverButtonDesvinculed = () =>
    setPopoverButtonDesvinculedOpen(!popoverButtonDesvinculedOpen);
  const popoverButtonDesvinculedRef = useRef();

  const transactionReconciledInformation = getReconciledInformation(
    statement.reconciled
  );

  const isReconciled = [1, 2, 3].includes(statement.reconciled);
  // const isReconciled =
  //   statement.reconciled === 1 ||
  //   statement.reconciled === 2 ||
  //   statement.reconciled === 3;

  // const isReconciled =
  //   statement.reconciled === 1 ||
  //   statement.reconciled === 2 ||
  //   (statement.reconciled === 3 &&
  //     (statement.transfer_bank_reconciled?.length === 2 ||
  //       statement.transfer_bank_reconciled?.[0]?.bank_account_id ===
  //         parseInt(bank_account_id, 10)));

  return (
    <>
      <span ref={popoverTransactionReconciledRef}>
        <Badge
          onMouseEnter={() => setPopoverTransactionReconciledOpen(true)}
          onMouseLeave={() => setPopoverTransactionReconciledOpen(false)}
          className={`badge ${transactionReconciledInformation.color} mr-1`}
        >
          {isReconciled ? <Check size={14} /> : <X size={14} />}
        </Badge>
      </span>

      <Popover
        className="mr-1"
        placement="right"
        isOpen={popoverTransactionReconciledOpen}
        target={popoverTransactionReconciledRef}
        toggle={togglePopovertransactionReconciled}
      >
        <PopoverHeader>{transactionReconciledInformation.title}</PopoverHeader>
        <PopoverBody>
          {transactionReconciledInformation.description}
        </PopoverBody>
      </Popover>

      {isReconciled && (
        <span>
          <PermissionGate permissions="api.companies.bank_accounts.import-ofx">
            <span ref={popoverButtonDesvinculedRef}>
              <Button.Ripple
                className="btn-sm btn"
                color="danger"
                onMouseEnter={() => setPopoverButtonDesvinculedOpen(true)}
                onMouseLeave={() => setPopoverButtonDesvinculedOpen(false)}
                onClick={() => {
                  submitDesvinculed(statement);
                }}
              >
                <FaUndoAlt size={14} />
              </Button.Ripple>
            </span>
            <Popover
              className="mr-1"
              placement="right"
              isOpen={popoverButtonDesvinculedOpen}
              target={popoverButtonDesvinculedRef}
              toggle={togglePopoverButtonDesvinculed}
            >
              <PopoverHeader>
                <FormattedMessage id="button.reconcilliate.desvinculed" />
              </PopoverHeader>
              <PopoverBody>Clique para Desconciliar</PopoverBody>
            </Popover>
          </PermissionGate>
        </span>
      )}
    </>
  );
};

StatementStatusBadge.propTypes = {
  submitDesvinculed: propTypes.func.isRequired,
  statement: propTypes.shape({
    reconciled: propTypes.number,
    transfer_bank_reconciled: propTypes.arrayOf({
      bank_account_id: propTypes.number,
    }),
  }).isRequired,
  bank_account_id: propTypes.number.isRequired,
};

export default StatementStatusBadge;
