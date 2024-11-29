import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Row, Col, Form, Label, FormGroup, CustomInput } from 'reactstrap';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../components/inputs/TextField';

import { fetchCategoriesList } from '../../../../services/apis/category.api';

import {
  formatCommercialPhone,
  formatMobilePhone,
  formatCpf,
  formatCnpj,
  getOnlyNumbers,
  formatMoney,
  getMonetaryValue,
} from '../../../../utils/formaters';

import {
  companyPersonTypes,
  stateTaxpayerOptions,
  simplesNacionalOptions,
  statusOptions,
  businessTypes,
} from '../../../../utils/companies';

const CompanyInfoForm = ({
  company,
  companyType,
  formik,
  availablesSpecialTaxationRegime,
  currentCompanyId,
}) => {
  const intl = useIntl();
  const { company_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [categories, setCategories] = useState([]);

  const getCategoriesListParams = () => {
    switch (companyType) {
      case 'client':
        return '?type=1';
      case 'supplier':
        return '?type=2';
      default:
        return null;
    }
  };

  const getCategoriesList = async () => {
    const responseCategoriesList = await fetchCategoriesList({
      params: getCategoriesListParams(),
    });

    const arrayDataFormatedSubcategories = responseCategoriesList.data.map(
      (subcategory) => ({
        value: subcategory.id,
        label: subcategory.name,
      })
    );
    setCategories(arrayDataFormatedSubcategories);
  };

  useEffect(() => {
    const fetchData = async () => {
      // If the user is not creating his first company
      if (currentCompanyId) {
        await getCategoriesList();
      }
      setInitialized(true);
    };
    fetchData();
  }, [companyType, company_id]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      {initialized && (
        <Row className="mt-1">
          {Boolean(!company_id) && (
            <Col sm="12">
              <h5 className="mb-1">
                <span className="align-middle">Informações</span>
              </h5>
            </Col>
          )}
          {Boolean(company_id) && (
            <Col className="mt-1" sm="12">
              <h3 className="mb-1 text-primary">
                <span className="align-middle">Dados Gerais</span>
              </h3>
            </Col>
          )}
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="person_type">
                <FormattedMessage id="company.person_type" /> *
              </Label>
              <Select
                id="person_type"
                options={companyPersonTypes}
                className="React"
                classNamePrefix="select"
                onBlur={formik.handleBlur}
                defaultValue={companyPersonTypes.filter(
                  (person_type) =>
                    person_type.value === formik.initialValues.person_type
                )}
                onChange={(opt) => {
                  formik.setFieldValue('person_type', opt.value);
                }}
              />
              {formik.errors.person_type && formik.touched.person_type ? (
                <div className="invalid-tooltip mt-25">
                  {formik.errors.person_type}
                </div>
              ) : null}
            </FormGroup>
          </Col>
          {formik.values.person_type && (
            <>
              <Col md="6" sm="12">
                <TextField
                  id="document"
                  required={companyType === 'company'}
                  onBlur={formik.handleBlur}
                  value={
                    !formik.values.person_type ||
                    formik.values.person_type === 2
                      ? formatCpf(formik.values.document)
                      : formatCnpj(formik.values.document)
                  }
                  onChange={(e) =>
                    formik.setFieldValue(
                      'document',
                      getOnlyNumbers(e.target.value)
                    )
                  }
                  placeholder={intl.formatMessage({
                    id:
                      !formik.values.person_type ||
                      formik.values.person_type === 2
                        ? 'company.cpf'
                        : 'company.cnpj',
                  })}
                  label={intl.formatMessage({
                    id:
                      !formik.values.person_type ||
                      formik.values.person_type === 2
                        ? 'company.cpf'
                        : 'company.cnpj',
                  })}
                  error={formik.touched.document && formik.errors.document}
                />
              </Col>
              <Col md="6" sm="12">
                <TextField
                  id="company_name"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.company_name}
                  placeholder={intl.formatMessage({
                    id:
                      !formik.values.person_type ||
                      formik.values.person_type === 2
                        ? 'company.name'
                        : 'company.company_name',
                  })}
                  label={intl.formatMessage({
                    id:
                      !formik.values.person_type ||
                      formik.values.person_type === 2
                        ? 'company.name'
                        : 'company.company_name',
                  })}
                  error={
                    formik.touched.company_name && formik.errors.company_name
                  }
                />
              </Col>
              <Col md="6" sm="12">
                {formik.values.person_type === 1 && (
                  <TextField
                    id="trading_name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.trading_name}
                    placeholder={intl.formatMessage({
                      id: 'company.trading_name',
                    })}
                    label={intl.formatMessage({ id: 'company.trading_name' })}
                    error={
                      formik.touched.trading_name && formik.errors.trading_name
                    }
                  />
                )}
                {Boolean(company_id && formik.values.person_type === 2) && (
                  <TextField
                    id="rg"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.rg}
                    placeholder={intl.formatMessage({ id: 'company.rg' })}
                    label={intl.formatMessage({ id: 'company.rg' })}
                    error={formik.touched.rg && formik.errors.rg}
                  />
                )}
              </Col>
            </>
          )}
          {Boolean(formik.values.person_type && !company_id) && (
            <>
              {Boolean(companyType === 'supplier') && (
                <Col className="mt-1" sm="12">
                  <h5 className="mb-1">
                    {/* <User className="mr-50" size={16} /> */}
                    <span className="align-middle">Categoria de Despesa</span>
                  </h5>
                  <Row>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <Label for="category">
                          <FormattedMessage id="company.category" />
                        </Label>
                        <Select
                          options={categories}
                          className="React"
                          classNamePrefix="select"
                          id="category"
                          onBlur={formik.handleBlur}
                          defaultValue={categories.filter(
                            (category) =>
                              category.value ===
                              formik.initialValues.category_id
                          )}
                          onChange={(opt) => {
                            formik.setFieldValue('category_id', opt.value);
                          }}
                        />
                        {formik.errors.category_id &&
                        formik.touched.category_id ? (
                          <div className="invalid-tooltip mt-25">
                            {formik.errors.category_id}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              )}
              {Boolean(companyType === 'client') && (
                <Col className="mt-1" sm="12">
                  <h5 className="mb-1">
                    {/* <User className="mr-50" size={16} /> */}
                    <span className="align-middle">Categoria de Receita</span>
                  </h5>
                  <Row>
                    <Col md="6" sm="12">
                      <FormGroup>
                        <Label for="category">
                          <FormattedMessage id="company.category" />
                        </Label>
                        <Select
                          options={categories}
                          className="React"
                          classNamePrefix="select"
                          id="category"
                          onBlur={formik.handleBlur}
                          defaultValue={categories.filter(
                            (category) =>
                              category.value ===
                              formik.initialValues.category_id
                          )}
                          onChange={(opt) => {
                            formik.setFieldValue('category_id', opt.value);
                          }}
                        />
                        {formik.errors.category_id &&
                        formik.touched.category_id ? (
                          <div className="invalid-tooltip mt-25">
                            {formik.errors.category_id}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              )}
              {Boolean(companyType === 'company') && (
                <Col className="mt-1" sm="12">
                  <h5 className="mb-1">
                    <span className="align-middle">Segmento</span>
                  </h5>
                  <Row>
                    <Col md="12" sm="12">
                      <FormGroup>
                        <Label for="business_type">
                          <FormattedMessage id="company.business_type" />
                        </Label>
                        <Select
                          options={businessTypes}
                          className="React"
                          classNamePrefix="select"
                          id="business_type"
                          onBlur={formik.handleBlur}
                          defaultValue={businessTypes.filter(
                            (business_type) =>
                              business_type.value ===
                              formik.initialValues.business_type
                          )}
                          onChange={(opt) => {
                            formik.setFieldValue('business_type', opt.value);
                          }}
                        />
                        {formik.errors.business_type &&
                        formik.touched.business_type ? (
                          <div className="invalid-tooltip mt-25">
                            {formik.errors.business_type}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              )}
              <Col className="mt-1" sm="12">
                <h5 className="mb-1">
                  <span className="align-middle">Contato Financeiro</span>
                </h5>
                <TextField
                  id="contacts[1].name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.contacts[1].name}
                  placeholder={intl.formatMessage({ id: 'contacts.name' })}
                  label={intl.formatMessage({ id: 'contacts.name' })}
                  error={
                    get(formik.touched, 'contacts[1].name') &&
                    get(formik.errors, 'contacts[1].name')
                  }
                />
                <TextField
                  id="contacts[1].email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.contacts[1].email}
                  placeholder={intl.formatMessage({ id: 'contacts.email' })}
                  label={intl.formatMessage({ id: 'contacts.email' })}
                  error={
                    get(formik.touched, 'contacts[1].email') &&
                    get(formik.errors, 'contacts[1].email')
                  }
                />
                <TextField
                  id="contacts[1].phone"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'contacts[1].phone',
                      getOnlyNumbers(e.target.value)
                    )
                  }
                  value={formatCommercialPhone(formik.values.contacts[1].phone)}
                  placeholder={intl.formatMessage({ id: 'contacts.phone' })}
                  label={intl.formatMessage({ id: 'contacts.phone' })}
                  error={
                    get(formik.touched, 'contacts[1].phone') &&
                    get(formik.errors, 'contacts[1].phone')
                  }
                />
                <TextField
                  id="contacts[1].whatsapp"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'contacts[1].whatsapp',
                      getOnlyNumbers(e.target.value)
                    )
                  }
                  value={formatMobilePhone(formik.values.contacts[1].whatsapp)}
                  placeholder={intl.formatMessage({
                    id: 'contacts.whatsapp',
                  })}
                  label={intl.formatMessage({ id: 'contacts.whatsapp' })}
                  error={
                    get(formik.touched, 'contacts[1].whatsapp') &&
                    get(formik.errors, 'contacts[1].whatsapp')
                  }
                />
              </Col>
            </>
          )}
          {Boolean(company_id) && (
            <>
              {Boolean(
                companyType === 'client' || companyType === 'supplier'
              ) && (
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="category">
                      <FormattedMessage id="company.category" />
                    </Label>
                    <Select
                      options={categories}
                      className="React"
                      classNamePrefix="select"
                      id="category"
                      onBlur={formik.handleBlur}
                      defaultValue={categories.filter(
                        (category) =>
                          category.value === formik.initialValues.category_id
                      )}
                      onChange={(opt) => {
                        formik.setFieldValue('category_id', opt.value);
                      }}
                    />
                    {formik.errors.category_id && formik.touched.category_id ? (
                      <div className="invalid-tooltip mt-25">
                        {formik.errors.category_id}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
              )}
              {Boolean(companyType !== 'company') && <Col md="6" />}
              {Boolean(companyType === 'company') && (
                <>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="business_type">
                        <FormattedMessage id="company.business_type" />
                      </Label>
                      <Select
                        options={businessTypes}
                        className="React"
                        classNamePrefix="select"
                        id="business_type"
                        onBlur={formik.handleBlur}
                        defaultValue={businessTypes.filter(
                          (business_type) =>
                            business_type.value ===
                            formik.initialValues.business_type
                        )}
                        onChange={(opt) => {
                          formik.setFieldValue('business_type', opt.value);
                        }}
                      />
                      {formik.errors.business_type &&
                      formik.touched.business_type ? (
                        <div className="invalid-tooltip mt-25">
                          {formik.errors.business_type}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <TextField
                      id="email"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      placeholder={intl.formatMessage({
                        id: 'company.email',
                      })}
                      label={intl.formatMessage({
                        id: 'company.email',
                      })}
                      error={formik.touched.email && formik.errors.email}
                    />
                  </Col>
                </>
              )}
              {formik.values.person_type === 1 && (
                <>
                  <Col md="6" sm="12">
                    <TextField
                      id="city_inscription"
                      onBlur={formik.handleBlur}
                      onChange={(e) =>
                        formik.setFieldValue(
                          'city_inscription',
                          e.target.value?.replace(/\W/g, '').toUpperCase()
                        )
                      }
                      value={formik.values.city_inscription}
                      placeholder={intl.formatMessage({
                        id: 'company.city_inscription',
                      })}
                      label={intl.formatMessage({
                        id: 'company.city_inscription',
                      })}
                      error={
                        formik.touched.city_inscription &&
                        formik.errors.city_inscription
                      }
                    />
                  </Col>
                  <Col md="6" sm="12">
                    <TextField
                      id="state_inscription"
                      onBlur={formik.handleBlur}
                      onChange={(e) =>
                        formik.setFieldValue(
                          'state_inscription',
                          e.target.value?.replace(/\W/g, '').toUpperCase()
                        )
                      }
                      value={formik.values.state_inscription}
                      placeholder={intl.formatMessage({
                        id: 'company.state_inscription',
                      })}
                      label={intl.formatMessage({
                        id: 'company.state_inscription',
                      })}
                      error={
                        formik.touched.state_inscription &&
                        formik.errors.state_inscription
                      }
                    />
                  </Col>
                  {companyType === 'company' && (
                    <Col md="6" sm="12">
                      <FormGroup>
                        <Label for="special_taxation_regime">
                          <FormattedMessage id="company.special_taxation_regime" />
                        </Label>
                        <Select
                          options={availablesSpecialTaxationRegime || []}
                          placeholder={
                            availablesSpecialTaxationRegime.length
                              ? 'Select...'
                              : formik.values.address?.[0]?.city_id
                              ? 'Não há opções para o seu município'
                              : 'Preencha o campo endereço para visualizar as opções'
                          }
                          className="React"
                          classNamePrefix="select"
                          id="special_taxation_regime"
                          onBlur={formik.handleBlur}
                          defaultValue={availablesSpecialTaxationRegime.filter(
                            (specialTaxationRegime) =>
                              specialTaxationRegime.value ===
                              formik.initialValues.special_taxation_regime
                          )}
                          onChange={(opt) => {
                            formik.setFieldValue(
                              'special_taxation_regime',
                              opt.value
                            );
                          }}
                        />
                        {formik.errors.special_taxation_regime &&
                        formik.touched.special_taxation_regime ? (
                          <div className="invalid-tooltip mt-25">
                            {formik.errors.special_taxation_regime}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  )}
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="simples_nacional">
                        <FormattedMessage id="company.simples_nacional" />
                      </Label>
                      <Select
                        options={simplesNacionalOptions}
                        className="React"
                        classNamePrefix="select"
                        id="simples_nacional"
                        onBlur={formik.handleBlur}
                        defaultValue={simplesNacionalOptions.filter(
                          (simples_nacional) =>
                            simples_nacional.value ===
                            formik.initialValues.simples_nacional
                        )}
                        onChange={(opt) => {
                          formik.setFieldValue('simples_nacional', opt.value);
                        }}
                      />
                      {formik.errors.simples_nacional &&
                      formik.touched.simples_nacional ? (
                        <div className="invalid-tooltip mt-25">
                          {formik.errors.simples_nacional}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="state_taxpayer">
                        <FormattedMessage id="company.state_taxpayer" />
                      </Label>
                      <Select
                        options={stateTaxpayerOptions}
                        className="React"
                        classNamePrefix="select"
                        id="state_taxpayer"
                        onBlur={formik.handleBlur}
                        defaultValue={stateTaxpayerOptions.filter(
                          (state_taxpayer) =>
                            state_taxpayer.value ===
                            formik.initialValues.state_taxpayer
                        )}
                        onChange={(opt) => {
                          formik.setFieldValue('state_taxpayer', opt.value);
                        }}
                      />
                      {formik.errors.state_taxpayer &&
                      formik.touched.state_taxpayer ? (
                        <div className="invalid-tooltip mt-25">
                          {formik.errors.state_taxpayer}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <TextField
                      id="foreign_identifier"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.foreign_identifier}
                      placeholder={intl.formatMessage({
                        id: 'company.foreign_identifier',
                      })}
                      label={intl.formatMessage({
                        id: 'company.foreign_identifier',
                      })}
                      error={
                        formik.touched.foreign_identifier &&
                        formik.errors.foreign_identifier
                      }
                    />
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="status">
                        <FormattedMessage id="company.status" />
                      </Label>
                      <Select
                        options={statusOptions}
                        className="React"
                        classNamePrefix="select"
                        id="status"
                        onBlur={formik.handleBlur}
                        defaultValue={statusOptions.filter(
                          (statusOption) =>
                            statusOption.value === formik.initialValues.status
                        )}
                        onChange={(opt) => {
                          formik.setFieldValue('status', opt.value);
                        }}
                      />
                      {formik.errors.status && formik.touched.status ? (
                        <div className="invalid-tooltip mt-25">
                          {formik.errors.status}
                        </div>
                      ) : null}
                    </FormGroup>
                  </Col>
                </>
              )}
              <Col md="6" sm="12">
                <FormGroup>
                  <Label className="d-block" for="birthday">
                    {Boolean(
                      !formik.values.person_type ||
                        formik.values.person_type === 2
                    ) && <FormattedMessage id="company.birthday" />}
                    {Boolean(formik.values.person_type === 1) && (
                      <FormattedMessage id="company.date_foundation" />
                    )}
                  </Label>
                  <Flatpickr
                    id="birthday"
                    className="form-control"
                    options={{
                      dateFormat: 'Y-m-d',
                      altFormat: 'd/m/Y',
                      altInput: true,
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.birthday}
                    onChange={(date) => formik.setFieldValue('birthday', date)}
                  />
                  {formik.errors.birthday && formik.touched.birthday ? (
                    <div className="invalid-tooltip mt-25">
                      {formik.errors.birthday}
                    </div>
                  ) : null}
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <TextField
                  id="transaction_value"
                  onBlur={formik.handleBlur}
                  value={formatMoney(formik.values.monthly_revenue)}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'monthly_revenue',
                      getMonetaryValue(e.target.value)
                    )
                  }
                  placeholder="0,00"
                  label={intl.formatMessage({
                    id: 'company.monthly_revenue',
                  })}
                  error={get(formik.errors, 'monthly_revenue')}
                />
              </Col>
              <Col md="6" sm="12">
                <TextField
                  id="site"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.site}
                  placeholder={intl.formatMessage({ id: 'company.site' })}
                  label={intl.formatMessage({ id: 'company.site' })}
                  error={formik.touched.site && formik.errors.site}
                />
              </Col>
              <Col md="6" sm="12">
                <TextField
                  id="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  placeholder={intl.formatMessage({ id: 'company.email' })}
                  label={intl.formatMessage({ id: 'company.email' })}
                  error={formik.touched.email && formik.errors.email}
                />
              </Col>
              <Col md="6" sm="12">
                <TextField
                  id="phone"
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'phone',
                      getOnlyNumbers(e.target.value)
                    )
                  }
                  value={
                    formik.values.phone?.length <= 10
                      ? formatCommercialPhone(formik.values.phone)
                      : formatMobilePhone(formik.values.phone)
                  }
                  placeholder={intl.formatMessage({ id: 'company.phone' })}
                  label={intl.formatMessage({ id: 'company.phone' })}
                  error={formik.touched.phone && formik.errors.phone}
                />
              </Col>
              <Col md="12" sm="12">
                <TextField
                  id="observation"
                  type="textarea"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.observation}
                  placeholder={intl.formatMessage({
                    id: 'company.observation',
                  })}
                  label={intl.formatMessage({ id: 'company.observation' })}
                  error={
                    formik.touched.observation && formik.errors.observation
                  }
                />
              </Col>
              {/* <Col md="12" sm="12">
                <TextField
                  id="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  placeholder={intl.formatMessage({
                    id: 'company.email',
                  })}
                  label={intl.formatMessage({ id: 'company.email' })}
                  error={formik.touched.email && formik.errors.email}
                />
              </Col> */}
              <Col md="12" sm="12">
                <CustomInput
                  type="switch"
                  id="allow_notifications"
                  name="allow_notifications"
                  inline
                  defaultChecked={formik.values.allow_notifications}
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'allow_notifications',
                      !formik.values.allow_notifications
                    )
                  }
                  value={formik.values.allow_notifications}
                >
                  <span className="switch-label">
                    {intl.formatMessage({
                      id: 'company.allow_notifications',
                    })}
                  </span>
                </CustomInput>
              </Col>
            </>
          )}
        </Row>
      )}
    </Form>
  );
};

CompanyInfoForm.propTypes = {
  company: propTypes.object.isRequired,
  companyType: propTypes.string.isRequired,
  formik: propTypes.object.isRequired,
  availablesSpecialTaxationRegime: propTypes.array.isRequired,
};

CompanyInfoForm.defaultProps = {};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(CompanyInfoForm);
