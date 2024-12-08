import React, { useState } from 'react';
import { FormGroup, Label, Button, Input } from 'reactstrap';
import { Field, ErrorMessage, useFormikContext } from 'formik';

export const InputProcentagemAndReais = ({ label, name }) => {
  const [freightType, setFreightType] = useState('%');
  const { setFieldValue, values } = useFormikContext();

  const formatValue = (value, type) => {
    // Permitir números e vírgulas
    const formattedValue = value.replace(/[^0-9,]/g, '');
    if (type === '%') {
      return `${formattedValue}%`;
    }
    return `R$${formattedValue}`;
  };

  const toggleFreightType = () => {
    const currentValue = values[name];
    const formattedValue = formatValue(
      currentValue,
      freightType === '%' ? 'R$' : '%'
    );
    setFieldValue(name, formattedValue);
    setFreightType((prevType) => (prevType === '%' ? 'R$' : '%'));
  };

  return (
    <FormGroup>
      <Label for={name}>{label}</Label>
      <div className="d-flex">
        <Field name={name}>
          {({ field, form }) => (
            <Input
              type="text"
              value={field.value} // Usa o valor atual
              onChange={(e) =>
                form.setFieldValue(
                  field.name,
                  formatValue(e.target.value, freightType)
                )
              } // Atualiza o valor
            />
          )}
        </Field>

        <Button
          color="primary"
          onClick={toggleFreightType}
          className="ml-2"
          disabled={freightType === '%'}
        >
          R$
        </Button>
        <Button
          color="primary"
          onClick={toggleFreightType}
          className="ml-2"
          disabled={freightType === 'R$'}
        >
          %
        </Button>
      </div>
      <ErrorMessage name={name} component="div" className="text-danger" />
    </FormGroup>
  );
};
