import React from 'react';
import { get } from 'lodash';

import TextField from './TextField';

const PercentageField = ({ formik }) => (
  <TextField
    required
    type="number"
    id="percentage"
    onBlur={formik.handleBlur}
    value={formik.values.percentage}
    placeholder="%"
    label="Percentual"
    error={
      get(formik.touched, 'percentage') && get(formik.errors, 'percentage')
    }
    onChange={(e) => {
      if (e.target.value > 100) {
        e.target.value = parseInt(e.target.value)
          .toString()
          .slice(0, e.target.value.length - 1);
      }
      formik.setFieldValue('percentage', e.target.value);
    }}
  />
);

export default PercentageField;
