import React from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { X } from 'react-feather';
import { FormGroup, Label, Button, Col } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import moment from 'moment';
import makeAnimated from 'react-select/animated';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';
import {
  createAccrualPeriodClosure,
  destroyAccrualPeriodClosure,
} from '../../../../services/apis/accrual_period_closure.api';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

export function PeriodClosureSidebar({
  showSidebar,
  setShowSidebar,
  bankAccountOptions,
  handlePeriodList,
}) {
  const animatedComponents = makeAnimated();

  const onSubmit = async () => {
    if (formik.values.close_period) {
      await createAccrualPeriodClosure({
        bankAccountId: formik.values.bank_account_id,
        data: {
          start_date: formik.values.date[0],
          end_date: formik.values.date[1],
        },
      });
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Período encerrado com sucesso',
          hasTimeout: true,
        })
      );
    } else {
      await destroyAccrualPeriodClosure({
        bankAccountId: formik.values.bank_account_id,
        data: {
          start_date: formik.values.date[0],
          end_date: formik.values.date[1],
        },
      });
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Período reaberto com sucesso',
          hasTimeout: true,
        })
      );
    }
    setShowSidebar(false);
    handlePeriodList();
    formik.resetForm();
  };

  const initialValues = {
    close_period: true,
    bank_account_id: null,
    date: [],
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <div className={`add-event-sidebar ${showSidebar ? 'show' : 'hidden'}`}>
      <div className="header d-flex justify-content-between">
        <h3 className="text-bold-600 mb-0">Encerrar ou Reabrir Períodos</h3>
        <Button.Ripple
          className="close-icon cursor-pointer"
          onClick={() => setShowSidebar(false)}
        >
          <X size={20} />
        </Button.Ripple>
      </div>
      <div className="add-event-body">
        <form onSubmit={formik.handleSubmit}>
          <div className="add-event-fields mt-2">
            <Col lg="12" md="12" sm="12" className="mt-2">
              <Label>Encerrar ou Reabrir</Label>
              <Select
                components={animatedComponents}
                options={[
                  {
                    value: true,
                    label: 'Encerrar Período',
                  },
                  {
                    value: false,
                    label: 'Reabrir Período',
                  },
                ]}
                defaultValue={{}}
                onChange={(selected) => {
                  formik.setFieldValue('close_period', selected.value);
                }}
                className="React"
                classNamePrefix="select"
              />
            </Col>
            <Col lg="12" md="12" sm="12" className="mt-2">
              <Label>Conta Bancária</Label>
              <Select
                components={animatedComponents}
                options={bankAccountOptions}
                value={bankAccountOptions.filter(
                  (option) => option.value === formik.values.bank_account_id
                )}
                onChange={(selected) => {
                  formik.setFieldValue('bank_account_id', selected.value);
                }}
                className="React"
                classNamePrefix="select"
              />
            </Col>
            <Col lg="12" md="12" sm="12" className="mt-2">
              <FormGroup>
                <Label for="startDate">Período</Label>
                <Flatpickr
                  id="date"
                  className="form-control"
                  options={{
                    mode: 'range',
                    dateFormat: 'Y-m-d',
                    altFormat: 'd/m/Y',
                    altInput: true,
                  }}
                  value={formik.values.date}
                  onChange={(date) => {
                    if (date.length === 2) {
                      formik.setFieldValue('date', [
                        moment(date[0]).format('YYYY-MM-DD'),
                        moment(date[1]).format('YYYY-MM-DD'),
                      ]);
                    }
                  }}
                />
              </FormGroup>
            </Col>
          </div>
          <hr className="my-2" />
          <div className="add-event-actions text-right">
            <Button.Ripple
              className="ml-1"
              color="flat-danger"
              onClick={() => {
                setShowSidebar(false);
              }}
            >
              Cancelar
            </Button.Ripple>
            <Button.Ripple color="primary" type="submit">
              Salvar
            </Button.Ripple>
          </div>
        </form>
      </div>
    </div>
  );
}

PeriodClosureSidebar.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  setShowSidebar: PropTypes.func.isRequired,
  bankAccountOptions: PropTypes.array.isRequired,
  handlePeriodList: PropTypes.func.isRequired,
};

export default PeriodClosureSidebar;
