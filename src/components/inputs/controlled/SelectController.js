import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import { Field, ErrorMessage } from 'formik';

const SelectController = ({ id, name, label, options }) => (
  <FormGroup>
    <Label for={id}>{label}</Label>
    <Field as="select" id={id} name={name} className="form-control">
      <option value="">Selecione o tipo</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
    <ErrorMessage
      name={name}
      component="div"
      className="text-danger"
      render={(msg) => <FormFeedback tooltip>{msg}</FormFeedback>}
    />
  </FormGroup>
);

SelectController.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SelectController;
