// Sale or Transaction Source
// 1 = HOTMART
// 2 = ASAAS
// 3 = GURUPAGARME
// 4 = GURUEDUZZ
// 5 = PROVI
// 6 = EDUZZ
// 7 = TICTO
// 11 = KIWIFY
// 12 = TMB
// 13 = GURU2PAGARME2
// 14 = HUBLA
// 15 = DOMINIO
// 91 = MANUAL
// 92 = SPREADSHEET
// NULL = indefinido (não exisita  o campo até março 2022)

const getSourceAvailables = () => [
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
    label: 'Guru 2 Pagarme 2',
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
  // {
  //   value: null,
  //   label: 'Indefinido',
  // },
];

const getSourceOptions = () => {
  const saleSources = getSourceAvailables();
  saleSources.unshift({
    value: '',
    label: 'Todas',
  });
  // return saleSources.filter((saleSource) => saleSource.value !== null);
  return saleSources;
};

const getSourceInformation = (source, entity = 'Venda') => {
  switch (source) {
    case 'MANUAL':
      return {
        title: 'Cadastro Manual',
        description: `${entity} cadastrada manualmente`,
        color: 'info',
        initials: 'M',
      };
    case 'SPREADSHEET':
      return {
        title: 'Importação Planilha',
        description: `${entity} cadastrada por importação de planilha`,
        color: 'warning',
        initials: 'P',
      };
    case 'HOTMART':
      return {
        title: 'Hotmart',
        description: `${entity} cadastrada por sincronização/webhook com Hotmart`,
        color: 'danger',
        initials: 'H',
      };
    case 'ASAAS':
      return {
        title: 'Link de Pagamento',
        description: `${entity} cadastrada por Link de Pagamento`,
        color: 'primary',
        initials: 'L',
      };
    case 'GURUPAGARME':
      return {
        title: 'Pagarme',
        description: `${entity} cadastrada por sincronização/webhook com o Guru/Pagarme`,
        color: 'danger',
        initials: 'PA',
      };
    case 'GURUEDUZZ':
      return {
        title: 'Eduzz',
        description: `${entity} cadastrada por sincronização com o Guru/Eduzz`,
        color: 'danger',
        initials: 'E',
      };
    case 'PROVI':
      return {
        title: 'Provi',
        description: `${entity} cadastrada por sincronização com a Provi`,
        color: 'danger',
        initials: 'PR',
      };
    case 'EDUZZ':
      return {
        title: 'Eduzz',
        description: `${entity} cadastrada por sincronização/webhook com a Eduzz`,
        color: 'danger',
        initials: 'E',
      };
    case 'TICTO':
      return {
        title: 'Ticto',
        description: `${entity} cadastrada por webhook da Ticto`,
        color: 'danger',
        initials: 'T',
      };
    case 'KIWIFY':
      return {
        title: 'Kiwify',
        description: `${entity} cadastrada por webhook da Kiwify`,
        color: 'danger',
        initials: 'KW',
      }; 
    case 'TMB':
      return {
        title: 'Tmb',
        description: `${entity} cadastrada por webhook da TMB`,
        color: 'danger',
        initials: 'TMB',
      };
    case 'GURU2PAGARME2':
      return {
        title: 'Pagarme2',
        description: `${entity} cadastrada por sincronização/webhook com o Guru2/Pagarme2`,
        color: 'danger',
        initials: 'PA2',
      };
    case 'HUBLA':
      return {
        title: 'Hubla',
        description: `${entity} cadastrada por webhook da Hubla`,
        color: 'danger',
        initials: 'HB',
      };
    case 'DOMINIO':
      return {
        title: 'Dominio',
        description: `${entity} cadastrada por webhook da Dominio`,
        color: 'danger',
        initials: 'DM',
      };
    default:
      return {
        title: '',
        description: '',
        color: 'info',
        initials: '',
      };
    // return {
    //   title: 'Hotmart',
    //   description: 'Venda cadastrada por sincronização com Hotmart',
    //   color: 'warning',
    //   initials: 'H',
    // };
    // return {
    //   title: 'Cadastro Manual',
    //   description: 'Venda cadastrada manualmente',
    //   color: 'primary',
    //   initials: 'M',
    // };
    // return {
    //   title: 'Importação Planilha',
    //   description: 'Venda cadastrada por importação de planilha',
    //   color: 'success',
    //   initials: 'E',
    // };
    // return {
    //   title: 'Link de Pagamento',
    //   description: 'Venda cadastrada por Link de Pagamento',
    //   color: 'info',
    //   initials: 'L',
    // };
  }
};

const getReconciledInformation = (reconciled) => {
  switch (reconciled) {
    case 1:
      return {
        title: 'Conciliado',
        description: 'Conciliado manualmente',
        color: 'badge-light-info',
        initials: 'C',
      };
    case 2:
      return {
        title: 'Parcialmente Conciliado',
        description: 'Parcialmente conciliado ainda falta conciliar algo',
        color: 'badge-light-warning',
        initials: 'P',
      };
    case 3:
      return {
        title: 'Conciliação Incompleta',
        description:
          'Conciliação incompleta porque falta conciliar em um dos BANCOS envolvido nessa transferência',
        color: 'bg-gradient-info',
        initials: 'I',
      };
    default:
      return {
        title: 'Não Conciliado',
        description: 'Não conciliado',
        color: 'badge-light-danger',
        initials: 'N',
      };
  }
};

export {
  getSourceInformation,
  getSourceAvailables,
  getSourceOptions,
  getReconciledInformation,
};
