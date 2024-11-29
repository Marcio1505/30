import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Label, FormGroup } from 'reactstrap';
import Select from 'react-select';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../components/inputs/TextField';

import { fetchBanksList } from '../../../../services/apis/banks.api';

const CompanyBankAccountForm = ({ formik }) => {
  const intl = useIntl();
  const [initialized, setInitialized] = useState(false);
  const [banks, setBanks] = useState([]);
  const bankTypes = [
    {
      value: 1,
      label: 'Conta Corrente',
    },
    {
      value: 2,
      label: 'Conta Poupança',
    },
    {
      value: 3,
      label: 'Conta Caixa',
    },
    {
      value: 4,
      label: 'Conta Investimento',
    },
    {
      value: 5,
      label: 'Conta Cartão de crédito',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataBanks } = await fetchBanksList();

      const arrayDataIuli = [
        {
          value: 1001,
          label: '1001 - Banco IULI',
          name: 'Banco IULI',
        },
      ];

      const arrayDataFormatedBanks = dataBanks.map((bank) => ({
        value: bank.id,
        label: `${bank.code} - ${bank.name}`,
        name: bank.name,
      }));

      setBanks(arrayDataIuli.concat(arrayDataFormatedBanks));
      setInitialized(true);
    };
    fetchData();
  }, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
      {initialized && (
        <>
          <Row className="mt-1">
            <Col className="mt-1" sm="12">
              <h3 className="mt-1 text-primary">
                <span className="align-middle">Conta Bancária</span>
              </h3>
            </Col>
            <Col className="mt-1" md="6" sm="12">
              <FormGroup>
                <Label for="bank">
                  <FormattedMessage id="bank-account.bank" />
                </Label>
                <Select
                  options={banks}
                  className="React"
                  classNamePrefix="select"
                  id="bank"
                  onBlur={formik.handleBlur}
                  defaultValue={banks.filter((bank) =>
                    bank.value === formik.initialValues.bank_accounts
                      ? formik.initialValues.bank_accounts[0]?.bank_id
                      : ''
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('bank_accounts[0].bank_id', opt.value);
                  }}
                />
                {formik.errors.bank_id && formik.touched.bank_id ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.bank_id}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col className="mt-1" md="6" sm="12">
              <FormGroup>
                <Label for="type">
                  <FormattedMessage id="bank-account.type" />
                </Label>
                <Select
                  options={bankTypes}
                  className="React"
                  classNamePrefix="select"
                  id="type"
                  onBlur={formik.handleBlur}
                  defaultValue={bankTypes.filter(
                    (type) =>
                      type.value === formik.initialValues.bank_accounts[0].type
                  )}
                  onChange={(opt) => {
                    formik.setFieldValue('bank_accounts[0].type', opt.value);
                  }}
                />
                {formik.errors.type && formik.touched.type ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.type}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="mt-1" md="6" sm="12">
              <Row>
                <Col md="8" sm="12">
                  <TextField
                    id="bank_accounts[0].branch"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.bank_accounts[0].branch}
                    placeholder={intl.formatMessage({
                      id: 'bank-account.branch',
                    })}
                    label={intl.formatMessage({ id: 'bank-account.branch' })}
                    error={
                      get(formik.touched, 'bank_accounts[0].branch') &&
                      get(formik.errors, 'bank_accounts[0].branch')
                    }
                  />
                </Col>
                <Col md="4" sm="12">
                  <TextField
                    id="bank_accounts[0].branch_digit"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.bank_accounts[0].branch_digit}
                    placeholder={intl.formatMessage({
                      id: 'bank-account.branch_digit',
                    })}
                    label={intl.formatMessage({
                      id: 'bank-account.branch_digit',
                    })}
                    error={
                      get(formik.touched, 'bank_accounts[0].branch_digit') &&
                      get(formik.errors, 'bank_accounts[0].branch_digit')
                    }
                  />
                </Col>
              </Row>
            </Col>
            <Col className="mt-1" md="6" sm="12">
              <Row>
                <Col md="8" sm="12">
                  <TextField
                    id="bank_accounts[0].account"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.bank_accounts[0].account}
                    placeholder={intl.formatMessage({
                      id: 'bank-account.account',
                    })}
                    label={intl.formatMessage({ id: 'bank-account.account' })}
                    error={
                      get(formik.touched, 'bank_accounts[0].account') &&
                      get(formik.errors, 'bank_accounts[0].account')
                    }
                  />
                </Col>
                <Col md="4" sm="12">
                  <TextField
                    id="bank_accounts[0].account_digit"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.bank_accounts[0].account_digit}
                    placeholder={intl.formatMessage({
                      id: 'bank-account.account_digit',
                    })}
                    label={intl.formatMessage({
                      id: 'bank-account.account_digit',
                    })}
                    error={
                      get(formik.touched, 'bank_accounts[0].account_digit') &&
                      get(formik.errors, 'bank_accounts[0].account_digit')
                    }
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};

CompanyBankAccountForm.propTypes = {
  formik: PropTypes.object.isRequired,
};

CompanyBankAccountForm.defaultProps = {};

export default CompanyBankAccountForm;
