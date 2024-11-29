import React from 'react';
import {
  CreditCard,
  DollarSign,
  MoreHorizontal,
  FileText,
  TrendingUp,
  Inbox,
} from 'react-feather';

const getPaymentMethod = (payment_method_id) => {
  switch (payment_method_id) {
    case 1:
      return {
        title: 'Crédito',
        description: 'Cartão de Crédito',
        color: 'success',
        icon: <CreditCard size={16} />,
      };
    case 2:
      return {
        title: 'Débito',
        description: 'Cartão de Débito',
        color: 'info',
        icon: <CreditCard size={16} />,
      };
    case 3:
      return {
        title: 'Boleto',
        description: 'Boleto Bancário',
        color: 'warning',
        icon: <FileText size={16} />,
      };
    case 4:
      return {
        title: 'PIX',
        description: 'PIX',
        color: 'success',
        icon: <DollarSign size={16} />,
      };
    case 5:
      return {
        title: 'TED/DOC',
        description: 'TED/DOC',
        color: 'success',
        icon: <TrendingUp size={16} />,
      };
    case 6:
      return {
        title: 'Saldo',
        description: 'Saldo Plataforma Externa',
        color: 'success',
        icon: <Inbox size={16} />,
      };
    case 99:
      return {
        title: 'Outros',
        description: 'Outros',
        color: 'success',
        icon: <MoreHorizontal size={16} />,
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

export { getPaymentMethod };
