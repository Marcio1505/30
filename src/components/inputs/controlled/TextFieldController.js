import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import { Field, ErrorMessage } from 'formik';

const TextFieldController = ({ id, name, label, placeholder }) => (
  <FormGroup>
    <Label for={id}>{label}</Label>
    <Field
      id={id}
      name={name}
      className="form-control"
      placeholder={placeholder}
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-danger"
      render={(msg) => <FormFeedback tooltip>{msg}</FormFeedback>}
    />
  </FormGroup>
);

TextFieldController.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

TextFieldController.defaultProps = {
  placeholder: '',
};

export default TextFieldController;
