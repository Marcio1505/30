import React, { useState } from 'react';
import { FormGroup, Label, Button, Input } from 'reactstrap';
import { Field, ErrorMessage, useFormikContext } from 'formik';

export const InputProcentagemAndReais = ({ label, name }) => {
  const [freightType, setFreightType] = useState('%');
  const { setFieldValue, values } = useFormikContext();

  const formatValue = (value) => {
    // Permitir números e vírgulas
    return value.replace(/[^0-9,]/g, '');
  };

  const toggleFreightType = (type) => {
    const currentValue = values[name] ?? '';
    const formattedValue = currentValue.replace(/[^0-9,]/g, '');
    setFieldValue(name, formattedValue);
    setFreightType(type);
  };

  return (
    <FormGroup>
      <Label for={name}>{label}</Label>
      <div className="d-flex flex-row-reverse">
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
              style={{ borderRadius: '0', padding: '0 0.8rem' }}
            />
          )}
        </Field>

        <Button
          color={freightType === '%' ? 'primary' : 'secondary'}
          onClick={() => toggleFreightType('%')}
          style={{ borderRadius: '0', padding: '0 0.8rem' }}
        >
          R$
        </Button>
        <Button
          color={freightType === 'R$' ? 'primary' : 'secondary'}
          onClick={() => toggleFreightType('R$')}
          style={{ borderRadius: '0', padding: '0 0.8rem' }}
        >
          %
        </Button>
      </div>
      <ErrorMessage name={name} component="div" className="text-danger" />
    </FormGroup>
  );
};
