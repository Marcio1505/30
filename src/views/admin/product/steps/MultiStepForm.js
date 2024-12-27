import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Button, ButtonGroup, Card, CardBody } from 'reactstrap';
import { ProductBasicRegister } from './ProductBasicRegister';
import { validationSchemas } from './validationSchemas';
import { ProductTributosRegister } from './ProductTributosRegister';
import { ProductValueBuyRegister } from './ProductValueBuyRegister';
import { ProductECommerceRegister } from './ProductECommerceRegister';
import { TableFornecedores } from './TableFornecedores';

const steps = [
  <ProductBasicRegister key="ProductBasicRegister" />,
  <ProductTributosRegister key="ProductTributosRegister" />,
  <ProductValueBuyRegister key="ProductValueBuyRegister" />,
  <ProductECommerceRegister key="ProductECommerceRegister" />,
  <TableFornecedores key="TableFornecedores" />,
];

export const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleSubmit = (values, actions) => {
    if (isLastStep) {
      // Submissão final

      actions.setSubmitting(false);
    } else {
      // Avançar para o próximo passo
      setCurrentStep(currentStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const InitialValuesDefault = {
    product_type: '',
    name: '',
    supplier: [],
    discount: 10,
    products: [
      {
        id: '',
        product: '',
        quantity: '',
        unit: '',
      },
    ],
  };

  return (
    <>
      <ButtonGroup style={{ borderRadius: 0 }}>
        <Button
          color={isFirstStep ? 'primary' : 'secondary'}
          style={{ borderRadius: 0 }}
          onClick={() => setCurrentStep(0)}
        >
          Cadastro Básico
        </Button>
        <Button
          color={currentStep === 1 ? 'primary' : 'secondary'}
          onClick={() => setCurrentStep(1)}
        >
          Tributos
        </Button>
        <Button
          color={currentStep === 2 ? 'primary' : 'secondary'}
          onClick={() => setCurrentStep(2)}
        >
          Valores de Compra
        </Button>
        <Button
          color={currentStep === 3 ? 'primary' : 'secondary'}
          onClick={() => setCurrentStep(3)}
        >
          E-commerce
        </Button>
        <Button
          color={currentStep === 4 ? 'primary' : 'secondary'}
          onClick={() => setCurrentStep(4)}
          style={{ borderRadius: 0 }}
        >
          Fornecedores
        </Button>
      </ButtonGroup>

      <Card>
        <CardBody className="pt-2">
          <Formik
            initialValues={{ ...InitialValuesDefault }}
            validationSchema={validationSchemas[currentStep]}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => (
              <Form>
                {steps[currentStep]}

                {/* Display errors */}
                {Object.keys(errors).length > 0 && (
                  <div className="alert alert-danger mt-3">
                    <ul>
                      {Object.keys(errors).map((key) => (
                        <li key={key}>{errors[key]}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Navegação entre etapas */}
                <div className="d-flex justify-content-between mt-4">
                  {!isFirstStep && (
                    <Button
                      color="secondary"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      disabled={isSubmitting}
                    >
                      Voltar
                    </Button>
                  )}
                  <Button
                    type="submit"
                    color={isLastStep ? 'success' : 'primary'}
                    disabled={isSubmitting}
                  >
                    {isLastStep ? 'Enviar' : 'Próximo'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </>
  );
};
