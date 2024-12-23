import React from 'react';
import { Field } from 'formik';
import { Row, Col, FormGroup, Label, Card, CardImg } from 'reactstrap';
import {
  TextFieldController,
  SwitchController,
  SelectController,
} from '../../../../components/inputs/controlled';

const productTypes = [
  {
    value: 1,
    label: 'Produto',
  },
  {
    value: 2,
    label: 'Serviço',
  },
  {
    value: 3,
    label: 'Split (Produto e Serviço)',
  },
];

export const ProductBasicRegister = () => (
  <Row
    style={{
      display: 'flex',
      alignItems: 'start',
      marginTop: '18px',
      marginBottom: '15px',
    }}
  >
    <Col sm="3">
      <SwitchController name="ativarDesativar" label="Ativar/Desativar" />

      <TextFieldController
        id="name"
        name="name"
        label="Nome *"
        placeholder="Nome do produto"
      />

      <FormGroup>
        <Label for="supplier">Fornecedor</Label>
        <Field
          as="select"
          id="supplier"
          name="supplier"
          className="form-control"
        >
          <option value="">Selecione o fornecedor</option>
          <option value="fornecedor1">Fornecedor 1</option>
          <option value="fornecedor2">Fornecedor 2</option>
        </Field>
      </FormGroup>

      <FormGroup>
        <SelectController
          id="opcoesVenda"
          name="opcoesVenda"
          label="Opções de Venda *"
          options={[
            { value: 1, label: 'markup' },
            { value: 2, label: 'preço de venda' },
          ]}
        />
      </FormGroup>
      <TextFieldController
        id="group"
        name="group"
        label="Grupo"
        placeholder=""
      />
    </Col>

    <Col sm="3">
      <SwitchController
        name="contabilizarEstoque"
        label="Contabilizar Estoque"
      />

      <TextFieldController
        id="code"
        name="code"
        label="Código do Produto"
        placeholder="Código do produto"
      />

      <FormGroup>
        <Label for="vencimentoProduto">Vencimento do Produto</Label>
        <Field
          id="vencimentoProduto"
          name="vencimentoProduto"
          type="date"
          className="form-control"
        />
      </FormGroup>

      <TextFieldController
        id="description"
        name="description"
        label="Descrição"
        placeholder="Descrição do produto"
      />
      <SwitchController name="vendaSites" label="Venda em Sites" />
    </Col>
    <Col sm="3">
      <SwitchController
        name="indisponivelVenda"
        label="Indisponível para Venda"
      />

      <FormGroup>
        <Label for="referencia">Referência</Label>
        <Field
          id="referencia"
          name="referencia"
          className="form-control"
          placeholder="Referência"
        />
      </FormGroup>

      <FormGroup>
        <Label for="precoVenda">Preço de Venda</Label>
        <Field
          id="precoVenda"
          name="precoVenda"
          type="number"
          className="form-control"
          placeholder="Preço de venda"
        />
      </FormGroup>
      <SelectController
        id="product_type"
        name="product_type"
        label="Tipo *"
        options={productTypes}
      />
    </Col>
    <Col sm="3">
      <Card
        className="my-2"
        outline
        style={{
          width: '14',
          height: 'auto',
          borderRadius: '10px',
          border: '1px solid #c8c8c8',
        }}
      >
        <CardImg
          alt="Card image cap"
          src="https://picsum.photos/900/1200?grayscale"
          width="85%"
        />
      </Card>
    </Col>
  </Row>
);
