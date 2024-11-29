import React, { useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { PopoverHeader, PopoverBody, Popover } from 'reactstrap';

import { getReconciledInformation } from '../../utils/sourceUtils';

const TransactionReconciledBadge = ({ transactionReconciled }) => {
  const [
    popovertransactionReconciledOpen,
    setPopovertransactionReconciledOpen,
  ] = useState(false);

  const togglePopovertransactionReconciled = () =>
    setPopovertransactionReconciledOpen(!popovertransactionReconciledOpen);

  const popovertransactionReconciledRef = useRef();

  const transactionReconciledInformation = getReconciledInformation(
    transactionReconciled
  );

  return (
    <>
      <div
        className={`badge ${transactionReconciledInformation.color}`}
        ref={popovertransactionReconciledRef}
        onMouseEnter={() => setPopovertransactionReconciledOpen(true)}
        onMouseLeave={() => setPopovertransactionReconciledOpen(false)}
      >
        {transactionReconciledInformation.initials}
      </div>
      <Popover
        className="mr-1"
        placement="top"
        isOpen={popovertransactionReconciledOpen}
        target={popovertransactionReconciledRef}
        toggle={togglePopovertransactionReconciled}
      >
        <PopoverHeader>{transactionReconciledInformation.title}</PopoverHeader>
        <PopoverBody>
          {transactionReconciledInformation.description}
        </PopoverBody>
      </Popover>
    </>
  );
};

TransactionReconciledBadge.propTypes = {
  transactionReconciled: PropTypes.string,
};

TransactionReconciledBadge.defaultProps = {
  transactionReconciled: null,
};

export default TransactionReconciledBadge;
