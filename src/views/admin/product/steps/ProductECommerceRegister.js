import React from 'react';
import { Field, ErrorMessage, FieldArray } from 'formik';
import { Row, Col, FormGroup, Label, Button } from 'reactstrap';

export const ProductECommerceRegister = () => (
  <div>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="minStock">Quantidade Mínima Estoque</Label>
          <Field name="minStock" type="number" className="form-control" />
          <ErrorMessage
            name="minStock"
            component="div"
            className="text-danger"
          />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="maxStock">Quantidade Máxima Estoque</Label>
          <Field name="maxStock" type="number" className="form-control" />
          <ErrorMessage
            name="maxStock"
            component="div"
            className="text-danger"
          />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="netWeight">Peso Líquido</Label>
          <Field name="netWeight" type="number" className="form-control" />
          <ErrorMessage
            name="netWeight"
            component="div"
            className="text-danger"
          />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="grossWeight">Peso Bruto</Label>
          <Field name="grossWeight" type="number" className="form-control" />
          <ErrorMessage
            name="grossWeight"
            component="div"
            className="text-danger"
          />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={4}>
        <FormGroup>
          <Label for="height">Altura</Label>
          <Field name="height" type="number" className="form-control" />
          <ErrorMessage name="height" component="div" className="text-danger" />
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label for="width">Largura</Label>
          <Field name="width" type="number" className="form-control" />
          <ErrorMessage name="width" component="div" className="text-danger" />
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label for="length">Comprimento</Label>
          <Field name="length" type="number" className="form-control" />
          <ErrorMessage name="length" component="div" className="text-danger" />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="stockLocation">Local de estoque</Label>
          <Field name="stockLocation" as="select" className="form-control">
            <option value="">Selecione</option>
            <option value="location1">Local 1</option>
            <option value="location2">Local 2</option>
          </Field>
          <ErrorMessage
            name="stockLocation"
            component="div"
            className="text-danger"
          />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="registrationDate">Data do Cadastro</Label>
          <Field name="registrationDate" type="date" className="form-control" />
          <ErrorMessage
            name="registrationDate"
            component="div"
            className="text-danger"
          />
        </FormGroup>
      </Col>
    </Row>
    <Row form>
      <Col md={6}>
        <FormGroup>
          <Label for="lastUpdateDate">Data da Última atualização</Label>
          <Field name="lastUpdateDate" type="date" className="form-control" />
          <ErrorMessage
            name="lastUpdateDate"
            component="div"
            className="text-danger"
          />
        </FormGroup>
      </Col>
      <Col md={6}>
        <FormGroup>
          <Label for="lastUpdateUser">Usuário da última Atualização</Label>
          <Field name="lastUpdateUser" type="text" className="form-control" />
          <ErrorMessage
            name="lastUpdateUser"
            component="div"
            className="text-danger"
          />
        </FormGroup>
      </Col>
    </Row>
    <FormGroup check>
      <Label check>
        <Field
          name="productComposition"
          type="checkbox"
          className="form-check-input"
        />
        Composição de produtos vendido
      </Label>
    </FormGroup>
    <FieldArray
      name="products"
      render={(arrayHelpers) => (
        <div>
          {arrayHelpers.form.values.products &&
          arrayHelpers.form.values.products.length > 0 ? (
            arrayHelpers.form.values.products.map((product, index) => (
              <div key={product.id || index}>
                <Row form>
                  <Col md={3}>
                    <FormGroup>
                      <Label for={`products.${index}.id`}>ID</Label>
                      <Field
                        name={`products.${index}.id`}
                        type="text"
                        className="form-control"
                      />
                      <ErrorMessage
                        name={`products.${index}.id`}
                        component="div"
                        className="text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for={`products.${index}.product`}>Produto</Label>
                      <Field
                        name={`products.${index}.product`}
                        as="select"
                        className="form-control"
                      >
                        <option value="">Selecione</option>
                        <option value="product1">Produto 1</option>
                        <option value="product2">Produto 2</option>
                      </Field>
                      <ErrorMessage
                        name={`products.${index}.product`}
                        component="div"
                        className="text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for={`products.${index}.quantity`}>
                        Quantidade
                      </Label>
                      <Field
                        name={`products.${index}.quantity`}
                        type="number"
                        className="form-control"
                      />
                      <ErrorMessage
                        name={`products.${index}.quantity`}
                        component="div"
                        className="text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for={`products.${index}.unit`}>
                        Unidade de Medida
                      </Label>
                      <Field
                        name={`products.${index}.unit`}
                        as="select"
                        className="form-control"
                      >
                        <option value="">Selecione</option>
                        <option value="unit1">Unidade 1</option>
                        <option value="unit2">Unidade 2</option>
                      </Field>
                      <ErrorMessage
                        name={`products.${index}.unit`}
                        component="div"
                        className="text-danger"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Button
                  type="button"
                  color="danger"
                  onClick={() => arrayHelpers.remove(index)}
                >
                  Remover
                </Button>
              </div>
            ))
          ) : (
            <Button
              type="button"
              onClick={() =>
                arrayHelpers.push({
                  id: '',
                  product: '',
                  quantity: '',
                  unit: '',
                })
              }
            >
              Adicionar Produto
            </Button>
          )}
          <div>
            <Button type="submit">Submit</Button>
          </div>
        </div>
      )}
    />
  </div>
);
