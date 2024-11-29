import React from 'react';
import { PropTypes } from 'prop-types';

const InvoiceTypeBadge = ({ invoiceTypeText }) => {
  switch (invoiceTypeText) {
    case 'PRODUCT':
      return (
        <div className="badge badge-pill badge-light-success">Produto</div>
      );
    case 'SERVICE':
      return <div className="badge badge-pill badge-light-info">Serviço</div>;
    case 'UNKNOWN':
      return <div className="badge badge-pill badge-light-Danger">UNKNOW</div>;
    default:
      return <div className="badge badge-pill badge-light-warning">Todas</div>;
  }
};

InvoiceTypeBadge.propTypes = {
  invoiceTypeText: PropTypes.string.isRequired,
};

export default InvoiceTypeBadge;
