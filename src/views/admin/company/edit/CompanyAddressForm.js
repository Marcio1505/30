import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { get } from 'lodash';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../components/inputs/TextField';

import {
  fetchStatesList,
  fetchCitiesOfStateList,
} from '../../../../services/apis/states.api';
import { fetchCountriesList } from '../../../../services/apis/countries.api';

import { formatCep, getOnlyNumbers } from '../../../../utils/formaters';

import { validatePostalCode } from '../../../../utils/customValidators';

const CompanyAddressForm = ({ company, formik, addressRequired }) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);

  const fetchCitiesOfState = async (state_id) => {
    const { data: cities } = await fetchCitiesOfStateList({
      stateId: state_id,
    });
    const arrayDataFormatedCities = cities.map((city) => ({
      value: city.id,
      label: city.name,
      // state_initials: city.state_initials,
    }));
    setCities(arrayDataFormatedCities);
    return arrayDataFormatedCities;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: states } = await fetchStatesList();
      const arrayDataFormatedStates = states.map((state) => ({
        value: state.id,
        label: state.name,
        initials: state.initials,
      }));
      setStates(arrayDataFormatedStates);

      const companyStateId = get(company, 'address[0].state_id');

      if (companyStateId) {
        fetchCitiesOfState(companyStateId);
      }

      const { data: countries } = await fetchCountriesList();
      const arrayDataFormatedCountries = countries.map((country) => ({
        value: country.id,
        label: country.name,
      }));
      setCountries(arrayDataFormatedCountries);

      setInitialized(true);
    };
    fetchData();
  }, [company_id]);

  const toggleValidatePostalCode = async (postal_code) => {
    try {
      const address = await validatePostalCode(postal_code);

      if (address.erro) {
        console.log('error');
      } else {
        formik.setFieldValue('address[0].neighborhood', address.bairro);
        formik.setFieldValue('address[0].street', address.logradouro);
        const state_id = states.find((d) => d.initials === address.uf).value;
        formik.setFieldValue('address[0].state_id', state_id);
        const cities = await fetchCitiesOfState(state_id);
        formik.setFieldValue(
          'address[0].city_id',
          cities.find((d) => d.label === address.localidade).value
        );
        formik.setFieldValue('address[0].country_id', 1);
      }
    } catch (err) {
      console.log('CATCH ERROR', err);
    }
  };

  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      if ((formik.values.address[0].postal_code || '').length === 8) {
        toggleValidatePostalCode(formik.values.address[0].postal_code);
      }
    } else {
      didMount.current = true;
    }
  }, [formik.values.address[0].postal_code]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      {initialized && (
        <Row className="mt-1">
          <Col className="mt-1" sm="12">
            <h3 className="mt-1 text-primary">
              <span className="align-middle">Endereço</span>
            </h3>
          </Col>
          <Col className="mt-1" md="6" sm="12">
            <TextField
              id="address[0].postal_code"
              required={addressRequired}
              onBlur={formik.handleBlur}
              value={formatCep(formik.values.address[0].postal_code)}
              onChange={(e) =>
                formik.setFieldValue(
                  'address[0].postal_code',
                  getOnlyNumbers(e.target.value)
                )
              }
              placeholder={intl.formatMessage({ id: 'address.postal_code' })}
              label={intl.formatMessage({ id: 'address.postal_code' })}
              error={
                get(formik.touched, 'address[0].postal_code') &&
                get(formik.errors, 'address[0].postal_code')
              }
            />
          </Col>
          <Col className="mt-1" md="6" sm="12">
            <TextField
              id="address[0].street"
              required={addressRequired}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.address[0].street}
              placeholder={intl.formatMessage({ id: 'address.street' })}
              label={intl.formatMessage({ id: 'address.street' })}
              error={
                get(formik.touched, 'address[0].street') &&
                get(formik.errors, 'address[0].street')
              }
            />
          </Col>
          <Col md="6" sm="12">
            <TextField
              id="address[0].number"
              required={addressRequired}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.address[0].number}
              placeholder={intl.formatMessage({ id: 'address.number' })}
              label={intl.formatMessage({ id: 'address.number' })}
              error={
                get(formik.touched, 'address[0].number') &&
                get(formik.errors, 'address[0].number')
              }
            />
          </Col>
          <Col md="6" sm="12">
            <TextField
              id="address[0].complement"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.address[0].complement}
              placeholder={intl.formatMessage({ id: 'address.complement' })}
              label={intl.formatMessage({ id: 'address.complement' })}
              error={
                get(formik.touched, 'address[0].complement') &&
                get(formik.errors, 'address[0].complement')
              }
            />
          </Col>
          <Col md="6" sm="12">
            <TextField
              id="address[0].neighborhood"
              required={addressRequired}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.address[0].neighborhood}
              placeholder={intl.formatMessage({ id: 'address.neighborhood' })}
              label={intl.formatMessage({ id: 'address.neighborhood' })}
              required
              error={
                get(formik.touched, 'address[0].neighborhood') &&
                get(formik.errors, 'address[0].neighborhood')
              }
            />
          </Col>
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="address-state-id">
                <FormattedMessage id="address.state" />
                {addressRequired ? ' *' : ''}
              </Label>
              <Select
                id="address-state-id"
                required={addressRequired}
                options={states}
                className="React"
                classNamePrefix="select"
                onBlur={formik.handleBlur}
                value={states.filter(
                  (state) => state.value === formik.values.address[0].state_id
                )}
                onChange={(opt) => {
                  formik.setFieldValue('address[0].state_id', opt.value);
                  formik.setFieldValue('address[0].city_id', '');
                  fetchCitiesOfState(opt.value);
                }}
              />
              {get(formik.touched, 'address[0].state_id') &&
              get(formik.errors, 'address[0].state_id') ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.address[0].state_id}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="address-city-id">
                <FormattedMessage id="address.city" />
                {addressRequired ? ' *' : ''}
              </Label>
              <Select
                id="address-city-id"
                required={addressRequired}
                options={cities}
                className="React"
                classNamePrefix="select"
                onBlur={formik.handleBlur}
                value={cities.filter(
                  (city) => city.value === formik.values.address[0].city_id
                )}
                onChange={(opt) => {
                  formik.setFieldValue('address[0].city_id', opt.value);
                }}
              />
              {get(formik.touched, 'address[0].city_id') &&
              get(formik.errors, 'address[0].city_id') ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.address[0].city_id}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="address-country-id">
                <FormattedMessage id="address.country" />
                {addressRequired ? ' *' : ''}
              </Label>
              <Select
                id="country-id"
                required={addressRequired}
                options={countries}
                className="React"
                classNamePrefix="select"
                onBlur={formik.handleBlur}
                value={countries.filter(
                  (country) =>
                    country.value === formik.values.address[0].country_id
                )}
                defaultValue={1}
                onChange={(opt) => {
                  formik.setFieldValue('address[0].country_id', opt.value);
                }}
              />
              {get(formik.touched, 'address[0].country_id') &&
              get(formik.errors, 'address[0].country_id') ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.address[0].country_id}
                </div>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
      )}
    </Form>
  );
};

CompanyAddressForm.propTypes = {
  formik: PropTypes.object.isRequired,
  company: PropTypes.object,
  addressRequired: PropTypes.bool,
};

CompanyAddressForm.defaultProps = {
  company: {},
  addressRequired: false,
};

export default CompanyAddressForm;
