const statusPurchaseOptions = () => [
  {
    value: 'all',
    label: 'Todos',
  },
  {
    value: 'waiting',
    label: 'Aguardando aprovação',
  },
  {
    value: 'approved',
    label: 'Aprovada',
  },
  {
    value: 'reproved',
    label: 'Reprovada',
  },
  {
    value: 'canceled',
    label: 'Cancelada',
  },
];

const purchaseFrequencies = [
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

export { statusPurchaseOptions, purchaseFrequencies };
