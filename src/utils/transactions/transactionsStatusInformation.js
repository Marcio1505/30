import React from 'react';
import { Check, Clock } from 'react-feather';

const getTransactionStatusInformation = (transaction) => {
  switch (transaction.status) {
    case 1:
      return {
        title: transaction.type === 'RECEIVABLE' ? 'Recebido' : 'Pago',
        description:
          transaction.type === 'RECEIVABLE' ? 'Conta Recebida' : 'Conta Paga',
        color: 'success',
        icon: <Check size={16} />,
      };
    case 2:
      return {
        title: transaction.type === 'RECEIVABLE' ? 'A receber' : 'A pagar',
        description:
          transaction.type === 'RECEIVABLE'
            ? 'Conta a receber'
            : 'Conta a pagar',
        color: 'warning',
        icon: <Clock size={16} />,
      };
    case 3:
      return {
        title: 'Atrasado',
        description: 'Conta atrasada',
        color: 'danger',
        icon: <Clock size={16} />,
      };
    default:
      return {
        title: '',
        description: '',
        color: '',
        icon: '',
      };
  }
};

export { getTransactionStatusInformation };
