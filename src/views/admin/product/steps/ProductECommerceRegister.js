import React, { useState, useEffect } from 'react';
import { FieldArray } from 'formik';
import { Row, Col, FormGroup, Label, Button, Card, CardImg } from 'reactstrap';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import {
  TextFieldController,
  SelectSearchController,
} from '../../../../components/inputs/controlled';
import { fetchProductsList } from '../../../../services/apis/product.api';

export const ProductECommerceRegister = () => {
  const [isProductComposition, setIsProductComposition] = useState(false);
  const [products, setProducts] = useState([{ id: '', label: '' }]);

  const loadProducts = async () => {
    const { data } = await fetchProductsList();
    const formattedData = data.map((item) => ({
      label: item.name,
      id: item.id,
    }));
    setProducts(formattedData);
  };

  useEffect(() => {
    loadProducts();
  }, [isProductComposition]);

  return (
    <Col style={{ display: 'flex' }}>
      <Col>
        <Row form>
          <Col md={3}>
            <TextFieldController
              label="Quantidade Mínima Estoque"
              name="minStock"
              type="number"
              id="minStock"
            />
          </Col>
          <Col md={3}>
            <TextFieldController
              label="Quantidade Máxima Estoque"
              name="maxStock"
              type="number"
              id="maxStock"
            />
          </Col>
          <Col md={3}>
            <TextFieldController
              label="Peso Líquido"
              name="netWeight"
              type="number"
              id="netWeight"
            />
          </Col>
          <Col md={3}>
            <TextFieldController
              label="Peso Bruto"
              name="grossWeight"
              type="number"
              id="grossWeight"
            />
          </Col>
          <Col md={3}>
            <TextFieldController
              label="Altura"
              name="height"
              type="number"
              id="height"
            />
          </Col>
          <Col md={3}>
            <TextFieldController
              label="Largura"
              name="width"
              type="number"
              id="width"
            />
          </Col>
          <Col md={3}>
            <TextFieldController
              label="Comprimento"
              name="length"
              type="number"
              id="length"
            />
          </Col>
          <Col md={3}>
            <TextFieldController
              name="stockLocation"
              id="stockLocation"
              label="Local de estoque"
            />
          </Col>

          <Col md={3}>
            <TextFieldController
              label="Usuário da última Atualização"
              name="lastUpdateUser"
              type="text"
              id="lastUpdateUser"
            />
          </Col>
        </Row>

        <Col padding="0">
          <FormGroup>
            <Label
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '1.2em', marginRight: '10px' }}>
                Composição de produtos vendido
              </span>
              <Toggle
                width={0}
                checked={isProductComposition}
                onChange={() => setIsProductComposition(!isProductComposition)}
              />
            </Label>
          </FormGroup>
          {isProductComposition && (
            <FieldArray
              name="products"
              render={(arrayHelpers) => (
                <div>
                  {arrayHelpers.form.values.products &&
                  arrayHelpers.form.values.products.length > 0 ? (
                    arrayHelpers.form.values.products.map((product, index) => (
                      <div
                        key={product.id || index}
                        style={{ marginBottom: 10 }}
                      >
                        <Row form>
                          <Col md={3}>
                            <TextFieldController
                              label="ID"
                              disabled
                              name={`products.${index}.id`}
                              type="text"
                              id={`products.${index}.id`}
                              value={product.product.id}
                            />
                          </Col>
                          <Col md={3}>
                            <SelectSearchController
                              label="Produto"
                              name={`products.${index}.product`}
                              id={`products.${index}.product`}
                              isClearable
                              isSearchable
                              options={[...products]}
                            />
                          </Col>
                          <Col md={3}>
                            <TextFieldController
                              label="Quantidade"
                              name={`products.${index}.quantity`}
                              type="number"
                              id={`products.${index}.quantity`}
                            />
                          </Col>
                          <Col md={3}>
                            <TextFieldController
                              label="Unidade de Medida"
                              name={`products.${index}.unit`}
                              id={`products.${index}.unit`}
                            />
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
                    <div>Nenhum produto adicionado</div>
                  )}
                  <Button
                    type="button"
                    color="primary"
                    onClick={() =>
                      arrayHelpers.push({
                        id: null,
                        product: '',
                        quantity: '',
                        unit: '',
                      })
                    }
                  >
                    Adicionar Produto
                  </Button>
                </div>
              )}
            />
          )}
        </Col>
      </Col>
      <Col sm="3">
        <Card
          className="my-2"
          outline
          style={{
            width: '202px',
            height: 'auto',
            borderRadius: '10px',
            border: '1px solid #c8c8c8',
          }}
        >
          <CardImg
            alt="Card image cap"
            src="https://picsum.photos/900/1200?grayscale"
            width="100%"
          />
        </Card>
      </Col>
    </Col>
  );
};
