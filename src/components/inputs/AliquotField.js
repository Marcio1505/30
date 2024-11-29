import React from 'react';
import PropTypes from 'prop-types';

import { formatAliquot, getAliquotValue } from '../../utils/formaters';

import TextField from './TextField';

const AliquotField = ({ id, label, formik, required }) => (
  <TextField
    id={id}
    onBlur={formik.handleBlur}
    value={formatAliquot(formik.values[id])}
    onChange={(e) => {
      const aliquotValue = getAliquotValue(e.target.value);
      if (aliquotValue < 100) {
        formik.setFieldValue(id, aliquotValue);
      }
    }}
    placeholder="0,0000"
    label={label}
    error={formik.touched[id] && formik.errors[id]}
    button={{
      text: 'Limpar',
      position: required ? '' : 'right',
      action: () => {
        formik.setFieldValue(id, '');
      },
    }}
  />
);

AliquotField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  formik: PropTypes.shape({
    handleBlur: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    touched: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
  }).isRequired,
};

AliquotField.defaultProps = {
  required: false,
};

export default AliquotField;
