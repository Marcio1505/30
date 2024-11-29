import React from 'react';
import { PropTypes } from 'prop-types';
import SaleSourceBadge from './SaleSourceBadge';

const TransactionSourceBadge = ({ transactionSource, entity }) => (
  <SaleSourceBadge saleSource={transactionSource} entity={entity} />
);

TransactionSourceBadge.propTypes = {
  transactionSource: PropTypes.string,
  entity: PropTypes.string.isRequired,
};

TransactionSourceBadge.defaultProps = {
  transactionSource: null,
};

export default TransactionSourceBadge;
