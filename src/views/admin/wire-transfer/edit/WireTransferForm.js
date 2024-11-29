import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Row, Col, Button, Form, Label, FormGroup } from 'reactstrap';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useHistory } from 'react-router-dom';

import { get } from 'lodash';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../components/inputs/TextField';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  fetchBankAccountsList,
  getCurrentBalance,
} from '../../../../services/apis/bank_account.api';
import {
  showWireTransfer,
  createWireTransfer,
} from '../../../../services/apis/wire_transfers.api';

import { formatMoney, getMonetaryValue } from '../../../../utils/formaters';

const WireTransferForm = ({ currentCompanyId }) => {
  const history = useHistory();
  const intl = useIntl();
  const { wire_transfer_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [iuliBankAccount, setIuliBankAccount] = useState({});
  const [wireTransfer, setWireTransfer] = useState({});
  const [currentBalance, setCurrentBalance] = useState(null);

  const mountPayload = () => ({
    wireTransfer: {
      bank_account_id: formik.values.bank_account_id,
      to_bank_account_id: formik.values.to_bank_account_id,
      transfer_value: formik.values.transfer_value,
    },
  });

  const onSubmit = async () => {
    await createWireTransfer(mountPayload());

    store.dispatch(
      applicationActions.toggleDialog({
        type: 'warning',
        title: 'Atenção',
        message:
          'Confirme a solicitação de transferência pelo email recebido em até 1h para que seja efetivada a solicitação',
        hasTimeout: false,
      })
    );
    history.push('/');
  };

  const initialValues = {
    to_bank_account_id: wireTransfer.to_bank_account_id || '',
    bank_account_id: wireTransfer.bank_account_id || iuliBankAccount.id,
    transfer_value: wireTransfer.transfer_value || '',
  };

  const validationSchema = Yup.object().shape({
    to_bank_account_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    bank_account_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    transfer_value: Yup.string()
      .required(intl.formatMessage({ id: 'errors.required' }))
      .test(
        'balance',
        'Valor superior ao saldo disponível',
        (transfer_value) => transfer_value <= currentBalance
      ),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataBankAccounts } = await fetchBankAccountsList();
      setBankAccounts(
        dataBankAccounts
          .filter(
            (_bankAccount) => _bankAccount.type === 1 || _bankAccount.type === 2
          )
          .map((__bankAccount) => ({
            value: __bankAccount.id,
            label: __bankAccount.name,
          }))
      );

      const _iuliBankAccount = dataBankAccounts.find(
        (_bankAccount) => _bankAccount.type === 9
      );
      setIuliBankAccount(_iuliBankAccount);

      const dataBalance = await getCurrentBalance({
        id: _iuliBankAccount.id,
      });

      setCurrentBalance(dataBalance?.data.current_balance);

      let dataWireTransfer = {};
      if (wire_transfer_id) {
        // let { data: dataWireTransfer } = await showTransfer({ id: wire_transfer_id });
        const res = await showWireTransfer({ id: wire_transfer_id });
        dataWireTransfer = res.data;
      }
      setWireTransfer(dataWireTransfer);

      setInitialized(true);
    };
    fetchData();
  }, [wire_transfer_id]);

  useEffect(() => {
    if (
      wireTransfer?.company_id &&
      currentCompanyId !== wireTransfer.company_id
    ) {
      history.push(`/admin/bank-accounts/list`);
    }
  }, [currentCompanyId]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      {initialized && (
        <Row className="mt-1">
          <Col className="mt-1" sm="12">
            <h4 className="text-warning">
              Saldo disponível para saque: {formatMoney(currentBalance)}
            </h4>
          </Col>
          <Col className="mt-1" md="6" sm="12">
            <TextField
              id="bank_account_id"
              required
              readOnly
              value={iuliBankAccount.name}
              label={intl.formatMessage({ id: 'transfers.bank_account' })}
              error={
                get(formik.touched, 'bank_account_id') &&
                get(formik.errors, 'bank_account_id')
              }
            />
          </Col>

          <Col className="mt-1" md="6" sm="12">
            <FormGroup>
              <Label for="to_bank_account_id">
                <FormattedMessage id="transfers.to_bank_account" /> *
              </Label>
              <Select
                options={bankAccounts}
                className="React"
                classNamePrefix="select"
                id="to_bank_account_id"
                onBlur={formik.handleBlur}
                defaultValue={bankAccounts.filter(
                  (bank_account) =>
                    bank_account.value ===
                    formik.initialValues.to_bank_account_id
                )}
                onChange={(opt) => {
                  formik.setFieldValue('to_bank_account_id', opt.value);
                }}
              />
              {formik.errors.to_bank_account_id &&
              formik.touched.to_bank_account_id ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.to_bank_account_id}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col md="6" sm="12">
            <TextField
              id="transfer_value"
              required
              onBlur={formik.handleBlur}
              value={formatMoney(formik.values.transfer_value)}
              onChange={(e) =>
                formik.setFieldValue(
                  'transfer_value',
                  getMonetaryValue(e.target.value)
                )
              }
              placeholder="0,00"
              label={intl.formatMessage({ id: 'transfers.transfer_value' })}
              error={
                get(formik.touched, 'transfer_value') &&
                get(formik.errors, 'transfer_value')
              }
            />
          </Col>
          <Col className="d-flex justify-content-end flex-wrap" sm="12">
            <Button.Ripple className="mt-1" color="primary">
              <FormattedMessage id="button.save" />
            </Button.Ripple>
          </Col>
        </Row>
      )}
    </Form>
  );
};

WireTransferForm.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

WireTransferForm.defaultProps = {};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(WireTransferForm);
