import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Button, ButtonGroup } from 'reactstrap';
import { ProductBasicRegister } from './ProductBasicRegister';
import { validationSchemas } from './validationSchemas';
import { ProductTributosRegister } from './ProductTributosRegister';
import { ProductValueBuyRegister } from './ProductValueBuyRegister';
import { ProductECommerceRegister } from './ProductECommerceRegister';
import { TableFornecedores } from './TableFornecedores';

const steps = [
  <ProductBasicRegister />,
  <ProductTributosRegister />,
  <ProductValueBuyRegister />,
  <ProductECommerceRegister />,
  <TableFornecedores />,
];

export const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleSubmit = (values, actions) => {
    if (isLastStep) {
      // Submissão final
      console.log('Valores finais:', values);
      actions.setSubmitting(false);
    } else {
      // Avançar para o próximo passo
      setCurrentStep(currentStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };
  const InitialValuesDefault = {};
  return (
    <>
      <ButtonGroup>
        <Button color="primary" outline={!isFirstStep}>
          Cadastro Básico
        </Button>
        <Button color="primary" outline={currentStep !== 1}>
          Tributos
        </Button>
        <Button color="primary" outline={currentStep !== 2}>
          Valores de Compra
        </Button>
        <Button color="primary" outline={currentStep !== 3}>
          E-commerce
        </Button>
        <Button color="primary" outline={currentStep !== 4}>
          Fornecedores
        </Button>
      </ButtonGroup>

      <Formik
        initialValues={{ ...InitialValuesDefault }}
        validationSchema={validationSchemas[currentStep]}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting }) => (
          <Form>
            <h4>
              Etapa {currentStep + 1} de {steps.length}
            </h4>
            {steps[currentStep]}
            <div className="mt-3">
              {Object.keys(errors).length > 0 && (
                <p className="text-danger">Campos com * são obrigatorios</p>
              )}
            </div>
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
    </>
  );
};
