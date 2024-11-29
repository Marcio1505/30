const getStatusInvoice = (status_invoice_id) => {
  switch (status_invoice_id) {
    case 1:
      return {
        title: 'Aguardando Autorização',
      };
    case 2:
      return {
        title: 'Solicitando Autorização',
      };
    case 3:
      return {
        title: 'Autorização Solicitada',
      };
    case 4:
      return {
        title: 'Em Processo De Autorização',
      };
    case 5:
      return {
        title: 'Autorizada Aguardando Geração do PDF',
      };
    case 6:
      return {
        title: 'Autorizada',
      };
    case 7:
      return {
        title: 'Negada',
      };
    case 8:
      return {
        title: '​Solicitando Cancelamento',
      };
    case 9:
      return {
        title: 'Cancelamento Solicitado',
      };
    case 10:
      return {
        title: 'Em Processo De Cancelamento',
      };
    case 11:
      return {
        title: 'Cancelada Aguardando Atualização do PDF',
      };
    case 12:
      return {
        title: 'Cancelada',
      };
    case 13:
      return {
        title: 'Cancelamento Negado',
      };
    default:
      return {
        title: '',
      };
  }
};

export { getStatusInvoice };
