import API from '../API.redux';
import { store } from '../../redux/storeConfig/store';

const invoicesEndpoints = {
  index: {
    url: 'companies/:company_id/invoices',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },

  create: {
    url: 'sales/:sale_id/invoices',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  createGroup: {
    url: 'companies/:company_id/store-group-invoices',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  update: {
    url: 'sales/:sale_id/invoices/:invoice_id',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  cancel: {
    url: 'sales/:sale_id/invoices/:invoice_id/cancel',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  createReturn: {
    url: 'sales/:sale_id/invoices/:invoice_id/create-return-invoice',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  },

  show: {
    url: 'enotas/:invoice_id',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
};

export const fetchInvoicesList = ({ apiOptions = {}, params = null } = {}) => {
  const state = store.getState();
  let url = invoicesEndpoints.index.url.replace(
    ':company_id',
    state.companies.currentCompanyId
  );
  if (params) {
    url += `?${params}`;
  }
  return API(apiOptions)({
    url,
    method: invoicesEndpoints.index.method,
  });
};

export const createInvoice = async ({
  sale,
  invoiceType,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: invoicesEndpoints.create.url.replace(':sale_id', sale.id),
    method: invoicesEndpoints.create.method,
    data: { invoice_type: invoiceType },
  });

export const updateInvoice = async ({
  sale,
  invoice,
  invoiceType,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: invoicesEndpoints.update.url
      .replace(':sale_id', sale.id)
      .replace(':invoice_id', invoice.id),
    method: invoicesEndpoints.update.method,
    data: { invoice_type: invoiceType },
  });

export const cancelInvoice = async ({ sale, invoice, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: invoicesEndpoints.cancel.url
      .replace(':sale_id', sale.id)
      .replace(':invoice_id', invoice.id),
    method: invoicesEndpoints.cancel.method,
  });

export const createReturnInvoice = async ({
  sale,
  invoice,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: invoicesEndpoints.createReturn.url
      .replace(':sale_id', sale.id)
      .replace(':invoice_id', invoice.id),
    method: invoicesEndpoints.createReturn.method,
  });

export const createGroupInvoice = async ({
  sales_ids,
  apiOptions = {},
} = {}) => {
  const state = store.getState();
  return API(apiOptions)({
    url: invoicesEndpoints.createGroup.url.replace(
      ':company_id',
      state.companies.currentCompanyId
    ),
    method: invoicesEndpoints.createGroup.method,
    data: { sales_ids },
  });
};

export const showInvoice = ({ id, apiOptions = {} } = {}) =>
  API(apiOptions)({
    url: invoicesEndpoints.show.url.replace(':invoice_id', id),
    method: invoicesEndpoints.show.method,
  });

const regimesEspecialTributacaoDefault = [
  {
    codigo: 0,
    value: 0,
    nome: '-',
    label: '-',
  },
  {
    codigo: 1,
    value: 1,
    nome: 'Microempresa Municipal',
    label: 'Microempresa Municipal',
  },
  {
    codigo: 2,
    value: 2,
    nome: 'Estimativa',
    label: 'Estimativa',
  },
  {
    codigo: 3,
    value: 3,
    nome: 'Sociedade de Profissionais',
    label: 'Sociedade de Profissionais',
  },
  {
    codigo: 4,
    value: 4,
    nome: 'Cooperativa',
    label: 'Cooperativa',
  },
  {
    codigo: 5,
    value: 5,
    nome: 'MEI - Simples Nacional',
    label: 'MEI - Simples Nacional',
  },
  {
    codigo: 6,
    value: 6,
    nome: 'ME EPP - Simples Nacional',
    label: 'ME EPP - Simples Nacional',
  },
];

export const getCityConfigs = (cityId) => {
  // console.log({ cityId });

  // São José dos Campos - SP
  // cityId = 3825
  // IBGE = 3549904
  if (cityId === 3825) {
    return {
      regimesEspecialTributacao: regimesEspecialTributacaoDefault,
    };
  }

  // São José - SC
  // cityId = 4560
  // IBGE = 4216602
  if (cityId === 4560) {
    return {
      regimesEspecialTributacao: regimesEspecialTributacaoDefault,
    };
  }

  // Belo Horizonte - MG
  // cityId = 2310
  // IBGE = 3106200
  if (cityId === 2310) {
    return {
      regimesEspecialTributacao: regimesEspecialTributacaoDefault,
    };
  }

  // Santana de Parnaíba - SP
  // cityId = 3796
  // IBGE =
  if (cityId === 3796) {
    return {
      regimesEspecialTributacao: [
        {
          codigo: '1',
          nome: 'Normal',
        },
        {
          codigo: '2',
          nome: 'ISSQN fixo',
        },
        {
          codigo: '3',
          nome: 'ISSQN isento',
        },
        {
          codigo: '4',
          nome: 'ISSQN estimado',
        },
        {
          codigo: '5',
          nome: 'ISSQN imune',
        },
      ],
    };
  }

  // São Paulo - SP
  // cityId = 3830
  // IBGE =
  if (cityId === 3830) {
    return {
      regimesEspecialTributacao: [
        {
          codigo: '0',
          nome: 'Normal',
        },
        {
          codigo: '1',
          nome: 'Isenta',
        },
        {
          codigo: '2',
          nome: 'Imune',
        },
        {
          codigo: '3',
          nome: 'Suspenso / decisão judicial',
        },
      ],
    };
  }

  // Campinas - SP
  // cityId = 3376
  // IBGE = 3509502
  if (cityId === 3376) {
    return {
      regimesEspecialTributacao: [
        {
          codigo: 'C',
          nome: 'C - Isenta de ISS',
        },
        {
          codigo: 'E',
          nome: 'E - Não incidência no Munícipio',
        },
        {
          codigo: 'F',
          nome: 'F - Imune',
        },
        {
          codigo: 'K',
          nome: 'K - Exigibilidade Suspensa por decisão Judicial ou processo administrativo',
        },
        {
          codigo: 'N',
          nome: 'N - Não tributável',
        },
        {
          codigo: 'T',
          nome: 'T - Tributável',
        },
        {
          codigo: 'G',
          nome: 'G - Tributável Fixo',
        },
        {
          codigo: 'H',
          nome: 'H - Tributável S.N.',
        },
        {
          codigo: 'M',
          nome: 'M - Micro Empreendedor Individual (MEI)',
        },
      ],
    };
  }

  // Florianópolis - SC
  // cityId = 4399
  // IBGE = 4205407
  if (cityId === 4399) {
    return {
      regimesEspecialTributacao: [
        {
          codigo: 0,
          nome: '0 - Tributada Integralmente',
        },
        {
          codigo: 1,
          nome: '1 - Tributada Integralmente e sujeita ao regime do Simples Nacional',
        },
        {
          codigo: 2,
          nome: '2 - Tributada Integralmente e com ISQN retido na fonte',
        },
        {
          codigo: 3,
          nome: '3 - Tributada Integralmente, sujeita ao regime do Simples Nacional e com ISQN retino na Fonte',
        },
        {
          codigo: 4,
          nome: '4 - Tributada Integralmente e sujeita ao regime da substituição tributária',
        },
        {
          codigo: 5,
          nome: '5 - Tributada Integralmente e sujeita ao regime de substituição tributária pelo agenciador ou idermediário da prestação do serviço',
        },
        {
          codigo: 6,
          nome: '6 - Tributada Integralmente, sujeita ao regime do Simples Nacional e da substituição tributária',
        },
        {
          codigo: 7,
          nome: '7 - Tributada Integralmente, e com ISQN retido anteriormente pelo substituto tributário',
        },
        {
          codigo: 8,
          nome: '8 - Tributada Integralmente com redução de base de cálculo ou alíquota',
        },
        {
          codigo: 9,
          nome: '9 - Tributada com redução de base de cálculo ou alíquota e com ISQN retido na fonte',
        },
        {
          codigo: 10,
          nome: '10 - Tributada com redução de base de cálculo ou alíquota e sujeita ao regime da substituição tributária',
        },
        {
          codigo: 11,
          nome: '11 - Tributada com redução de base de cálculo ou alíquota e com ISQN retido anteriormente pelo substituto tributário',
        },
        {
          codigo: 12,
          nome: '12 - Isenta ou imune',
        },
        {
          codigo: 13,
          nome: '13 - Não tributada',
        },
        {
          codigo: 14,
          nome: '14 - Tributada por meio do imposto fixo',
        },
        {
          codigo: 15,
          nome: '15 - Não tributada em razão do destino dos bens ou objetos - Mercadorias para industrialização ou comercialização',
        },
        {
          codigo: 16,
          nome: '16 - Não tributada em razão do deferimento da prestação do serviço',
        },
      ],
    };
  }

  // Brasília - DF
  // cityId = 5570
  // IBGE = 5300108
  if (cityId === 5570) {
    return {
      // Brasília - DF não usa o regime especial de tributação
      regimesEspecialTributacao: [],
    };
  }

  // Rio de Janeiro - RJ
  // cityId = 3243
  // IBGE = 3304557
  if (cityId === 3243) {
    return {
      regimesEspecialTributacao: [
        {
          codigo: 0,
          nome: 'Nenhum',
        },
        {
          codigo: 1,
          nome: 'Microempresa Municipal',
        },
        {
          codigo: 2,
          nome: 'Sociedade de Profissionais',
        },
        {
          codigo: 3,
          nome: 'Microempreendedor Individual (MEI)',
        },
        {
          codigo: 4,
          nome: 'Art. 33, inc. II, item 8, Lei n 691/84',
        },
      ],
    };
  }

  return {
    regimesEspecialTributacao: [],
  };
};
