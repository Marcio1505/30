import React from 'react';
import { Check, Clock, RefreshCcw, Slash, RotateCcw } from 'react-feather';

// Sale Status
// 1 = Iniciada
// 2 = Boleto Gerado
// 3 = Aguardando pagamento
// 4 = Em Análise
// 5 = Aprovada
// 6 = Completa
// 7 = Expirada
// 8 = Atrasada
// 9 = CancelaSda
// 10 = Reclamada
// 11 = Reembolsada
// 12 = Reembolso Manual
// 13 = Chargeback

const getSaleStatusInformation = (saleStatus) => {
  switch (saleStatus) {
    case 1:
      return {
        title: 'Iniciada',
        description: 'Venda iniciada',
        color: 'warning',
        icon: <Clock size={16} />,
      };
    case 2:
      return {
        title: 'Boleto Gerado',
        description: 'Boleto Gerado',
        color: 'warning',
        icon: <Clock size={16} />,
      };
    case 3:
      return {
        title: 'Aguardando Pagamento',
        description: 'Aguardando Pagamento',
        color: 'warning',
        icon: <Clock size={16} />,
      };
    case 4:
      return {
        title: 'Em Análise',
        description: 'Em Análise',
        color: 'warning',
        icon: <Clock size={16} />,
      };
    case 5:
      return {
        title: 'Aprovada',
        description: 'Aprovada',
        color: 'success',
        icon: <Check size={16} />,
      };
    case 6:
      return {
        title: 'Completa',
        description: 'Completa',
        color: 'success',
        icon: <Check size={16} />,
      };
    case 7:
      return {
        title: 'Expirada',
        description: 'Expirada',
        color: 'danger',
        icon: <Clock size={16} />,
      };
    case 8:
      return {
        title: 'Atrasada',
        description: 'Atrasada',
        color: 'danger',
        icon: <Clock size={16} />,
      };
    case 9:
      return {
        title: 'Cancelada',
        description: 'Cancelada',
        color: 'danger',
        icon: <Slash size={16} />,
      };
    case 10:
      return {
        title: 'Reclamada',
        description: 'Reclamada',
        color: 'warning',
        icon: <RefreshCcw size={16} />,
      };
    case 11:
      return {
        title: 'Reembolsada',
        description: 'Reembolsada',
        color: 'danger',
        icon: <RefreshCcw size={16} />,
      };
    case 12:
      return {
        title: 'Reembolsada Manualmente',
        description: 'Reembolsada Manualmente',
        color: 'danger',
        icon: <RefreshCcw size={16} />,
      };
    case 13:
      return {
        title: 'Chargeback',
        description: 'Chargeback',
        color: 'danger',
        icon: <RotateCcw size={16} />,
      };
    default:
      return {
        title: '',
        description: '',
        color: '',
        icon: '',
      };
    // return {
    //   title: `Status ${saleStatus}`,
    //   description: `Status ${saleStatus}`,
    //   color: 'danger',
    //   icon: '',
    // };
  }
};

export { getSaleStatusInformation };
