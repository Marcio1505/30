import XLSX from 'xlsx';

const exportersErrorSync = (transactions_errors) => {
  const header = ['id', 'valor_base', 'moeda', 'nome_produto', 'nome_cliente'];

  const body = (Object.values(transactions_errors) || []).map(
    (transaction_error) => ({
      id: transaction_error.transaction,
      valor_base: transaction_error.base_value,
      moeda: transaction_error.currency_code,
      nome_produto: transaction_error.product_name,
      nome_cliente: transaction_error.user_name,
    })
  );

  const ws = XLSX.utils.json_to_sheet(body, { header });
  const wb = XLSX.utils.book_new();
  const getFileName = () => `sync_error`;
  XLSX.utils.book_append_sheet(wb, ws, getFileName());
  XLSX.writeFile(wb, `${getFileName()}.xlsx`);
};

export { exportersErrorSync };
