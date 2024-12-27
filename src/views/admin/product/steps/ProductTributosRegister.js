import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Row, Col, FormGroup, Label } from 'reactstrap';
import {
  TextFieldController,
  SelectSearchController,
} from '../../../../components/inputs/controlled';
import { purchasingAndSellingUnit } from '../../../../data/produts';

export const ProductTributosRegister = () => (
  <Row form xs="5">
    <Col xs="2">
      <TextFieldController
        name="codigoFiscal"
        id="codigoFiscal"
        label="Código Fiscal"
      />
      <TextFieldController
        name="ICMSAliquota"
        id="ICMSAliquota"
        label="ICMS Alíquota"
      />
      <TextFieldController name="IPICIST" id="IPICIST" label="IPI CIST *" />
      <TextFieldController
        name="CFOPVendaEstado"
        id="CFOPVendaEstado"
        label="CFOP Venda no estado *"
      />
      <TextFieldController
        name="CFOPDevolucaoExterior"
        id="CFOPDevolucaoExterior"
        label="CFOP Devolução no exterior"
      />
      <SelectSearchController
        id="unidadeCompra"
        isClearable
        isSearchable
        label="Unidade de Compra"
        options={[...purchasingAndSellingUnit]}
      />
    </Col>
    <Col>
      <TextFieldController name="origem" id="origem" label="Origem" />
      <TextFieldController name="PISCIST" id="PISCIST" label="PIS CIST *" />
      <TextFieldController
        name="IPIAliquota"
        id="IPIAliquota"
        label="IPI Alíquota"
      />
      <TextFieldController
        name="CFOPDevolucaoEstado"
        id="CFOPDevolucaoEstado"
        label="CFOP Devolução no estado *"
      />
      <TextFieldController
        name="beneficioFiscal"
        id="beneficioFiscal"
        label="Benefício Fiscal"
      />

      <SelectSearchController
        id="unidadeVenda"
        isClearable
        isSearchable
        label="Unidade de Venda"
        options={[...purchasingAndSellingUnit]}
      />
    </Col>
    <Col>
      <TextFieldController name="NCM" id="NCM" label="NCM * " />
      <TextFieldController
        name="PISAliquota"
        id="PISAliquota"
        label="PIS Alíquota"
      />
      <TextFieldController
        name="PIPCodigoEnquadramento"
        id="PIPCodigoEnquadramento"
        label="PIP Código de Enquadramento"
      />
      <TextFieldController
        name="CFOPVendaForaEstado"
        id="CFOPVendaForaEstado"
        label="PCFOP Venda fora do estado"
      />

      <TextFieldController
        name="informacoesAdicional"
        id="informacoesAdicional"
        label="Informações Adicional"
      />

      <TextFieldController
        name="fatorConversao"
        id="fatorConversao"
        label="Fator de Conversão"
      />
    </Col>
    <Col>
      <TextFieldController
        name="unidadeMedida"
        id="unidadeMedida"
        label="Unidade de Medida"
      />
      <TextFieldController
        name="COFINSCST"
        id="COFINSCST"
        label="CONFINS CST *"
      />

      <TextFieldController name="fonte" id="fonte" label="Fonte" />
      <TextFieldController
        name="CFOPDevolucaoForaEstado"
        id="CFOPDevolucaoForaEstado"
        label="CFOP Devolução fora do estado *"
      />

      <FormGroup>
        <Label for="descricao">Descrição</Label>
        <Field
          type="text"
          name="descricao"
          id="descricao"
          className="form-control"
        />
        <ErrorMessage
          className="text-danger"
          name="descricao"
          component="div"
        />
      </FormGroup>
      <TextFieldController
        name="substituicaoTributaria"
        id="substituicaoTributaria"
        label="Substituição Tributária"
      />
    </Col>
    <Col>
      <TextFieldController
        name="ICMSCST"
        id="ICMSCST"
        label="PICMS CST *"
        type="text"
      />
      <TextFieldController
        name="COFINSAliquota"
        id="COFINSAliquota"
        label="COFINS Alíquota"
        type="text"
      />

      <TextFieldController
        name="porcentagemTributoSimplificado"
        id="porcentagemTributoSimplificado"
        label="Porcentagem Tributo Simplificado"
        type="text"
      />

      <TextFieldController
        name="CFOPVendaExterior"
        id="CFOPVendaExterior"
        label="CFOP Venda no exterior"
        type="text"
      />
    </Col>
  </Row>
);
