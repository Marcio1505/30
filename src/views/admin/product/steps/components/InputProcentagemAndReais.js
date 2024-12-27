import React, { useState } from 'react';
import { FormGroup, Label, Button, Input } from 'reactstrap';
import { Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';

const InputProcentagemAndReais = ({ label, name }) => {
  const [freightType, setFreightType] = useState('%');

  const toggleFreightType = (type) => {
    setFreightType(type);
  };

  return (
    <FormGroup>
      <Label for={name}>{label}</Label>
      <div className="d-flex flex-row-reverse">
        <Field name={name} type="text">
          {({ field, form }) => (
            <Input
              type="number"
              value={field.value} // Usa o valor atual
              onChange={(e) => form.setFieldValue(field.name, e.target.value)} // Atualiza o valor
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

InputProcentagemAndReais.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default InputProcentagemAndReais;
