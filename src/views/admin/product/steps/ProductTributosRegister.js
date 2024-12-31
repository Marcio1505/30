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
        name="fiscal_code"
        id="fiscal_code"
        label="Código Fiscal"
      />
      <TextFieldController
        name="icms_aliquot"
        id="icms_aliquot"
        label="ICMS Alíquota"
      />
      <TextFieldController name="ipi_cst" id="ipi_cst" label="IPI CIST *" />
      <TextFieldController
        name="cfop_out_state"
        id="cfop_out_state"
        label="CFOP Venda no estado *"
      />
      <TextFieldController
        name="return_cfop_out_state"
        id="return_cfop_out_state"
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
      <TextFieldController
        name="fiscal_origin"
        id="fiscal_origin"
        label="Origem"
      />
      <TextFieldController name="pis_cst" id="pis_cst" label="PIS CIST *" />
      <TextFieldController
        name="ipi_aliquot"
        id="ipi_aliquot"
        label="IPI Alíquota"
      />
      <TextFieldController
        name="return_cfop_in_state"
        id="return_cfop_in_state"
        label="CFOP Devolução no estado *"
      />
      <TextFieldController
        name="tax_benefit_code"
        id="tax_benefit_code"
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
      <TextFieldController name="ncm" id="ncm" label="NCM * " />
      <TextFieldController
        name="pis_aliquot"
        id="pis_aliquot"
        label="PIS Alíquota"
      />
      <TextFieldController
        name="ipi_code"
        id="ipi_code"
        label="PIP Código de Enquadramento"
      />
      <TextFieldController
        name="return_cfop_international"
        id="return_cfop_international"
        label="CFOP Venda fora do estado"
      />

      <TextFieldController
        name="aditional_info"
        id="aditional_info"
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
        name="measurement_unit"
        id="measurement_unit"
        label="Unidade de Medida"
      />
      <TextFieldController
        name="cofins_cst"
        id="cofins_cst"
        label="CONFINS CST *"
      />

      <TextFieldController name="fonte" id="fonte" label="Fonte" />
      <TextFieldController
        name="return_cfop_international"
        id="return_cfop_international"
        label="CFOP Devolução fora do estado *"
      />

      <FormGroup>
        <Label for="description_service">Descrição</Label>
        <Field
          type="text"
          name="description_service"
          id="description_service"
          className="form-control"
        />
        <ErrorMessage
          className="text-danger"
          name="descricao_service"
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
        name="icms_cst"
        id="icms_cst"
        label="ICMS CST *"
        type="text"
      />
      <TextFieldController
        name="cofins_aliquot"
        id="cofins_aliquot"
        label="COFINS Alíquota"
        type="text"
      />

      <TextFieldController
        name="simplified_tax_percentage"
        id="simplified_tax_percentage"
        label="Porcentagem Tributo Simplificado"
        type="text"
      />

      <TextFieldController
        name="cfop_international"
        id="cfop_international"
        label="CFOP Venda no exterior"
        type="text"
      />
    </Col>
  </Row>
);
