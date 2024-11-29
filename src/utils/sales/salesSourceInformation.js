import React from 'react';
import { Check, Clock, Minus } from 'react-feather';

const getSaleSourceAvailables = () => [
  {
    value: 1,
    label: 'Hotmart',
  },
  {
    value: 2,
    label: 'Link de Pagamento',
  },
  {
    value: 3,
    label: 'Guru Pagarme',
  },
  {
    value: 4,
    label: 'Guru Eduzz',
  },
  {
    value: 5,
    label: 'Provi',
  },
  {
    value: 6,
    label: 'Eduzz',
  },
  {
    value: 7,
    label: 'Ticto',
  },
  {
    value: 11,
    label: 'Kiwify',
  },
  {
    value: 12,
    label: 'TMB',
  },
  {
    value: 13,
    label: 'Guru 2 Pagarme 2.0',
  },
  {
    value: 14,
    label: 'Hubla',
  },
  {
    value: 15,
    label: 'Dominio',
  },
  {
    value: 91,
    label: 'Cadastro Manual',
  },
  {
    value: 92,
    label: 'Importação Planilha',
  },
  {
    value: null,
    label: 'Indefinido',
  },
];

const getSaleSourceOptions = () => getSaleSourceAvailables();

const getSaleSourceInformation = (saleSource) => {
  switch (saleSource) {
    case 1:
      return {
        title: 'Hotmart',
        description:
          'Venda registrada no IULI através de sincronização com Hotmart',
        color: 'warning',
        icon: <Check size={16} />,
      };
    case 2:
      return {
        title: 'Link de Pagamento',
        description: 'Venda registrada no IULI através de Link de Pagamento',
        color: 'success',
        icon: <Check size={16} />,
      };
    case 3:
      return {
        title: 'Guru Pagarme',
        description:
          'Venda registrada no IULI através de sincronização com Guru/Pagarme',
        color: 'warning',
        icon: <Check size={16} />,
      };
    case 4:
      return {
        title: 'Guru Eduzz',
        description:
          'Venda registrada no IULI através de sincronização com Guru/Eduzz',
        color: 'warning',
        icon: <Check size={16} />,
      };
    case 5:
      return {
        title: 'Provi',
        description:
          'Venda registrada no IULI através de sincronização com Provi',
        color: 'warning',
        icon: <Check size={16} />,
      };
    case 6:
      return {
        title: 'Eduzz',
        description:
          'Venda registrada no IULI através de sincronização com Eduzz',
        color: 'warning',
        icon: <Check size={16} />,
      };
    case 91:
      return {
        title: 'Manual',
        description: 'Venda registrada no IULI por cadastro manual',
        color: 'info',
        icon: <Clock size={16} />,
      };
    case 92:
      return {
        title: 'Importação Planilha',
        description: 'Venda registrada no IULI por importação de planilha',
        color: 'info',
        icon: <Clock size={16} />,
      };
    case null:
      return {
        title: 'Indefinido',
        description: 'Método de registro no IULI não identificado',
        color: 'danger',
        icon: <Minus size={16} />,
      };
    default:
      return {
        title: 'Indefinido',
        description: 'Método de registro no IULI não identificado',
        color: 'danger',
        icon: <Minus size={16} />,
      };
  }
};

export {
  getSaleSourceInformation,
  getSaleSourceAvailables,
  getSaleSourceOptions,
};
