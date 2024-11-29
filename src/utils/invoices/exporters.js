import XLSX from 'xlsx';
import moment from 'moment';

const getStatusText = (status) => {
  switch (status) {
    case 'PROCESSING':
      return 'Processando';
    case 'AUTHORIZED_WAITING_PDF':
      return 'Autorizada - Aguardando PDF';
    case 'AUTHORIZED':
      return 'Autorizada';
    case 'DENIED':
      return 'Negada';
    case 'PROCESSING_CANCELATION':
      return 'Processando Cancelamento';
    case 'CANCELED_WAITING_PDF':
      return 'Cancelada - Aguardando PDF';
    case 'CANCELED':
      return 'Cancelada';
    case 'CANCELATION_DENIED':
      return 'Cancelamento Negado';
    default:
      return status;
  }
};

const getInvoiceOperation = (invoiceOperation) => {
  switch (invoiceOperation) {
    case 'SALE':
      return 'Venda';
    case 'RETURN':
      return 'Devolução';
    case 'UNKNOWN':
      return '(?)';
    default:
      return '-';
  }
};

const getInvoiceType = (invoiceType) => {
  switch (invoiceType) {
    case 'PRODUCT':
      return 'Produto';
    case 'SERVICE':
      return 'Serviço';
    case 'UNKNOWN':
      return '(?)';
    default:
      return '-';
  }
};

const exportInvoiceXLS = (invoices) => {
  const header = [
    'ID da NF',
    'ID da Venda',
    'ID da Empresa',
    'Nome da Empresa',
    'Competência da Venda',
    'Cliente',
    'CPF/CNPJ do Cliente',
    'Produto',
    'Código Produto',
    'Preço Produto',
    'Quantidade',
    'Valor da Nota Fiscal',
    'Status',
    'Data de Emissão',
    'Número',
    'Série',
    'Operação',
    'Tipo',
    'Link PDF',
    'Link XML',
  ];

  const body = invoices.map((invoice) => ({
    'ID da NF': invoice.id,
    'ID da Venda': invoice.sale.id,
    'ID da Empresa': invoice.company.id,
    'Nome da Empresa': invoice.company.company_name,
    'Competência da Venda': invoice.sale.competency_date,
    Cliente: invoice.first_return.client?.name || '',
    'CPF/CNPJ do Cliente': invoice.first_return.client?.document || '',
    Produto: invoice.sale.product_name,
    'Código Produto': invoice.sale.product_code,
    'Preço Produto': invoice.sale.product_price,
    Quantidade: invoice.sale.quantity,
    'Valor Total': invoice.total_value,
    Status: getStatusText(invoice.status),
    'Data de Emissão': invoice.date_created
      ? moment(invoice.date_created).format('DD/MM/YYYY')
      : '',
    Número: invoice.number,
    Série: invoice.series,
    Operação: getInvoiceOperation(invoice.operation),
    Tipo: getInvoiceType(invoice.invoice_type),
    'Link PDF': invoice.link_pdf,
    'Link XML': invoice.link_xml,
  }));

  const ws = XLSX.utils.json_to_sheet(body, { header });
  const wb = XLSX.utils.book_new();
  const getFileName = () => `notas_fiscais`;
  XLSX.utils.book_append_sheet(wb, ws, getFileName());
  XLSX.writeFile(wb, `${getFileName()}.xlsx`);
};

export { exportInvoiceXLS };
