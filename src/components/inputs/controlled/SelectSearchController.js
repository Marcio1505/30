import React from 'react';
import { useField } from 'formik';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import PropTypes from 'prop-types';
import SelectList from 'react-select';

const SelectSearchController = ({
  id,
  options,
  label,
  isMulti,
  isSearchable,
  isClearable,
  isDisabled,
}) => {
  const [field, meta, helpers] = useField(id);

  const handleChange = (selectedOption) => {
    helpers.setValue(selectedOption);
  };

  return (
    <FormGroup>
      <Label for={id}>{label}</Label>
      <SelectList
        id={id}
        name={id}
        options={options}
        isMulti={isMulti}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={isDisabled}
        value={field.value}
        onChange={handleChange}
        onBlur={() => helpers.setTouched(true)}
      />
      {meta.touched && meta.error ? (
        <FormFeedback>{meta.error}</FormFeedback>
      ) : null}
    </FormGroup>
  );
};

SelectSearchController.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

SelectSearchController.defaultProps = {
  isMulti: false,
  isSearchable: false,
  isClearable: false,
  isDisabled: false,
};

export default SelectSearchController;
