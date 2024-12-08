import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Row, Col, FormGroup, Label } from 'reactstrap';

export const ProductTributosRegister = () => (
  <>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="codigoFiscal">Código Fiscal</Label>
          <Field
            type="text"
            name="codigoFiscal"
            id="codigoFiscal"
            className="form-control"
          />
          <ErrorMessage name="codigoFiscal" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="origem">Origem</Label>
          <Field
            type="text"
            name="origem"
            id="origem"
            className="form-control"
          />
          <ErrorMessage name="origem" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="NCM">NCM</Label>
          <Field type="text" name="NCM" id="NCM" className="form-control" />
          <ErrorMessage name="NCM" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="unidadeMedida">Unidade de Medida</Label>
          <Field
            type="text"
            name="unidadeMedida"
            id="unidadeMedida"
            className="form-control"
          />
          <ErrorMessage name="unidadeMedida" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="ICMSCST">ICMS CST</Label>
          <Field
            type="text"
            name="ICMSCST"
            id="ICMSCST"
            className="form-control"
          />
          <ErrorMessage name="ICMSCST" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="ICMSAliquota">ICMS Alíquota</Label>
          <Field
            type="text"
            name="ICMSAliquota"
            id="ICMSAliquota"
            className="form-control"
          />
          <ErrorMessage name="ICMSAliquota" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="PISCIST">PIS CIST</Label>
          <Field
            type="text"
            name="PISCIST"
            id="PISCIST"
            className="form-control"
          />
          <ErrorMessage name="PISCIST" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="PISAliquota">PIS Alíquota</Label>
          <Field
            type="text"
            name="PISAliquota"
            id="PISAliquota"
            className="form-control"
          />
          <ErrorMessage name="PISAliquota" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="COFINSCST">COFINS CST</Label>
          <Field
            type="text"
            name="COFINSCST"
            id="COFINSCST"
            className="form-control"
          />
          <ErrorMessage name="COFINSCST" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="COFINSAliquota">COFINS Alíquota</Label>
          <Field
            type="text"
            name="COFINSAliquota"
            id="COFINSAliquota"
            className="form-control"
          />
          <ErrorMessage name="COFINSAliquota" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="IPICIST">IPI CIST</Label>
          <Field
            type="text"
            name="IPICIST"
            id="IPICIST"
            className="form-control"
          />
          <ErrorMessage name="IPICIST" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="IPIAliquota">IPI Alíquota</Label>
          <Field
            type="text"
            name="IPIAliquota"
            id="IPIAliquota"
            className="form-control"
          />
          <ErrorMessage name="IPIAliquota" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
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
          <ErrorMessage name="PIPCodigoEnquadramento" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="fonte">Fonte</Label>
          <Field type="text" name="fonte" id="fonte" className="form-control" />
          <ErrorMessage name="fonte" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
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
          <ErrorMessage name="porcentagemTributoSimplificado" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="CFOPVendaEstado">CFOP Venda no estado</Label>
          <Field
            type="text"
            name="CFOPVendaEstado"
            id="CFOPVendaEstado"
            className="form-control"
          />
          <ErrorMessage name="CFOPVendaEstado" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="CFOPDevolucaoEstado">CFOP Devolução no estado</Label>
          <Field
            type="text"
            name="CFOPDevolucaoEstado"
            id="CFOPDevolucaoEstado"
            className="form-control"
          />
          <ErrorMessage name="CFOPDevolucaoEstado" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="CFOPVendaForaEstado">CFOP Venda fora do estado</Label>
          <Field
            type="text"
            name="CFOPVendaForaEstado"
            id="CFOPVendaForaEstado"
            className="form-control"
          />
          <ErrorMessage name="CFOPVendaForaEstado" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="CFOPDevolucaoForaEstado">
            CFOP Devolução fora do estado
          </Label>
          <Field
            type="text"
            name="CFOPDevolucaoForaEstado"
            id="CFOPDevolucaoForaEstado"
            className="form-control"
          />
          <ErrorMessage name="CFOPDevolucaoForaEstado" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="CFOPVendaExterior">CFOP Venda no exterior</Label>
          <Field
            type="text"
            name="CFOPVendaExterior"
            id="CFOPVendaExterior"
            className="form-control"
          />
          <ErrorMessage name="CFOPVendaExterior" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="CFOPDevolucaoExterior">CFOP Devolução no exterior</Label>
          <Field
            type="text"
            name="CFOPDevolucaoExterior"
            id="CFOPDevolucaoExterior"
            className="form-control"
          />
          <ErrorMessage name="CFOPDevolucaoExterior" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="beneficioFiscal">Benefício Fiscal</Label>
          <Field
            type="text"
            name="beneficioFiscal"
            id="beneficioFiscal"
            className="form-control"
          />
          <ErrorMessage name="beneficioFiscal" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="informacoesAdicional">Informações Adicional</Label>
          <Field
            type="text"
            name="informacoesAdicional"
            id="informacoesAdicional"
            className="form-control"
          />
          <ErrorMessage name="informacoesAdicional" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="descricao">Descrição</Label>
          <Field
            type="text"
            name="descricao"
            id="descricao"
            className="form-control"
          />
          <ErrorMessage name="descricao" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
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
          <ErrorMessage name="unidadeCompra" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
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
          <ErrorMessage name="unidadeVenda" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="fatorConversao">Fator de Conversão</Label>
          <Field
            type="text"
            name="fatorConversao"
            id="fatorConversao"
            className="form-control"
          />
          <ErrorMessage name="fatorConversao" component="div" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="substituicaoTributaria">Substituição Tributária</Label>
          <Field
            type="text"
            name="substituicaoTributaria"
            id="substituicaoTributaria"
            className="form-control"
          />
          <ErrorMessage name="substituicaoTributaria" component="div" />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="curvaABC">Curva ABC</Label>
          <Field
            as="select"
            name="curvaABC"
            id="curvaABC"
            className="form-control"
          >
            <option value="">Selecione</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </Field>
          <ErrorMessage name="curvaABC" component="div" />
        </FormGroup>
      </Col>
    </Row>
  </>
);
