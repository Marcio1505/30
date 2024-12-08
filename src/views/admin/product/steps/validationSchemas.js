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
    purchaseCost: Yup.number().required('Custo de Compra é obrigatório'),
    discount: Yup.number().required('Desconto é obrigatório'),
    addition: Yup.number().required('Acrescimo é obrigatório'),
    ipi: Yup.number().required('IPI é obrigatório'),
    freight: Yup.number().required('Frete é obrigatório'),
    additionalExpenses: Yup.number().required(
      'Despesas Acessórias são obrigatórias'
    ),
    taxSubstitution: Yup.number().required(
      'Substituição tributária é obrigatória'
    ),
    taxDifference: Yup.number().required(
      'Diferencial de Alíquota é obrigatório'
    ),
    icmsStDifal: Yup.number().required('ICMS-ST Difal é obrigatório'),
    averageCost: Yup.number().required('Custo Médio é obrigatório'),
    totalCost: Yup.number().required(
      'Custo Total Produto/Serviço é obrigatório'
    ),
    commission: Yup.number().required('Comissão é obrigatória'),
    weight: Yup.number().required('Peso é obrigatório'),
    barcode: Yup.string().required('Código de Barras é obrigatório'),
  }),
  Yup.object().shape({
    minStock: Yup.number()
      .required('Quantidade Mínima Estoque é obrigatória')
      .min(0, 'Quantidade Mínima Estoque deve ser maior ou igual a 0'),
    maxStock: Yup.number()
      .required('Quantidade Máxima Estoque é obrigatória')
      .min(0, 'Quantidade Máxima Estoque deve ser maior ou igual a 0'),
    netWeight: Yup.number()
      .required('Peso Líquido é obrigatório')
      .min(0, 'Peso Líquido deve ser maior ou igual a 0'),
    grossWeight: Yup.number()
      .required('Peso Bruto é obrigatório')
      .min(0, 'Peso Bruto deve ser maior ou igual a 0'),
    height: Yup.number()
      .required('Altura é obrigatória')
      .min(0, 'Altura deve ser maior ou igual a 0'),
    width: Yup.number()
      .required('Largura é obrigatória')
      .min(0, 'Largura deve ser maior ou igual a 0'),
    length: Yup.number()
      .required('Comprimento é obrigatório')
      .min(0, 'Comprimento deve ser maior ou igual a 0'),
    stockLocation: Yup.string().required('Local de estoque é obrigatório'),
    registrationDate: Yup.date().required('Data do Cadastro é obrigatória'),
    lastUpdateDate: Yup.date().required(
      'Data da Última atualização é obrigatória'
    ),
    lastUpdateUser: Yup.string().required(
      'Usuário da última Atualização é obrigatório'
    ),
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
