import XLSX from 'xlsx';

import moment from 'moment';
import { formatDateToHumanString } from '../formaters';

const exportTransactionsXLS = (transactionType, transactions, company) => {
  let header = [];

  switch (transactionType) {
    case 'RECEIVABLE':
      header = [
        'id',
        'Id Externo',
        'Cliente',
        'Conta Bancária',
        'Id da Conta Bancária',
        'Categoria DRE',
        'Categoria',
        'Id da Categoria',
        'Código do Plano de Contas',
        'Vencimento',
        'Competência',
        'Valor',
        'Descrição',
        'Documento Fiscal',
        'Recebido',
        'Data Recebimento',
        'Valor Recebido',
        'Juros',
        'Documentos',
        'Arquivos',
        'Id da Venda no Iuli',
        'Nome do Cliente',
        'Documento do Cliente (CPF ou CNPJ)',
        'Documento do Cliente Estrangeiro',
        'Email',
        'Telefone',
        'CEP',
        'Cidade',
        'Estado',
        'Bairro',
        'País',
        'Endereço',
        'Número',
        'Complemento',
        'Data da Última Alteração',
        'Link',
        'Fonte',
        'Mostrar no DRE',
        'Mostrar no DFC',
        'Número da Parcela',
        'Total de Parcelas',
        'Status da Conciliação',
      ];
      break;
    case 'PAYABLE':
      header = [
        'id',
        'Id Externo',
        'Fornecedor',
        'Conta Bancária',
        'Id da Conta Bancária',
        'Categoria DRE',
        'Categoria',
        'Id da Categoria',
        'Código do Plano de Contas',
        'Vencimento',
        'Competência',
        'Valor',
        'Descrição',
        'Documento Fiscal',
        'Pago',
        'Data Pagamento',
        'Valor Pago',
        'Juros',
        'Documentos',
        'Arquivos',
        'Id da Venda no Iuli',
        'Nome do Fornecedor',
        'Documento do Fornecedor (CPF ou CNPJ)',
        'Documento do Fornecedor Estrangeiro',
        'Email',
        'Telefone',
        'CEP',
        'Cidade',
        'Estado',
        'Bairro',
        'País',
        'Endereço',
        'Número',
        'Complemento',
        'Data da Última Alteração',
        'Link',
        'Fonte',
        'Mostrar no DRE',
        'Mostrar no DFC',
        'Número da Parcela',
        'Total de Parcelas',
        'Status da Conciliação',
      ];
      break;
    default:
      throw new Error('Invalid transaction type');
  }

  const getCostCenterUniqueName = (costCenter) =>
    `Centro de Custo: ${costCenter.id} - ${costCenter.name}`;

  const costCenters = [];

  (transactions || []).forEach((transaction) => {
    (transaction.cost_centers || []).forEach((costCenter) => {
      const costCenterUniqueName = getCostCenterUniqueName(costCenter);
      if (!costCenters.includes(costCenterUniqueName)) {
        costCenters.push(costCenterUniqueName);
      }
    });
  });

  header.push(...costCenters);

  const getProjectUniqueName = (project) =>
    `Projeto: ${project.id} - ${project.name}`;

  const projects = [];

  (transactions || []).forEach((transaction) => {
    (transaction.projects || []).forEach((project) => {
      const projectUniqueName = getProjectUniqueName(project);
      if (!projects.includes(projectUniqueName)) {
        projects.push(projectUniqueName);
      }
    });
  });

  header.push(...projects);

  const getTransactionReceiptsUniqueName = (transactionReceipt) => {
    const header_text = ``; // : ${transactionReceipt.id} - ${transactionReceipt.file_name}`
    switch (transactionReceipt.file_type) {
      case 'INVOICE-PDF':
        return `NF-PDF${header_text}`;
      case 'INVOICE-XML':
        return `NF-XML${header_text}`;
      case 'BANK-SLIP':
        return `BOLETO${header_text}`;
      case 'RECEIPT':
        return `COMPROVANTE${header_text}`;
      case 'OTHERS':
        return `OUTROS${header_text}`;
    }
  };

  const transactionReceipts = [];

  (transactions || []).forEach((transaction) => {
    (transaction.transaction_receipts || []).forEach((transactionReceipt) => {
      const transactionReceiptUniqueName =
        getTransactionReceiptsUniqueName(transactionReceipt);
      if (!transactionReceipts.includes(transactionReceiptUniqueName)) {
        transactionReceipts.push(transactionReceiptUniqueName);
      }
    });
  });

  header.push(...transactionReceipts);

  const body = transactions.map((transaction) => {
    const urlElelement = window.location.href.split('/');

    const transaction_receipts = (transaction.transaction_receipts || [])
      .map((receipt) => receipt.file_url)
      .join(' ');

    const category = transaction.category || {};

    const dre_category = transaction.dre_category || {};

    if (transactionType === 'RECEIVABLE') {
      const newLine = {
        id: transaction.id,
        'Id Externo': transaction?.external_id,
        'Conta Bancária': transaction.bank_account?.name,
        'Id da Conta Bancária': transaction.bank_account?.id,
        'Categoria DRE': dre_category?.name,
        Categoria: category?.name,
        'Id da Categoria': category?.id,
        'Código do Plano de Contas': category?.chart_accounts,
        Vencimento: transaction.due_date,
        Competência: transaction.competency_date,
        Valor: transaction.transaction_value,
        Descrição: transaction.description,
        'Documento Fiscal': transaction.fiscal_document_text,
        'Dados de Pagamento': transaction.payment_info,
        Juros: transaction.interest_value,
        Cliente: transaction.client.company_name,
        Recebido: transaction.payed ? 'Sim' : 'Não',
        'Data Recebimento': transaction.payment_date,
        'Valor Recebido': transaction.payed_value,
        Arquivos: transaction_receipts,
        'Id da Venda no Iuli': transaction.sale_id,
        'Nome do Cliente': transaction?.client?.company_name,
        'Documento do Cliente (CPF ou CNPJ)': transaction?.client?.document,
        'Documento do Cliente Estrangeiro':
          transaction?.client?.foreign_identifier,
        Email: transaction?.client?.email,
        Telefone: transaction?.client?.phone,
        CEP: transaction?.client?.address[0]?.postal_code,
        Cidade: transaction?.client?.address[0]?.city?.name,
        Estado: transaction?.client?.address[0]?.state?.name,
        Bairro: transaction?.client?.address[0]?.neighborhood,
        País: transaction?.client?.address[0]?.country?.name,
        Endereço: transaction?.client?.address[0]?.street,
        Número: transaction?.client?.address[0]?.number,
        Complemento: transaction?.client?.address[0]?.complement,
        'Data da Última Alteração': moment(transaction?.updated_at).format(
          'DD/MM/YYYY HH:mm:ss'
        ),
        Link: `http://${urlElelement[2]}/admin/receivable/edit/${transaction.id}`,
        Fonte: transaction.source,
        'Mostrar no DRE': transaction.show_dre ? 'Sim' : 'Não',
        'Mostrar no DFC': transaction.show_dfc ? 'Sim' : 'Não',
        'Número da Parcela': transaction.installment,
        'Total de Parcelas': transaction.total_installments,
        'Status da Conciliação': transaction.reconciled ? 'Sim' : 'Não',
      };
      costCenters.forEach((costCenter) => {
        newLine[costCenter] =
          transaction.cost_centers.find(
            (cc) => getCostCenterUniqueName(cc) === costCenter
          )?.pivot?.percentage || 0;
      });
      projects.forEach((project) => {
        newLine[project] =
          transaction.projects.find(
            (_project) => getProjectUniqueName(_project) === project
          )?.pivot?.percentage || 0;
      });

      transactionReceipts.forEach((transactionReceipt) => {
        const fileUrl = transaction.transaction_receipts.find(
          (_transactionReceipt) =>
            getTransactionReceiptsUniqueName(_transactionReceipt) ===
            transactionReceipt
        )?.file_url;

        newLine[transactionReceipt] = fileUrl ?? '';
      });

      return newLine;
    }
    if (transactionType === 'PAYABLE') {
      const newLine = {
        id: transaction.id,
        'Id Externo': transaction?.external_id,
        'Conta Bancária': transaction.bank_account?.name,
        'Id da Conta Bancária': transaction.bank_account?.id,
        'Categoria DRE': dre_category?.name,
        Categoria: category?.name,
        'Id da Categoria': category?.id,
        'Código do Plano de Contas': category?.chart_accounts,
        Vencimento: transaction.due_date,
        Competência: transaction.competency_date,
        Valor: transaction.transaction_value,
        Descrição: transaction.description,
        'Documento Fiscal': transaction.fiscal_document_text,
        'Dados de Pagamento': transaction.payment_info,
        Juros: transaction.interest_value,
        Fornecedor: transaction.supplier.company_name,
        Pago: transaction.payed ? 'Sim' : 'Não',
        'Data Pagamento': transaction.payment_date,
        'Valor Pago': transaction.payed_value,
        Arquivos: transaction_receipts,
        'Id da Venda no Iuli': transaction.sale_id,
        'Nome do Fornecedor': transaction?.supplier?.company_name,
        'Documento do Fornecedor (CPF ou CNPJ)':
          transaction?.supplier?.document,
        'Documento do Fornecedor Estrangeiro':
          transaction?.supplier?.foreign_identifier,
        Email: transaction?.supplier?.email,
        Telefone: transaction?.supplier?.phone,
        CEP: transaction?.supplier?.address[0]?.postal_code,
        Cidade: transaction?.supplier?.address[0]?.city?.name,
        Estado: transaction?.supplier?.address[0]?.state?.name,
        Bairro: transaction?.supplier?.address[0]?.neighborhood,
        País: transaction?.supplier?.address[0]?.country?.name,
        Endereço: transaction?.supplier?.address[0]?.street,
        Número: transaction?.supplier?.address[0]?.number,
        Complemento: transaction?.supplier?.address[0]?.complement,
        'Data da Última Alteração': formatDateToHumanString(
          transaction?.updated_at
        ),
        Link: `http://${urlElelement[2]}/admin/payable/edit/${transaction.id}`,
        Fonte: transaction.source,
        'Mostrar no DRE': transaction.show_dre ? 'Sim' : 'Não',
        'Mostrar no DFC': transaction.show_dfc ? 'Sim' : 'Não',
        'Número da Parcela': transaction.installment || '',
        'Total de Parcelas': transaction.total_installments || '',
        'Status da Conciliação': transaction.reconciled ? 'Sim' : 'Não',
      };
      costCenters.forEach((costCenter) => {
        newLine[costCenter] =
          transaction.cost_centers.find(
            (cc) => getCostCenterUniqueName(cc) === costCenter
          )?.pivot?.percentage || 0;
      });
      projects.forEach((project) => {
        newLine[project] =
          transaction.projects.find(
            (_project) => getProjectUniqueName(_project) === project
          )?.pivot?.percentage || 0;
      });

      transactionReceipts.forEach((transactionReceipt) => {
        const fileUrl = transaction.transaction_receipts.find(
          (_transactionReceipt) =>
            getTransactionReceiptsUniqueName(_transactionReceipt) ===
            transactionReceipt
        )?.file_url;

        newLine[transactionReceipt] = fileUrl ?? '';
      });

      return newLine;
    }
  });

  const ws = XLSX.utils.json_to_sheet(body, { header });

  const wb = XLSX.utils.book_new();

  const getCompanyInitials = (_company) =>
    _company.trading_name
      ? _company.trading_name
          .split(' ')
          .map((n) => n[0])
          .join('')
      : _company.company_name
          .split(' ')
          .map((n) => n[0])
          .join('');

  const getFileName = () => {
    if (transactionType === 'RECEIVABLE') {
      return `contas_a_receber_${getCompanyInitials(company)}`;
    }
    if (transactionType === 'PAYABLE') {
      return `contas_a_pagar_${getCompanyInitials(company)}`;
    }
    return 'transactions';
  };

  XLSX.utils.book_append_sheet(wb, ws, getFileName());

  XLSX.writeFile(wb, `${getFileName()}.xlsx`);
};

export { exportTransactionsXLS };
