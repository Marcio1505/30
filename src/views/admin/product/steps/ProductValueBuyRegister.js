import React from 'react';
import { Field } from 'formik';
import { Row, Col, FormGroup, Label } from 'reactstrap';
import * as Yup from 'yup';
import { InputProcentagemAndReais } from './components/InputProcentagemAndReais';

export const ProductValueBuyRegister = () => (
  <Row>
    <Col md="6">
      <FormGroup>
        <Label for="purchaseCost">Custo de Compra</Label>
        <Field name="purchaseCost" type="text" className="form-control" />
        {/* <ErrorMessage
          name="purchaseCost"
          component="div"
          className="text-danger"
        /> */}
      </FormGroup>
    </Col>
    <Col md="6">
      <InputProcentagemAndReais label="Desconto" name="discount" />
    </Col>
    <Col md="6">
      <InputProcentagemAndReais label="Acrescimo" name="addition" />
    </Col>
    <Col md="6">
      <InputProcentagemAndReais label="IPI" name="ipi" />
    </Col>

    <Col md="6">
      <InputProcentagemAndReais label="Frete" name="freight" />
    </Col>
    <Col md="6">
      <FormGroup>
        <Label for="additionalExpenses">Despesas Acessórias</Label>
        <Field name="additionalExpenses" type="text" className="form-control" />
        {/* <ErrorMessage
          name="additionalExpenses"
          component="div"
          className="text-danger"
        /> */}
      </FormGroup>
    </Col>
    <Col md="6">
      <FormGroup>
        <Label for="taxSubstitution">Substituição tributária</Label>
        <Field name="taxSubstitution" type="text" className="form-control" />
        {/* <ErrorMessage
          name="taxSubstitution"
          component="div"
          className="text-danger"
        /> */}
      </FormGroup>
    </Col>
    <Col md="6">
      <InputProcentagemAndReais
        label="Diferencial de Alíquota"
        name="taxDifference"
      />
    </Col>
    <Col md="6">
      <InputProcentagemAndReais label="ICMS-ST Difal" name="icmsStDifal" />
    </Col>
    <Col md="6">
      <FormGroup>
        <Label for="averageCost">Custo Médio</Label>
        <Field name="averageCost" type="text" className="form-control" />
        {/* <ErrorMessage
          name="averageCost"
          component="div"
          className="text-danger"
        /> */}
      </FormGroup>
    </Col>
    <Col md="6">
      <FormGroup>
        <Label for="totalCost">Custo Total Produto/Serviço</Label>
        <Field name="totalCost" type="text" className="form-control" />
        {/* <ErrorMessage
          name="totalCost"
          component="div"
          className="text-danger"
        /> */}
      </FormGroup>
    </Col>
    <Col md="6">
      <InputProcentagemAndReais label="Comissão" name="commission" />
    </Col>
    <Col md="6">
      <FormGroup>
        <Label for="weight">Peso</Label>
        <Field name="weight" type="text" className="form-control" />
        {/* <ErrorMessage name="weight" component="div" className="text-danger" /> */}
      </FormGroup>
    </Col>
    <Col md="6">
      <FormGroup>
        <Label for="barcode">Código de Barras</Label>
        <Field name="barcode" type="text" className="form-control" />
      </FormGroup>
    </Col>
  </Row>
);
export const validationSchema = Yup.object();
