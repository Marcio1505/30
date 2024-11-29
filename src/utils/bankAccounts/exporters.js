import XLSX from 'xlsx';

const exportStatementXLS = (statements) => {
  const header = [
    'Data',
    'Movimentação Banco',
    'Movimentação Iuli',
    'Saldo Banco',
    'Saldo Iuli',
  ];

  const body = statements.map((statement) => ({
    Data: statement.date,
    'Movimentação Banco': statement.ofx_statement,
    'Movimentação Iuli': statement.iuli_statement,
    'Saldo Banco': statement.ofx_balance,
    'Saldo Iuli': statement.iuli_balance,
  }));

  const headerDetails = ['Data', 'Valor', 'Empresa', 'Descrição', 'Conciliado'];

  const bodyDetails = [];

  statements.forEach((statement) =>
    statement.transactions_transfers.forEach((transactionTransfer) => {
      let date = transactionTransfer.payment_date;
      let paidValue = '';
      let { description } = transactionTransfer;
      let link = '';
      if (transactionTransfer.statement_type === 1) {
        if (transactionTransfer.type === 1) {
          paidValue = transactionTransfer.payed_value;
          link = `/admin/receivable/edit/${transactionTransfer.id}`;
        } else {
          paidValue = -1 * transactionTransfer.payed_value;
          link = `/admin/payable/edit/${transactionTransfer.id}`;
        }
      } else if (transactionTransfer.statement_type === 2) {
        date = transactionTransfer.competency_date;
        link = `/admin/transfer/edit/${transactionTransfer.id}`;
        if (transactionTransfer.type === 1) {
          paidValue = transactionTransfer.transfer_value;
          description = `Transferência recebida de ${transactionTransfer.bank_account.name}`;
        } else {
          paidValue = -1 * transactionTransfer.transfer_value;
          description = `Transferência feita para ${transactionTransfer.to_bank_account.name}`;
        }
      }
      bodyDetails.push({
        Data: date,
        Valor: paidValue,
        Empresa: transactionTransfer.company_name,
        Decrição: description,
        Conciliado: transactionTransfer.conciled ? 'Sim' : 'Não',
      });
    })
  );

  const ws = XLSX.utils.json_to_sheet(body, { header });
  const wsDetails = XLSX.utils.json_to_sheet(bodyDetails, { headerDetails });
  const wb = XLSX.utils.book_new();
  const getFileName = () => `Extrato Bancario`;
  XLSX.utils.book_append_sheet(wb, ws, 'Consolidado');
  XLSX.utils.book_append_sheet(wb, wsDetails, 'Detalhes');
  XLSX.writeFile(wb, `${getFileName()}.xlsx`);
};

export { exportStatementXLS };
