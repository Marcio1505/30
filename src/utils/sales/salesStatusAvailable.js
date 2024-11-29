const allSalesStatus = [
  {
    value: 1,
    label: 'Iniciada',
  },
  {
    value: 2,
    label: 'Boleto Gerado',
  },
  {
    value: 3,
    label: 'Aguardando pagamento',
  },
  {
    value: 4,
    label: 'Em Análise',
  },
  {
    value: 5,
    label: 'Aprovada',
  },
  {
    value: 6,
    label: 'Completa',
  },
  {
    value: 7,
    label: 'Expirada',
  },
  {
    value: 8,
    label: 'Atrasada',
  },
  {
    value: 9,
    label: 'Cancelada',
  },
  {
    value: 10,
    label: 'Reclamada (Reembolso Solicitado)',
  },
  {
    value: 11,
    label: 'Reembolsada',
  },
  {
    value: 12,
    label: 'Reembolso Manual',
  },
  {
    value: 13,
    label: 'Chargeback',
  },
];

const getSaleStatusAvailable = (sale = {}) => {
  if (sale.source === 'ASAAS') {
    return allSalesStatus.map((status) => ({
      ...status,
      isDisabled: true,
    }));
  }
  return allSalesStatus;
};

const getSaleStatusOptions = () => allSalesStatus;

export { getSaleStatusAvailable, getSaleStatusOptions };
