import * as Yup from 'yup';

export const validationSchemas = [
  Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    code: Yup.string(),
    referencia: Yup.string(),
    supplier: Yup.array().of(
      Yup.object().shape({
        id: Yup.number(),
        company_name: Yup.string(),
        trading_name: Yup.string(),
        document: Yup.string(),
        value: Yup.number(),
        label: Yup.string(),
      })
    ),
    vencimentoProduto: Yup.date().min(
      new Date(),
      'A data de vencimento não pode ser no passado'
    ),
    precoVenda: Yup.number(),
    opcoesVenda: Yup.string(),
    description_item: Yup.string(),
    product_type: Yup.string().required('Tipo é obrigatório'),
    group: Yup.string(), // Changed 'grupo' to 'group'
  }),
  Yup.object().shape({
    fiscal_code: Yup.string(),
    origem: Yup.string(),
    ncm: Yup.string().required('NCM é obrigatório'),
    measurement_unit: Yup.string(),
    ICMSCST: Yup.string().required('ICMS CST é obrigatório'),
    ICMSAliquota: Yup.string(),
    PISCIST: Yup.string().required('PIS CIST é obrigatório'),
    pis_aliquot: Yup.string(),
    cofins_cst: Yup.string().required('COFINS CST é obrigatório'),
    cofins_aliquot: Yup.string(),
    IPICIST: Yup.string().required('IPI CIST é obrigatório'),
    ipi_aliquot: Yup.string(),
    ipi_code: Yup.string(),
    fonte: Yup.string(),
    simplified_tax_percentage: Yup.string(),
    CFOPVendaEstado: Yup.string().required(
      'CFOP Venda no estado é obrigatório'
    ),
    CFOPDevolucaoEstado: Yup.string().required(
      'CFOP Devolução no estado é obrigatório'
    ),
    CFOPVendaForaEstado: Yup.string(),
    return_cfop_international: Yup.string().required(
      'CFOP Devolução fora do estado é obrigatório'
    ),
    CFOPVendaExterior: Yup.string(),
    CFOPDevolucaoExterior: Yup.string(),
    beneficioFiscal: Yup.string(),
    aditional_info: Yup.string(),
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
        id: Yup.string().nullable(),
        product: Yup.string().nullable(),
        quantity: Yup.number()
          .min(0, 'Quantidade deve ser maior ou igual a 0')
          .nullable(),
        unit: Yup.string().nullable(),
      })
    ),
  }),
];
