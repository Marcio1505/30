import React from 'react';
import { PropTypes } from 'prop-types';

const InvoiceOperationBadge = ({ invoiceOperationText }) => {
  switch (invoiceOperationText) {
    case 'SALE':
      return <div className="badge badge-pill badge-light-success">Venda</div>;
    case 'RETURN':
      return (
        <div className="badge badge-pill badge-light-danger">Devolução</div>
      );
    case 'UNKNOWN':
      return <div className="badge badge-pill badge-light-info">(?)</div>;
    default:
      return <div className="badge badge-pill badge-light-warning">Todas</div>;
  }
};

InvoiceOperationBadge.propTypes = {
  invoiceOperationText: PropTypes.string.isRequired,
};

export default InvoiceOperationBadge;
