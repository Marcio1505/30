import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Row, Col, FormGroup, Label } from 'reactstrap';
import { TextFieldController } from '../../../../components/inputs/controlled';

export const ProductTributosRegister = () => (
  <>
    <Row form xs="5">
      <Col xs="2">
        <TextFieldController
          name="codigoFiscal"
          id="codigoFiscal"
          label="Código Fiscal"
        />

        <FormGroup>
          <Label for="ICMSAliquota">ICMS Alíquota</Label>
          <Field
            type="text"
            name="ICMSAliquota"
            id="ICMSAliquota"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="ICMSAliquota"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="IPICIST">IPI CIST *</Label>
          <Field
            type="text"
            name="IPICIST"
            id="IPICIST"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="IPICIST"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="CFOPVendaEstado">CFOP Venda no estado *</Label>
          <Field
            type="text"
            name="CFOPVendaEstado"
            id="CFOPVendaEstado"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="CFOPVendaEstado"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="CFOPDevolucaoExterior">CFOP Devolução no exterior</Label>
          <Field
            type="text"
            name="CFOPDevolucaoExterior"
            id="CFOPDevolucaoExterior"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="CFOPDevolucaoExterior"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="unidadeCompra">Unidade de Compra</Label>
          <Field
            as="select"
            name="unidadeCompra"
            id="unidadeCompra"
            className="form-control"
          >
            <option value="">Selecione</option>
            <option value="unidade1">Unidade 1</option>
            <option value="unidade2">Unidade 2</option>
          </Field>
          <ErrorMessage
            className="text-danger"
            name="unidadeCompra"
            component="div"
          />
        </FormGroup>
      </Col>
      <Col>
        <TextFieldController name="origem" id="origem" label="Origem" />

        <FormGroup>
          <Label for="PISCIST">PIS CIST *</Label>
          <Field
            type="text"
            name="PISCIST"
            id="PISCIST"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="PISCIST"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="IPIAliquota">IPI Alíquota</Label>
          <Field
            type="text"
            name="IPIAliquota"
            id="IPIAliquota"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="IPIAliquota"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="CFOPDevolucaoEstado">CFOP Devolução no estado *</Label>
          <Field
            type="text"
            name="CFOPDevolucaoEstado"
            id="CFOPDevolucaoEstado"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="CFOPDevolucaoEstado"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="beneficioFiscal">Benefício Fiscal</Label>
          <Field
            type="text"
            name="beneficioFiscal"
            id="beneficioFiscal"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="beneficioFiscal"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="unidadeVenda">Unidade de Venda</Label>
          <Field
            as="select"
            name="unidadeVenda"
            id="unidadeVenda"
            className="form-control"
          >
            <option value="">Selecione</option>
            <option value="unidade1">Unidade 1</option>
            <option value="unidade2">Unidade 2</option>
          </Field>
          <ErrorMessage
            className="text-danger"
            name="unidadeVenda"
            component="div"
          />
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label for="NCM">NCM * </Label>
          <Field type="text" name="NCM" id="NCM" className="form-control" />
          <ErrorMessage className="text-danger" name="NCM" component="div" />
        </FormGroup>
        <FormGroup>
          <Label for="PISAliquota">PIS Alíquota</Label>
          <Field
            type="text"
            name="PISAliquota"
            id="PISAliquota"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="PISAliquota"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="PIPCodigoEnquadramento">
            PIP Código de Enquadramento
          </Label>
          <Field
            type="text"
            name="PIPCodigoEnquadramento"
            id="PIPCodigoEnquadramento"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="PIPCodigoEnquadramento"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="CFOPVendaForaEstado">CFOP Venda fora do estado</Label>
          <Field
            type="text"
            name="CFOPVendaForaEstado"
            id="CFOPVendaForaEstado"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="CFOPVendaForaEstado"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="informacoesAdicional">Informações Adicional</Label>
          <Field
            type="text"
            name="informacoesAdicional"
            id="informacoesAdicional"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="informacoesAdicional"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="fatorConversao">Fator de Conversão</Label>
          <Field
            type="text"
            name="fatorConversao"
            id="fatorConversao"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="fatorConversao"
            component="div"
          />
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label for="unidadeMedida">Unidade de Medida</Label>
          <Field
            type="text"
            name="unidadeMedida"
            id="unidadeMedida"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="unidadeMedida"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="COFINSCST">COFINS CST *</Label>
          <Field
            type="text"
            name="COFINSCST"
            id="COFINSCST"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="COFINSCST"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="fonte">Fonte</Label>
          <Field type="text" name="fonte" id="fonte" className="form-control" />
          <ErrorMessage className="text-danger" name="fonte" component="div" />
        </FormGroup>
        <FormGroup>
          <Label for="CFOPDevolucaoForaEstado">
            CFOP Devolução fora do estado *
          </Label>
          <Field
            type="text"
            name="CFOPDevolucaoForaEstado"
            id="CFOPDevolucaoForaEstado"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="CFOPDevolucaoForaEstado"
            component="div"
          />
        </FormGroup>
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
        <FormGroup>
          <Label for="substituicaoTributaria">Substituição Tributária</Label>
          <Field
            type="text"
            name="substituicaoTributaria"
            id="substituicaoTributaria"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="substituicaoTributaria"
            component="div"
          />
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label for="ICMSCST">ICMS CST *</Label>
          <Field
            type="text"
            name="ICMSCST"
            id="ICMSCST"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="ICMSCST"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="COFINSAliquota">COFINS Alíquota</Label>
          <Field
            type="text"
            name="COFINSAliquota"
            id="COFINSAliquota"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="COFINSAliquota"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="porcentagemTributoSimplificado">
            Porcentagem Tributo Simplificado
          </Label>
          <Field
            type="text"
            name="porcentagemTributoSimplificado"
            id="porcentagemTributoSimplificado"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="porcentagemTributoSimplificado"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="CFOPVendaExterior">CFOP Venda no exterior</Label>
          <Field
            type="text"
            name="CFOPVendaExterior"
            id="CFOPVendaExterior"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="CFOPVendaExterior"
            component="div"
          />
        </FormGroup>
        <FormGroup>
          <Label for="CFOPVendaExterior">Curva ABC</Label>
          <Field
            type="text"
            name="CFOPVendaExterior"
            id="CFOPVendaExterior"
            className="form-control"
          />
          <ErrorMessage
            className="text-danger"
            name="CFOPVendaExterior"
            component="div"
          />
        </FormGroup>
      </Col>
    </Row>
  </>
);
