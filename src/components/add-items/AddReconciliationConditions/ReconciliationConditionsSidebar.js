import React from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { get } from 'lodash';
import { Label, FormGroup, Button, Form } from 'reactstrap';
import Select from 'react-select';
import { X } from 'react-feather';
import classnames from 'classnames';
import {
  formatMoney,
  getMonetaryValue,
  getOnlyNumbers,
} from '../../../utils/formaters';

import TextField from '../../inputs/TextField';

const ReconciliationConditionsSidebar = ({
  reconciliationCondition,
  updateReconciliationCondition,
  addReconciliationCondition,
  handleSidebar,
  show,
}) => {
  const intl = useIntl();

  const fieldsAvailables = [
    { value: 'DESCRIPTION', label: 'Descrição' },
    { value: 'AMOUNT', label: 'Valor' },
    { value: 'DAY', label: 'Dia' },
  ];

  const operatorsAvailables = [
    { value: 'EQUAL', label: 'Igual' },
    { value: 'DIFFERENT', label: 'Diferente' },
    { value: 'GREATER', label: 'Maior que' },
    { value: 'LESS', label: 'Menor que' },
    { value: 'GREATER_OR_EQUAL', label: 'Maior ou igual' },
    { value: 'LESS_OR_EQUAL', label: 'Menor ou igual' },
    { value: 'CONTAINS', label: 'Contém' },
    { value: 'NOT_CONTAINS', label: 'Não contém' },
  ];

  const initialValues = {
    rowId: reconciliationCondition.rowId || '',
    id: reconciliationCondition.id || '',
    field: reconciliationCondition.field || '',
    operator: reconciliationCondition.operator || '',
    value: reconciliationCondition.value || '',
  };

  const validationSchema = Yup.object().shape({
    field: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    operator: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    value: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
  });

  const onSubmit = (values) => {
    if (reconciliationCondition.rowId) {
      updateReconciliationCondition({
        ...values,
      });
    } else {
      addReconciliationCondition({
        ...values,
      });
    }
    formik.setValues(initialValues);

    handleSidebar(false, true);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <div
      className={classnames('data-list-sidebar', {
        show,
      })}
    >
      <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
        <h4>{reconciliationCondition.rowId ? 'Editar' : 'Adicionar'}</h4>
        <X size={20} onClick={() => handleSidebar(false, true)} />
      </div>
      <Form onSubmit={formik.handleSubmit}>
        <div className="m-3">
          {Boolean(formik?.initialValues.id || !reconciliationCondition.id) && (
            <>
              <FormGroup>
                <Label for="field">
                  <Label for="data-id">Campo *</Label>
                </Label>
                <Select
                  options={fieldsAvailables}
                  className="React"
                  classNamePrefix="select"
                  id="field"
                  name="field"
                  onBlur={formik.handleBlur}
                  placeholder="Selecionar"
                  value={fieldsAvailables.filter(
                    (_field) => _field.value === formik.values.field
                  )}
                  onChange={(option) => {
                    formik.setFieldValue('value', '');
                    formik.setFieldValue('field', option.value);
                  }}
                />
                {formik.errors.field && formik.touched.field ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.field}
                  </div>
                ) : null}
              </FormGroup>
              <FormGroup>
                <Label for="operator">
                  <Label for="data-id">Operador *</Label>
                </Label>
                <Select
                  options={operatorsAvailables}
                  className="React"
                  classNamePrefix="select"
                  id="operator"
                  name="operator"
                  onBlur={formik.handleBlur}
                  placeholder="Selecionar"
                  value={operatorsAvailables.filter(
                    (_operator) => _operator.value === formik.values.operator
                  )}
                  onChange={(option) =>
                    formik.setFieldValue('operator', option.value)
                  }
                />
                {formik.errors.operator && formik.touched.operator ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.operator}
                  </div>
                ) : null}
              </FormGroup>
              {formik.values.field === 'AMOUNT' ? (
                <TextField
                  id="value"
                  required
                  onBlur={formik.handleBlur}
                  value={formatMoney(formik.values.value)}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'value',
                      getMonetaryValue(e.target.value)
                    )
                  }
                  placeholder="0,00"
                  label="Valor"
                  error={
                    get(formik.touched, 'value') && get(formik.errors, 'value')
                  }
                />
              ) : (
                <FormGroup>
                  <Label for="value">
                    <Label for="data-id">Valor *</Label>
                  </Label>
                  <TextField
                    id="value"
                    name="value"
                    onBlur={formik.handleBlur}
                    value={formik.values.value}
                    onChange={(e) => {
                      let { value } = e.target;
                      if (formik.values.field === 'DAY') {
                        value = getOnlyNumbers(value);
                      }
                      formik.setFieldValue('value', value);
                    }}
                    placeholder="Valor"
                  />
                  {formik.errors.value && formik.touched.value ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.value}
                    </div>
                  ) : null}
                </FormGroup>
              )}
            </>
          )}

          <div className="data-list-sidebar-footer d-flex justify-content-end align-items-center mt-2">
            <Button color="primary" type="submit" className="ml-1">
              Salvar
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

ReconciliationConditionsSidebar.propTypes = {
  reconciliationCondition: PropTypes.object,
  updateReconciliationCondition: PropTypes.func,
  addReconciliationCondition: PropTypes.func,
  handleSidebar: PropTypes.func,
  show: PropTypes.bool,
};

ReconciliationConditionsSidebar.defaultProps = {
  reconciliationCondition: {},
  updateReconciliationCondition: () => {},
  addReconciliationCondition: () => {},
  handleSidebar: () => {},
  show: false,
};

export default ReconciliationConditionsSidebar;
