import * as Yup from 'yup';

export const validationSchemas = [
  Yup.object().shape({
    nome: Yup.string().required('Nome é obrigatório'),
    codigoProduto: Yup.string(),
    referencia: Yup.string(),
    fornecedor: Yup.string(),
    vencimentoProduto: Yup.date().min(
      new Date(),
      'A data de vencimento não pode ser no passado'
    ),
    precoVenda: Yup.number(),
    opcoesVenda: Yup.string(),
    descricao: Yup.string(),
    tipo: Yup.string().required('Tipo é obrigatório'),
    grupo: Yup.string(),
  }),
  Yup.object().shape({
    codigoFiscal: Yup.string(),
    origem: Yup.string(),
    NCM: Yup.string().required('NCM é obrigatório'),
    unidadeMedida: Yup.string(),
    ICMSCST: Yup.string().required('ICMS CST é obrigatório'),
    ICMSAliquota: Yup.string(),
    PISCIST: Yup.string().required('PIS CIST é obrigatório'),
    PISAliquota: Yup.string(),
    COFINSCST: Yup.string().required('COFINS CST é obrigatório'),
    COFINSAliquota: Yup.string(),
    IPICIST: Yup.string().required('IPI CIST é obrigatório'),
    IPIAliquota: Yup.string(),
    PIPCodigoEnquadramento: Yup.string(),
    fonte: Yup.string(),
    porcentagemTributoSimplificado: Yup.string(),
    CFOPVendaEstado: Yup.string().required(
      'CFOP Venda no estado é obrigatório'
    ),
    CFOPDevolucaoEstado: Yup.string().required(
      'CFOP Devolução no estado é obrigatório'
    ),
    CFOPVendaForaEstado: Yup.string(),
    CFOPDevolucaoForaEstado: Yup.string().required(
      'CFOP Devolução fora do estado é obrigatório'
    ),
    CFOPVendaExterior: Yup.string(),
    CFOPDevolucaoExterior: Yup.string(),
    beneficioFiscal: Yup.string(),
    informacoesAdicional: Yup.string(),
    unidadeCompra: Yup.string(),
    unidadeVenda: Yup.string(),
    fatorConversao: Yup.string(),
    substituicaoTributaria: Yup.string(),
    curvaABC: Yup.string(),
  }),
  Yup.object().shape({
    purchaseCost: Yup.number(),
    discount: Yup.number(),
    addition: Yup.number(),
    ipi: Yup.number(),
    freight: Yup.number(),
    additionalExpenses: Yup.number(),
    taxSubstitution: Yup.number(),
    taxDifference: Yup.number(),
    icmsStDifal: Yup.number(),
    averageCost: Yup.number(),
    totalCost: Yup.number(),
    commission: Yup.number(),
    weight: Yup.number(),
    barcode: Yup.string(),
  }),
  Yup.object().shape({
    minStock: Yup.number(),
    maxStock: Yup.number(),
    netWeight: Yup.number(),
    grossWeight: Yup.number(),
    height: Yup.number(),
    width: Yup.number(),
    length: Yup.number(),
    stockLocation: Yup.string(),
    registrationDate: Yup.date(),
    lastUpdateDate: Yup.date(),
    lastUpdateUser: Yup.string(),
    productComposition: Yup.boolean(),
    products: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required('ID é obrigatório'),
        product: Yup.string().required('Produto é obrigatório'),
        quantity: Yup.number()
          .required('Quantidade é obrigatória')
          .min(0, 'Quantidade deve ser maior ou igual a 0'),
        unit: Yup.string().required('Unidade de Medida é obrigatória'),
      })
    ),
  }),
];
