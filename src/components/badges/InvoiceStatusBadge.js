import React from 'react';
import { PropTypes } from 'prop-types';
import { Clock, Check, X } from 'react-feather';

const InvoiceStatusBadge = ({ invoiceStatusText }) => {
  switch (invoiceStatusText) {
    case 'PROCESSING':
      return (
        <div className="badge badge-pill badge-light-warning">
          <Clock size={16} />
          {` Processando`}
        </div>
      );
    case 'PROCESSING_CANCELATION':
      return (
        <div className="badge badge-pill badge-light-danger">
          <Clock size={16} />
          {` Processando Cancelamento`}
        </div>
      );
    case 'AUTHORIZED_WAITING_PDF':
      return (
        <div className="badge badge-pill badge-light-warning">
          <Check size={16} />
          {` Autorizada - Aguardando PDF`}
        </div>
      );
    case 'CANCELED_WAITING_PDF':
      return (
        <div className="badge badge-pill badge-light-warning">
          <X size={16} />
          {` Cancelada - Aguardando PDF`}
        </div>
      );
    case 'AUTHORIZED':
      return (
        <div className="badge badge-pill badge-light-success">
          <Check size={16} />
          {` Autorizadas`}
        </div>
      );
    case 'DENIED':
      return (
        <div className="badge badge-pill badge-light-danger">
          <X size={16} />
          {` Negadas`}
        </div>
      );
    case 'CANCELATION_DENIED':
      return (
        <div className="badge badge-pill badge-light-danger">
          <X size={16} />
          {` Cancelamento Negado`}
        </div>
      );
    case 'CANCELED':
      return (
        <div className="badge badge-pill badge-light-danger">
          <X size={16} />
          {` Canceladas`}
        </div>
      );
    default:
      return (
        <div className="badge badge-pill badge-light-warning">{` Todas`}</div>
      );
  }
};

InvoiceStatusBadge.propTypes = {
  invoiceStatusText: PropTypes.string.isRequired,
};

export default InvoiceStatusBadge;
