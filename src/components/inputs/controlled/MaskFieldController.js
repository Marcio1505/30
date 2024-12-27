import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import { Field, ErrorMessage } from 'formik';
import InputMask from 'react-input-mask';

const MaskFieldController = ({
  id,
  name,
  label,
  placeholder,
  mask = false,
}) => (
  <FormGroup>
    <Label for={id}>{label}</Label>

    <InputMask mask={mask}>
      {(inputProps) => (
        <Field
          id={id}
          name={name}
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={inputProps.value}
          onChange={inputProps.onChange}
          onBlur={inputProps.onBlur}
        />
      )}
    </InputMask>

    <ErrorMessage
      name={name}
      component="div"
      className="text-danger"
      render={(msg) => <FormFeedback tooltip>{msg}</FormFeedback>}
    />
  </FormGroup>
);

MaskFieldController.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  mask: PropTypes.string.isRequired,
};

MaskFieldController.defaultProps = {
  placeholder: '',
};

export default MaskFieldController;
