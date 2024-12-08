import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Row, Col, FormGroup, Label } from 'reactstrap';
import Switch from 'react-switch';

export const ProductBasicRegister = () => (
  <>
    <Row>
      <Col sm="6">
        <FormGroup>
          <Label for="nome">Nome</Label>
          <Field
            id="nome"
            name="nome"
            className="form-control"
            placeholder="Seu nome"
          />
          <ErrorMessage name="nome" />
        </FormGroup>
      </Col>
      <Col sm="6">
        <Label for="codigoProduto">Código do Produto</Label>
        <Field
          id="codigoProduto"
          name="codigoProduto"
          className="form-control"
          placeholder="Código do produto"
        />
      </Col>
    </Row>
    <Row>
      <Col sm="6">
        <Label for="referencia">Referência</Label>
        <Field
          id="referencia"
          name="referencia"
          className="form-control"
          placeholder="Referência"
        />
      </Col>
    </Row>
    <Row>
      <Col sm="6">
        <Label for="fornecedor">Fornecedor</Label>
        <Field
          as="select"
          id="fornecedor"
          name="fornecedor"
          className="form-control"
        >
          <option value="">Selecione o fornecedor</option>
          <option value="fornecedor1">Fornecedor 1</option>
          <option value="fornecedor2">Fornecedor 2</option>
        </Field>
      </Col>
      <Col sm="6">
        <Label for="vencimentoProduto">Vencimento do Produto</Label>
        <Field
          id="vencimentoProduto"
          name="vencimentoProduto"
          type="date"
          className="form-control"
        />
      </Col>
    </Row>
    <Row>
      <Col sm="6">
        <Label for="precoVenda">Preço de Venda</Label>
        <Field
          id="precoVenda"
          name="precoVenda"
          type="number"
          className="form-control"
          placeholder="Preço de venda"
        />
      </Col>
      <Col sm="6">
        <Label for="opcoesVenda">Opções de Venda</Label>
        <Field
          id="opcoesVenda"
          name="opcoesVenda"
          className="form-control"
          placeholder="Opções de venda"
        />
      </Col>
    </Row>
    <Row>
      <Col sm="12">
        <Label for="descricao">Descrição</Label>
        <Field
          id="descricao"
          name="descricao"
          as="textarea"
          className="form-control"
          placeholder="Descrição do produto"
        />
      </Col>
    </Row>
    <Row>
      <Col sm="6">
        <Label for="tipo">Tipo</Label>
        <Field as="select" id="tipo" name="tipo" className="form-control">
          <option value="">Selecione o tipo</option>
          <option value="tipo1">Tipo 1</option>
          <option value="tipo2">Tipo 2</option>
        </Field>
        <ErrorMessage name="tipo" />
      </Col>
      <Col sm="6">
        <Label for="grupo">Grupo</Label>
        <Field as="select" id="grupo" name="grupo" className="form-control">
          <option value="">Selecione o grupo</option>
          <option value="grupo1">Grupo 1</option>
          <option value="grupo2">Grupo 2</option>
        </Field>
      </Col>
    </Row>
    <Row>
      <Col sm="3">
        <Label>
          <Field name="ativarDesativar">
            {({ field, form }) => (
              <Switch
                {...field} // Passa o field para o switch
                checked={field.value} // Usa o valor atual
                onChange={(checked) => form.setFieldValue(field.name, checked)} // Atualiza o valor
                uncheckedIcon={false} // Remove o ícone de quando está desativado
                checkedIcon={false} // Remove o ícone de quando está ativado
              />
            )}
          </Field>
          Ativar/Desativar
        </Label>
      </Col>
      <Col sm="3">
        <Label>
          <Field name="contabilizarEstoque">
            {({ field, form }) => (
              <Switch
                {...field} // Passa o field para o switch
                checked={field.value} // Usa o valor atual
                onChange={(checked) => form.setFieldValue(field.name, checked)} // Atualiza o valor
                uncheckedIcon={false} // Remove o ícone de quando está desativado
                checkedIcon={false} // Remove o ícone de quando está ativado
              />
            )}
          </Field>
          Contabilizar Estoque
        </Label>
      </Col>
      <Col sm="3">
        <Label>
          <Field name="indisponivelVenda">
            {({ field, form }) => (
              <Switch
                {...field} // Passa o field para o switch
                checked={field.value} // Usa o valor atual
                onChange={(checked) => form.setFieldValue(field.name, checked)} // Atualiza o valor
                uncheckedIcon={false} // Remove o ícone de quando está desativado
                checkedIcon={false} // Remove o ícone de quando está ativado
              />
            )}
          </Field>
          Indisponível para Venda
        </Label>
      </Col>
      <Col sm="3">
        <Label>
          <Field name="vendaSites">
            {({ field, form }) => (
              <Switch
                {...field} // Passa o field para o switch
                checked={field.value} // Usa o valor atual
                onChange={(checked) => form.setFieldValue(field.name, checked)} // Atualiza o valor
                uncheckedIcon={false} // Remove o ícone de quando está desativado
                checkedIcon={false} // Remove o ícone de quando está ativado
              />
            )}
          </Field>
          Venda em Sites
        </Label>
      </Col>
    </Row>
  </>
);
