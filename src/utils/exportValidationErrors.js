import XLSX from 'xlsx';
import moment from 'moment';

const exportValidationErrors = (errors, requestedUrl) => {
  let rowOffset = 0;
  if (
    requestedUrl.includes('/sales/import') ||
    requestedUrl.includes('/transactions/import') ||
    requestedUrl.includes('/transfers/import')
  ) {
    rowOffset = 5;
  }
  if (requestedUrl.includes('/ofx/import')) {
    rowOffset = 2;
  }

  const header = ['Erro', 'Linha'];

  const body = (errors || []).map((error) => ({
    Erro: error.message,
    Linha: parseInt(error.row, 10) + rowOffset,
  }));

  const ws = XLSX.utils.json_to_sheet(body, { header });
  const wb = XLSX.utils.book_new();
  const getFileName = () =>
    `erros_excel_${moment().format('YYYY-MM-DD_HHmmss')}`;
  XLSX.utils.book_append_sheet(wb, ws, 'erros');
  XLSX.writeFile(wb, `${getFileName()}.xlsx`);
};

export { exportValidationErrors };
