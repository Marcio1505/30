import React from 'react';
import { useFormik } from 'formik';
import { Label, Input, FormGroup, Button, Form } from 'reactstrap';
import Select from 'react-select';
import { X } from 'react-feather';
import classnames from 'classnames';

import { formatMoney, getMonetaryValue } from '../../../../utils/formaters';

const BudgetSubcategoriesSidebar = ({
  category,
  updateCategory,
  addNewCategory,
  handleSidebar,
  show,
  categories,
  categoriesTook,
}) => {
  const categoriesAvailables = categories.filter((_category) => {
    if (categoriesTook.find((took) => took.id === _category.id)) {
      if (_category.id === category.id) {
        return true;
      }
      return false;
    }
    return true;
  });

  const initialValues = {
    rowId: category.rowId || '',
    id: category.id || '',
    value: category.pivot?.value || '',
  };

  const onSubmit = (values) => {
    const _category = categories.find(
      (sub) => parseInt(sub.id) === parseInt(values.id)
    );
    if (category.id) {
      updateCategory({
        ...values,
        name: _category.name,
      });
    } else {
      addNewCategory({
        ...values,
        name: _category.name,
      });
    }
    formik.setValues(initialValues);
    handleSidebar(false, true);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    // validationSchema,
    enableReinitialize: true,
  });

  return (
    <div
      className={classnames('data-list-sidebar', {
        show,
      })}
    >
      <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
        <h4>{category.id ? 'Editar' : 'Adicionar'}</h4>
        <X size={20} onClick={() => handleSidebar(false, true)} />
      </div>
      <Form onSubmit={formik.handleSubmit}>
        <div className="m-3">
          {Boolean(formik?.initialValues.id || !category.id) && (
            <FormGroup>
              <Label for="to_company">
                <Label for="data-id">Categoria *</Label>
              </Label>
              <Select
                options={categoriesAvailables}
                className="React"
                classNamePrefix="select"
                id="to_company"
                onBlur={formik.handleBlur}
                placeholder=""
                defaultValue={
                  category.id
                    ? categoriesAvailables.filter(
                        (sub) => sub.value === formik.initialValues.id
                      )
                    : { name: '', value: '' }
                }
                onChange={(option) => formik.setFieldValue('id', option.value)}
              />
              {formik.errors.id && formik.touched.id ? (
                <div className="invalid-tooltip mt-25">{formik.errors.id}</div>
              ) : null}
            </FormGroup>
          )}
          <FormGroup>
            <Label for="data-value">Valor *</Label>
            <Input
              id="data-value"
              onBlur={formik.handleBlur}
              value={formatMoney(formik.values.value)}
              onChange={(e) =>
                formik.setFieldValue('value', getMonetaryValue(e.target.value))
              }
              placeholder="0,00"
            />
          </FormGroup>
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
export default BudgetSubcategoriesSidebar;
