import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import Select from 'react-select';
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Form,
  Button,
} from 'reactstrap';

const DefaultCategories = ({
  lastLevelCategories,
  handleUpdateDefaultCategories,
}) => {
  const intl = useIntl();

  const receivableCategoriesOptions = lastLevelCategories
    .filter((category) => category.type === 1)
    .map((category) => ({
      value: category.id,
      label: category.computed_name,
    }));

  const payableCategoriesOptions = lastLevelCategories
    .filter((category) => category.type === 2)
    .map((category) => ({
      value: category.id,
      label: category.computed_name,
    }));

  const defaultCategories = [
    {
      label: 'Recebimento de Vendas',
      value: 'default_receivable',
      options: receivableCategoriesOptions,
    },
    {
      label: 'Taxa de Plataforma',
      value: 'default_plataform_fee',
      options: payableCategoriesOptions,
    },
    {
      label: 'Comissão Coprodutor',
      value: 'default_coproducer',
      options: payableCategoriesOptions,
    },
    {
      label: 'Comissão Afiliado',
      value: 'default_affiliate',
      options: payableCategoriesOptions,
    },
    {
      label: 'Comissão Streaming',
      value: 'default_streaming',
      options: payableCategoriesOptions,
    },
    {
      label: 'Taxa do Banco',
      value: 'default_bank_fee',
      options: payableCategoriesOptions,
    },
    {
      label: 'Estorno de Taxas',
      value: 'default_refund_receivable',
      options: receivableCategoriesOptions,
    },
    {
      label: 'Estorno de Vendas',
      value: 'default_refund_payable',
      options: payableCategoriesOptions,
    },
    {
      label: 'Chargeback de Taxas',
      value: 'default_chargeback_receivable',
      options: receivableCategoriesOptions,
    },
    {
      label: 'Chargeback de Vendas',
      value: 'default_chargeback_payable',
      options: payableCategoriesOptions,
    },
    {
      label: 'Reserva a Receber',
      value: 'default_reserve_receivable',
      options: receivableCategoriesOptions,
    },
    {
      label: 'Reserva a Pagar',
      value: 'default_reserve_payable',
      options: payableCategoriesOptions,
    },
    {
      label: 'Recálculo de Comissão a Receber',
      value: 'default_commission_recalc_receivable',
      options: receivableCategoriesOptions,
    },
    {
      label: 'Recálculo de Comissão a Pagar',
      value: 'default_commission_recalc_payable',
      options: payableCategoriesOptions,
    },
    {
      label: 'Saque da Plataforma',
      value: 'default_platform_withdraw',
      options: payableCategoriesOptions,
    },
    {
      label: 'Saque Antecipado',
      value: 'default_early_withdrawal',
      options: payableCategoriesOptions,
    },
    {
      label: 'Bloqueio Judicial',
      value: 'default_legal_block',
      options: payableCategoriesOptions,
    },
  ];

  const getDefaultCategory = (defaultFor) => {
    const defaultCategory = lastLevelCategories.find(
      (category) => category[defaultFor]
    );

    return defaultCategory
      ? {
          value: defaultCategory.id,
          label: defaultCategory.computed_name,
        }
      : null;
  };

  const initialValues = {};
  defaultCategories.forEach((defaultCategory) => {
    initialValues[defaultCategory.value] = getDefaultCategory(
      defaultCategory.value
    );
  });

  const fieldsToValidate = {};
  defaultCategories.forEach((defaultCategory) => {
    fieldsToValidate[defaultCategory.value] = Yup.mixed().required(
      intl.formatMessage({ id: 'errors.required' })
    );
  });

  const validationSchema = Yup.object().shape(fieldsToValidate);

  const onSubmit = (values) => {
    const defaultCategoriesToSave = {};
    Object.entries(values).forEach(([key, value]) => {
      defaultCategoriesToSave[key] = value.value;
    });
    handleUpdateDefaultCategories(defaultCategoriesToSave);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <>
      {lastLevelCategories && (
        <Row>
          <Col sm="12">
            <Card>
              <CardBody className="px-4">
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col className="mt-1" sm="12">
                      <h3 className="mb-2 text-primary">
                        <span className="align-middle">Categorias Padrão</span>
                      </h3>
                    </Col>
                  </Row>
                  <Row>
                    {defaultCategories.map((defaultCategory) => (
                      <Col md="6" sm="12">
                        <FormGroup>
                          <Label for={defaultCategory.value}>
                            <Label for="data-id">
                              {defaultCategory.label} *
                            </Label>
                          </Label>
                          <Select
                            placeholder="Selecionar"
                            className="React"
                            classNamePrefix="select"
                            id={defaultCategory.value}
                            name={defaultCategory.value}
                            onBlur={formik.handleBlur}
                            value={formik.values[defaultCategory.value]}
                            onChange={(option) =>
                              formik.setFieldValue(
                                defaultCategory.value,
                                option
                              )
                            }
                            options={defaultCategory.options}
                          />
                          {formik.errors[defaultCategory.value] &&
                          formik.touched[defaultCategory.value] ? (
                            <div className="invalid-tooltip mt-25">
                              {formik.errors[defaultCategory.value]}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    ))}
                  </Row>
                  <Row>
                    <Col
                      className="d-flex justify-content-end flex-wrap"
                      md={{ size: 6, offset: 6 }}
                      sm="12"
                    >
                      <Button.Ripple className="mt-1" color="primary">
                        <FormattedMessage id="button.save" />
                      </Button.Ripple>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

DefaultCategories.propTypes = {
  lastLevelCategories: PropTypes.array.isRequired,
  handleUpdateDefaultCategories: PropTypes.func.isRequired,
};

export default DefaultCategories;
