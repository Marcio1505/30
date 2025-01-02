import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardBody, Col, Button, FormGroup, Label, Row } from 'reactstrap';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import {
  TextFieldController,
  SwitchController,
  SelectController,
  MaskFieldController,
} from '../../../../components/inputs/controlled';
import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import { showProduct } from '../../../../services/apis/product.api';

import PermissionGate from '../../../../PermissionGate';

const PurchaseOrderEdit = ({ currentCompanyId }) => {
  const { product_id: productId } = useParams();
  const intl = useIntl();
  let permissionForm = 'companies.products.store';

  if (productId) {
    permissionForm = 'products.show';
  }

  return (
    <PermissionGate permissions={permissionForm}>
      <Col sm="12">
        <Row className="app-user-list">
          <Col md="8" sm="12">
            <Breadcrumbs
              breadCrumbTitle={intl.formatMessage({ id: 'button.purchase' })}
              breadCrumbActive={intl.formatMessage({
                id: 'button.create.purchase',
              })}
            />
          </Col>
        </Row>
      </Col>
      <Card>
        <CardBody className="pt-2">
          <Formik
            initialValues={{
              supplier: '',
              telefoneFornecedor: '',
              email: '',
              comprador: '',
              despesasAdicionais: '',
              descontos: '',
              products: [
                {
                  id: '',
                  produt: '',
                  quantidade: '',
                  quantidadeEstoque: '',
                  valorUltimaComprar: '',
                  valorOrcado: '',
                  unidadeMedida: '',
                  total: '',
                  codigoExterno: '',
                },
              ],
            }}
            onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
          >
            <Form>
              {/* Fornecedor e Informações de Contato */}
              <Row>
                <Col md={4}>
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
                </Col>
                <Col md={4}>
                  <MaskFieldController
                    id="telefoneFornecedor"
                    name="telefoneFornecedor"
                    label="Telefone Fornecedor"
                    placeholder=""
                    mask="99999"
                  />
                </Col>
                <Col md={4}>
                  <TextFieldController
                    id="email"
                    name="email"
                    label="E-mail Fornecedor"
                  />
                </Col>
              </Row>

              <FieldArray
                name="products"
                render={(arrayHelpers) => (
                  <div>
                    {arrayHelpers.form.values.products &&
                    arrayHelpers.form.values.products.length > 0 ? (
                      arrayHelpers.form.values.products.map(
                        (product, index) => (
                          <div key={product.id || index}>
                            <Row form>
                              <Col md={3} className="d-flex">
                                <FormGroup>
                                  <Label for={`products.${index}.id`}>ID</Label>
                                  <Field
                                    name={`products.${index}.id`}
                                    type="text"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={3}>
                                <FormGroup>
                                  <Label for={`products.${index}.produt`}>
                                    Produto
                                  </Label>
                                  <Field
                                    name={`products.${index}.produt`}
                                    type="text"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={3}>
                                <FormGroup>
                                  <Label for={`products.${index}.quantidade`}>
                                    Quantidade
                                  </Label>
                                  <Field
                                    name={`products.${index}.quantidade`}
                                    type="number"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={3}>
                                <FormGroup>
                                  <Label
                                    for={`products.${index}.quantidadeEstoque`}
                                  >
                                    Quantidade em Estoque
                                  </Label>
                                  <Field
                                    name={`products.${index}.quantidadeEstoque`}
                                    type="number"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row form>
                              <Col md={3}>
                                <FormGroup>
                                  <Label
                                    for={`products.${index}.valorUltimaComprar`}
                                  >
                                    Valor da Última Compra
                                  </Label>
                                  <Field
                                    name={`products.${index}.valorUltimaComprar`}
                                    type="number"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={3}>
                                <FormGroup>
                                  <Label for={`products.${index}.valorOrcado`}>
                                    Valor Orçado
                                  </Label>
                                  <Field
                                    name={`products.${index}.valorOrcado`}
                                    type="number"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={3}>
                                <FormGroup>
                                  <Label
                                    for={`products.${index}.unidadeMedida`}
                                  >
                                    Unidade de Medida
                                  </Label>
                                  <Field
                                    name={`products.${index}.unidadeMedida`}
                                    type="text"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={3}>
                                <FormGroup>
                                  <Label for={`products.${index}.total`}>
                                    Total
                                  </Label>
                                  <Field
                                    name={`products.${index}.total`}
                                    type="number"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row form>
                              <Col md={3}>
                                <FormGroup>
                                  <Label
                                    for={`products.${index}.codigoExterno`}
                                  >
                                    Código Externo
                                  </Label>
                                  <Field
                                    name={`products.${index}.codigoExterno`}
                                    type="text"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                              <Col
                                md={3}
                                className="d-flex align-items-center justify-content-start"
                              >
                                {' '}
                                <Button
                                  type="button"
                                  color="danger"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  Remover
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        )
                      )
                    ) : (
                      <div>Nenhum produto adicionado</div>
                    )}
                    <Button
                      type="button"
                      color="primary"
                      onClick={() =>
                        arrayHelpers.push({
                          id: '',
                          produt: '',
                          quantidade: '',
                          quantidadeEstoque: '',
                          valorUltimaComprar: '',
                          valorOrcado: '',
                          unidadeMedida: '',
                          total: '',
                          codigoExterno: '',
                        })
                      }
                    >
                      Adicionar Produto
                    </Button>
                  </div>
                )}
              />
              {/* Informações Adicionais */}
              <Row>
                <Col md={4}>
                  <SelectController
                    id="comprador"
                    name="comprador"
                    label="Comprador"
                    options={[
                      { value: 1, label: 'markup' },
                      { value: 2, label: 'preço de venda' },
                    ]}
                  />
                </Col>
                <Col md={4}>
                  <TextFieldController
                    id="despesasAdicionais"
                    name="despesasAdicionais"
                    label="Despesas Adicionais"
                  />
                </Col>
                <Col md={4}>
                  <TextFieldController
                    id="descontos"
                    name="descontos"
                    label="Descontos"
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <TextFieldController
                    id="previsaoChegada"
                    name="previsaoChegada"
                    label="Previsão de Chegada"
                  />
                </Col>
                <Col md={6}>
                  <TextFieldController
                    id="observacoes"
                    name="observacoes"
                    label="Observações"
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <SelectController
                    id="tipoPagamento"
                    name="tipoPagamento"
                    label="Tipo Pagamento"
                    options={[
                      { value: 1, label: 'markup' },
                      { value: 2, label: 'preço de venda' },
                    ]}
                  />
                </Col>
              </Row>
              {/* Botão Enviar */}
              <Button type="submit">Enviar</Button>
            </Form>
          </Formik>
        </CardBody>
      </Card>
    </PermissionGate>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(PurchaseOrderEdit);
