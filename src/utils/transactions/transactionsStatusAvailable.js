const allTransactionsStatus = (transactionType) => {
  if (transactionType === 'RECEIVABLE') {
    return [
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

const getTransactionStatusAvailable = (transactionType) =>
  allTransactionsStatus(transactionType);

const getTransactionStatusOptions = (transactionType) => {
  const transactionsStatusOptions = allTransactionsStatus(transactionType).map(
    (transactionStatus) => ({
      ...transactionStatus,
    })
  );
  transactionsStatusOptions.unshift({
    value: 'all',
    label: 'Todos',
  });
  return transactionsStatusOptions;
};

export { getTransactionStatusAvailable, getTransactionStatusOptions };
