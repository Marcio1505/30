import XLSX from 'xlsx';
import moment from 'moment';

import {
  getPaymentMethod,
  getSaleStatusInformation,
  getStatusInvoice,
} from '.';

const exportSalesXLS = (sales) => {
  const header = [
    'id',
    'link',
    'Data da Última Alteração',
    'Código Pagamento',
    'Cliente',
    'Email',
    'Telefone',
    'CPF/CNPJ',
    'Competência',
    'Produto',
    'Código Produto',
    'Conta Bancária',
    'Id da Conta Bancária',
    'Preço do Produto',
    'Valor da Venda',
    'Quantidade',
    'Valor Total',
    'Valor Pago pelo Cliente na Plataforma (Valor com Juros somados)',
    'Taxa da Plataforma',
    'Taxa Adiantamento',
    'Taxa de Streaming',
    'Valor Líquido a Receber',
    'ID da Categoria',
    'Nome da Categoria',
    'Parcelas',
    'Método de Pagamento',
    'Tipo de Pagamento',
    'Código do Meio de Pagamento (Plataforma de Venda)',
    'Nome da fonte de venda',
    'Status da Venda',
    'Status da Nota Fiscal',
    'NF número',
    'NF série',
    'NF pdf',
    'NF xml',
    'NF data emissão',
    'NFS número',
    'NFS série',
    'NFS pdf',
    'NFS xml',
    'NFS data emissão',
  ];

  const body = sales.map((sale) => {
    const paymentMethod = getPaymentMethod(sale.payment_method_id);
    const status = getSaleStatusInformation(sale.status);
    const status_invoice = getStatusInvoice(
      sale.invoices?.[sale.invoices?.length - 1]?.status
    );
    const urlElelement = window.location.href.split('/');
    return {
      id: sale.id,
      link: `http://${urlElelement[2]}/admin/sale/edit/${sale.id}`,
      'Data da Última Alteração': moment(sale?.updated_at).format(
        'DD/MM/YYYY HH:mm:ss'
      ),
      'Código Pagamento': sale.transaction_external_id,
      Cliente: sale.client?.company_name,
      Email: sale.client?.email,
      Telefone: sale.client?.phone,
      'CPF/CNPJ': sale.client?.document,
      Competência: sale.competency_date,
      Produto: sale.product_name,
      'Código Produto': sale.product_code,
      'Conta Bancária': sale.bank_account.name,
      'Id da Conta Bancária': sale.bank_account.id,
      'Preço do Produto': sale.product_price,
      'Valor da Venda': sale.total_value,
      Quantidade: sale.quantity,
      'Valor Total': sale.total_value,
      'Valor Pago pelo Cliente na Plataforma (Valor com Juros somados)':
        sale.final_value,
      'Taxa da Plataforma': sale.plataform_value,
      'Taxa Adiantamento': sale.advance_value,
      'Taxa de Streaming': sale.streaming_value,
      'Valor Líquido a Receber': sale.net_value,
      'ID da Categoria': sale.category.id,
      'Nome da Categoria': sale.category.name,
      Parcelas: sale.installment_number,
      'Método de Pagamento': paymentMethod.title,
      'Tipo de Pagamento': sale.payment_type?.name,
      'Código do Meio de Pagamento (Plataforma de Venda)':
        sale.payment_plataform_id,
      'Nome da fonte de venda': sale.source,
      'Status da Venda': status.title,
      'Status da Nota Fiscal': status_invoice.title,
      'NF número': sale.product_invoices?.[0]?.number,
      'NF série': sale.product_invoices?.[0]?.series,
      'NF pdf': sale.product_invoices?.[0]?.link_pdf,
      'NF xml': sale.product_invoices?.[0]?.link_xml,
      'NF data emissão': sale.invoices?.[0]?.date_created,
      'NFS número': sale.service_invoices?.[0]?.number,
      'NFS série': sale.service_invoices?.[0]?.series,
      'NFS pdf': sale.service_invoices?.[0]?.link_pdf,
      'NFS xml': sale.service_invoices?.[0]?.link_xml,
      'NFS data emissão': sale.service_invoices?.[0]?.date_created,
    };
  });

  const ws = XLSX.utils.json_to_sheet(body, { header });
  const wb = XLSX.utils.book_new();
  const getFileName = () => `vendas`;
  XLSX.utils.book_append_sheet(wb, ws, getFileName());
  XLSX.writeFile(wb, `${getFileName()}.xlsx`);
};

export { exportSalesXLS };
