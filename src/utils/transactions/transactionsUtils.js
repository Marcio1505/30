const statusTransactionOptions = (transactionType) => {
  if (transactionType === 'RECEIVABLE') {
    return [
      {
        value: 'all',
        label: 'Todos',
      },
      {
        value: 1,
        label: 'Recebido',
      },
      {
        value: 2,
        label: 'A Receber',
      },
      {
        value: 3,
        label: 'Atrasado',
      },
    ];
  }
  if (transactionType === 'PAYABLE') {
    return [
      {
        value: 'all',
        label: 'Todos',
      },
      {
        value: 1,
        label: 'Pago',
      },
      {
        value: 2,
        label: 'A Pagar',
      },
      {
        value: 3,
        label: 'Atrasado',
      },
    ];
  }
  return [];
};

const transactionFrequencies = [
  {
    value: 1,
    label: 'Diariamente',
  },
  {
    value: 2,
    label: 'Semanalmente',
  },
  {
    value: 3,
    label: 'Mensalmente',
  },
  {
    value: 4,
    label: 'Bimestralmente',
  },
  {
    value: 5,
    label: 'Anualmente',
  },
];

export { statusTransactionOptions, transactionFrequencies };
