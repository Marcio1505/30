import React from 'react';
import PropTypes from 'prop-types';

import { Input, Label, FormGroup, Button, InputGroup } from 'reactstrap';

const TextField = ({
  type,
  readOnly,
  onChange,
  onBlur,
  onKeyUp,
  value,
  placeholder,
  error,
  warning,
  disabled,
  label,
  boxProps,
  labelProps,
  name,
  id,
  required,
  inputProps,
  fileInput,
  rightIcon,
  button,
}) => {
  const showRightButton = button.text && button.position === 'right';
  const showLeftButton = button.text && button.position === 'left';

  return (
    <>
      <Label {...labelProps} for={id}>
        {label}
        {required && ' *'}
      </Label>
      <FormGroup
        {...boxProps}
        className={
          rightIcon && 'position-relative form-label-group input-divider-right'
        }
      >
        <InputGroup>
          {showLeftButton && (
            <Button onClick={button.action} color="success">
              {button.text}
            </Button>
          )}
          <Input
            {...inputProps}
            type={type}
            // required={required}
            disabled={disabled}
            readOnly={readOnly}
            value={value}
            name={name}
            id={id}
            onChange={onChange}
            onKeyUp={onKeyUp}
            onBlur={onBlur}
            placeholder={placeholder}
            ref={fileInput}
          />
          {showRightButton && (
            <Button onClick={button.action} color="success">
              {button.text}
            </Button>
          )}
        </InputGroup>
        {rightIcon && <div className="form-control-position">{rightIcon}</div>}
        {error && <div className="invalid-tooltip mt-25">{error}</div>}
        {warning && <div className="text-warning mt-25">{warning}</div>}
      </FormGroup>
    </>
  );
};

TextField.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.node,
  warning: PropTypes.node,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyUp: PropTypes.func,
  label: PropTypes.node,
  labelProps: PropTypes.object,
  boxProps: PropTypes.object,
  inputProps: PropTypes.object,
  type: PropTypes.string,
  readOnly: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool,
  fileInput: PropTypes.string,
  rightIcon: PropTypes.node,
  button: PropTypes.shape({
    position: PropTypes.oneOf(['left', 'right']),
    text: PropTypes.string,
    action: PropTypes.func,
  }),
};

TextField.defaultProps = {
  type: 'input',
  label: '',
  readOnly: false,
  error: null,
  warning: null,
  disabled: false,
  value: '',
  placeholder: '',
  onChange: () => {},
  onBlur: () => {},
  onKeyUp: () => {},
  boxProps: {},
  labelProps: {},
  name: '',
  id: null,
  required: false,
  rightIcon: null,
  button: {
    position: 'right',
    text: '',
    action: () => {},
  },
};

export default TextField;
