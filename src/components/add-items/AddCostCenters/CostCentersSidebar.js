import React from 'react';
import { PropTypes } from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';

import { Label, FormGroup, Button, Form } from 'reactstrap';
import Select from 'react-select';
import { X } from 'react-feather';
import classnames from 'classnames';

import PercentageField from '../../inputs/PercentageField';

const CostCentersSidebar = ({
  costCenter,
  updateCostCenter,
  addNewCostCenter,
  handleSidebar,
  show,
  costCenters,
  costCentersTook,
}) => {
  const intl = useIntl();
  const costCentersAvailables = (costCenters || []).filter((_costCenter) => {
    if ((costCentersTook || []).find((took) => took.id === _costCenter.id)) {
      if (_costCenter.id === costCenter.id) {
        return true;
      }
      return false;
    }
    return true;
  });

  const initialValues = {
    rowId: costCenter.rowId || '',
    id: costCenter.id || '',
    percentage: costCenter.pivot?.percentage || '',
  };

  const validationSchema = Yup.object().shape({
    id: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    percentage: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
  });

  const onSubmit = (values) => {
    const _costCenter = costCenters.find(
      (costCenter) => parseInt(costCenter.id) === parseInt(values.id)
    );
    if (costCenter.id) {
      updateCostCenter({
        ...values,
        name: _costCenter.name,
      });
    } else {
      addNewCostCenter({
        ...values,
        name: _costCenter.name,
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
        <h4>{costCenter.id ? 'Editar' : 'Adicionar'}</h4>
        <X size={20} onClick={() => handleSidebar(false, true)} />
      </div>
      <Form onSubmit={formik.handleSubmit}>
        <div className="m-3">
          {Boolean(formik?.initialValues.id || !costCenter.id) && (
            <FormGroup>
              <Label for="cost_center_id">
                <Label for="data-id">Centro de Custo *</Label>
              </Label>
              <Select
                options={costCentersAvailables}
                className="React"
                classNamePrefix="select"
                id="cost_center_id"
                name="cost_center_id"
                onBlur={formik.handleBlur}
                placeholder="Selecionar"
                value={costCentersAvailables.filter(
                  (_costCenter) => _costCenter.value === formik.values.id
                )}
                onChange={(option) => formik.setFieldValue('id', option.value)}
              />
              {formik.errors.id && formik.touched.id ? (
                <div className="invalid-tooltip mt-25">{formik.errors.id}</div>
              ) : null}
            </FormGroup>
          )}
          <FormGroup>
            <PercentageField formik={formik} />
          </FormGroup>
          <div className="data-list-sidebar-footer d-flex justify-content-end align-items-center mt-1">
            <Button color="primary" type="submit" className="ml-1">
              Salvar
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

CostCentersSidebar.propTypes = {
  costCenter: PropTypes.object,
  updateCostCenter: PropTypes.func,
  addNewCostCenter: PropTypes.func,
  handleSidebar: PropTypes.func,
  show: PropTypes.bool,
  costCenters: PropTypes.array,
  costCentersTook: PropTypes.array,
};

CostCentersSidebar.defaultProps = {
  costCenter: {},
  updateCostCenter: () => {},
  addNewCostCenter: () => {},
  handleSidebar: () => {},
  show: false,
  costCenters: [],
  costCentersTook: [],
};

export default CostCentersSidebar;
