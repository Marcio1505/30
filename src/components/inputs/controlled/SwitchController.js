import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label } from 'reactstrap';
import { Field } from 'formik';
import Switch from 'react-switch';

const SwitchController = ({ name, label }) => (
  <FormGroup>
    <Label
      style={{
        display: 'flex',
        gap: '10px',
        fontSize: '1.2em',
      }}
    >
      <Field name={name}>
        {({ field, form }) => (
          <Switch
            {...field}
            checked={field.value}
            height={20}
            width={40}
            onChange={(checked) => form.setFieldValue(field.name, checked)}
            uncheckedIcon={false}
            checkedIcon={false}
            onColor="#36BBA4" // Cor primária quando selecionado
          />
        )}
      </Field>
      {label}
    </Label>
  </FormGroup>
);

SwitchController.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default SwitchController;
