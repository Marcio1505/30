import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardBody, Row, Col, Form, Button } from 'reactstrap';
import { get } from 'lodash';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import IuliPlanInfo from './IuliPlanInfo';
import CompanyInfoForm from './CompanyInfoForm';
import CompanyContactsForm from './CompanyContactsForm';
import CompanyAddressForm from './CompanyAddressForm';
import CompanyEnotas from './Integrations/Enotas/CompanyEnotas';
import CompanyHotmart from './Integrations/Hotmart/CompanyHotmart';
import CompanyGuru from './Integrations/Guru/CompanyGuru';
import CompanyProvi from './Integrations/Provi/CompanyProvi';
import CompanyEduzz from './Integrations/Eduzz/CompanyEduzz';
import CompanyTicto from './Integrations/Ticto/CompanyTicto';
import CompanyKiwify from './Integrations/Kiwify/CompanyKiwify';
import CompanyTmb from './Integrations/Tmb/CompanyTmb';
import CompanyHubla from './Integrations/Hubla/CompanyHubla';
import CompanyDominio from './Integrations/Dominio/CompanyDominio';
import CompanyCademi from './Integrations/Cademi/CompanyCademi';
import CompanyAsaas from './Integrations/Asaas/CompanyAsaas';
import '../../../../assets/scss/pages/users.scss';

import { getCityConfigs } from '../../../../services/apis/invoice.api';

import { formatDateToString } from '../../../../utils/formaters';
import { areAllPropertiesVoid } from '../../../../utils';

import PermissionGate from '../../../../PermissionGate';

const CompanyForm = ({ companyType, company, companyId, formSubmit }) => {
  let permissionForm = '';
  let permissionButton = '';

  switch (companyType) {
    case 'company':
      if (companyId) {
        permissionForm = 'companies.show';
        permissionButton = 'companies.update';
      } else {
        permissionForm = 'public';
        permissionButton = 'public';
      }
      break;
    case 'client':
      if (companyId) {
        permissionForm = 'clients.show';
        permissionButton = 'clients.update';
      } else {
        permissionForm = 'companies.clients.store';
        permissionButton = 'companies.clients.store';
      }
      break;
    case 'supplier':
      if (companyId) {
        permissionForm = 'suppliers.show';
        permissionButton = 'suppliers.update';
      } else {
        permissionForm = 'companies.suppliers.store';
        permissionButton = 'companies.suppliers.store';
      }
      break;
    default:
      break;
  }

  const intl = useIntl();
  const [availablesSpecialTaxationRegime, setAvailablesSpecialTaxationRegime] =
    useState([]);

  const getAvailablesSpecialTaxationRegime = async (cityId = null) => {
    const cityConfigs = await getCityConfigs(
      formik.values.address?.[0]?.city_id || company.address?.[0]?.city_id
    );
    const newAvailablesSpecialTaxationRegime =
      cityConfigs.regimesEspecialTributacao.map(
        (availableSpecialTaxationRegime) => ({
          ...availableSpecialTaxationRegime,
          value: parseInt(availableSpecialTaxationRegime.codigo),
          label: availableSpecialTaxationRegime.nome,
        })
      );
    setAvailablesSpecialTaxationRegime(newAvailablesSpecialTaxationRegime);
  };

  const mountPayload = () => {
    const contacts = formik.values.contacts.filter((contact) => {
      const { type, ...contactWithoutType } = contact;
      return !areAllPropertiesVoid(contactWithoutType);
    });
    const addresses = formik.values.address.filter(
      (singleAddress) => !areAllPropertiesVoid(singleAddress)
    );
    const bank_accounts = formik.values.bank_accounts?.filter(
      (bank_account) => !areAllPropertiesVoid(bank_account)
    );

    const { integrations } = formik.values;

    return {
      company: {
        ...(companyId && {
          id: companyId,
          status: formik.values.status,
        }),
        person_type: formik.values.person_type || '',
        business_type: formik.values.business_type || '',
        allow_notifications: formik.values.allow_notifications,
        document: formik.values.document,
        company_name: formik.values.company_name,
        trading_name: formik.values.trading_name,
        rg: formik.values.rg,
        foreign_identifier: formik.values.foreign_identifier,
        city_inscription: formik.values.city_inscription,
        state_inscription: formik.values.state_inscription,
        special_taxation_regime: formik.values.special_taxation_regime,
        site: formik.values.site,
        email: formik.values.email,
        phone: formik.values.phone,
        state_taxpayer: formik.values.state_taxpayer,
        birthday:
          typeof formik.values.birthday === 'string'
            ? formik.values.birthday
            : formatDateToString(formik.values.birthday[0]),
        monthly_revenue: formik.values.monthly_revenue,
        observation: formik.values.observation,
        category_id: formik.values.category_id,
        ...(contacts.length && {
          contacts,
        }),
        ...(addresses.length && {
          addresses,
        }),
        ...(bank_accounts?.length && {
          bank_accounts,
        }),
        ...(companyType === 'company' && {
          aliquot: formik.values.aliquot,
          simples_nacional: formik.values.simples_nacional,
          municipal_service: formik.values.municipal_service,
          description_service: formik.values.description_service,
          integrations: formik.values.integrations,
          allow_hotmart: formik.values.allow_hotmart || '',
          allow_guru: formik.values.allow_guru || '',
          allow_eduzz: formik.values.allow_eduzz || '',
          allow_cademi: formik.values.allow_cademi || '',
          allow_provi: formik.values.allow_provi || '',
          allow_ticto: formik.values.allow_ticto || '',
          allow_kiwify: formik.values.allow_kiwify || '',
          allow_tmb: formik.values.allow_tmb || '',
          allow_hubla: formik.values.allow_hubla || '',
          allow_dominio: formik.values.allow_dominio || '',
          certificate_name: formik.values.certificate_name || '',
          certificate_valid: formik.values.certificate_valid || '',
          certificate_password: formik.values.certificate_password || '',
          exterior_hotmart_invoice: formik.values.exterior_hotmart_invoice,
        }),
      },
      arquivo: formik.values.arquivo,
    };
  };

  const onSubmit = async () => {
    formSubmit(mountPayload());
  };

  const initialValues = {
    person_type: company.person_type || '',
    business_type: company.business_type || '',
    allow_notifications: company.allow_notifications,
    status: company.status,
    document: company.document || '',
    company_name: company.company_name || '',
    trading_name: company.trading_name || '',
    rg: company.rg || '',
    foreign_identifier: company.foreign_identifier || '',
    city_inscription: company.city_inscription || '',
    state_inscription: company.state_inscription || '',
    special_taxation_regime: company.special_taxation_regime || '',
    site: company.site || '',
    email: company.email || '',
    phone: company.phone || '',
    state_taxpayer: company.state_taxpayer,
    birthday: company.birthday || '',
    monthly_revenue: company.monthly_revenue || 0,
    observation: company.observation || '',
    category_id: company.category_id || '',
    contacts: [
      {
        type: 2,
        name: get(company, 'contacts[0].name') || '',
        email: get(company, 'contacts[0].email') || '',
        phone: get(company, 'contacts[0].phone') || '',
        whatsapp: get(company, 'contacts[0].whatsapp') || '',
      },
      {
        type: 1,
        name: get(company, 'contacts[1].name') || '',
        email: get(company, 'contacts[1].email') || '',
        phone: get(company, 'contacts[1].phone') || '',
        whatsapp: get(company, 'contacts[1].whatsapp') || '',
      },
    ],
    address: [
      {
        postal_code: get(company, 'address[0].postal_code') || '',
        city_id: get(company, 'address[0].city_id') || '',
        state_id: get(company, 'address[0].state_id') || '',
        country_id: get(company, 'address[0].country_id') || '',
        street: get(company, 'address[0].street') || '',
        number: get(company, 'address[0].number') || '',
        complement: get(company, 'address[0].complement') || '',
        neighborhood: get(company, 'address[0].neighborhood') || '',
      },
    ],
    ...(companyType !== 'company' && {
      bank_accounts: [
        {
          bank_id: get(company, 'bank_accounts[0].bank_id') || '',
          type: get(company, 'bank_accounts[0].type') || '',
          name: get(company, 'bank_accounts[0].name') || '',
          branch: get(company, 'bank_accounts[0].branch') || '',
          branch_digit: get(company, 'bank_accounts[0].branch_digit') || '',
          account: get(company, 'bank_accounts[0].account') || '',
          account_digit: get(company, 'bank_accounts[0].account_digit') || '',
        },
      ],
    }),
    ...(companyType === 'company' && {
      municipal_service: company.municipal_service || '',
      simples_nacional: company.simples_nacional,
      aliquot: company.aliquot || '',
      description_service: company.description_service || '',
      certificate_valid: company.company_certificates?.certificate_valid || '',
      certificate_name: company.company_certificates?.certificate_name || '',
      certificate_file: '',
      integrations: {
        ...company.integrations,
        asaas_status: parseInt(company.integrations?.asaas_status, 10) || '',
        enotas_nfs_serie: '',
        enotas_nfs_rps: '',
        enotas_nfs_batch: '',
        enotas_nfe_sequential: '',
        enotas_nfe_series: '',
        enotas_nfe_batch: '',
      },
      exterior_hotmart_invoice: company.exterior_hotmart_invoice,
    }),
  };

  const validationShape = {
    person_type: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    company_name: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    trading_name: Yup.string().when('integrations', {
      is: (integrations) => integrations?.enotas_status,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required.enotas' })
      ),
      otherwise: Yup.string(),
    }),
    document: Yup.string().when('integrations', {
      is: (integrations) =>
        companyType === 'company' || integrations?.enotas_status,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required' })
      ),
      otherwise: Yup.string(),
    }),
    city_inscription: Yup.string().when('integrations', {
      is: (integrations) => integrations?.enotas_status,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required.enotas' })
      ),
      otherwise: Yup.string(),
    }),
    state_inscription: Yup.string().when('integrations', {
      is: (integrations) => integrations?.enotas_status,
      then: Yup.string()
        .required(intl.formatMessage({ id: 'errors.required.enotas' }))
        .min(4, intl.formatMessage({ id: 'errors.min' }, { min: 4 })),
      otherwise: Yup.string(),
    }),
    // special_taxation_regime: Yup.string().when('integrations', {
    //   is: (integrations) => integrations?.enotas_status,
    //   then: Yup.string().required(
    //     intl.formatMessage({ id: 'errors.required.enotas' })
    //   ),
    //   otherwise: Yup.string(),
    // }),
    simples_nacional: Yup.string().when('integrations', {
      is: (integrations) => integrations?.enotas_status,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required.enotas' })
      ),
      otherwise: Yup.string().nullable(),
    }),
    email: Yup.string().when('integrations', {
      is: (integrations) => integrations?.asaas_status,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required.asaas' })
      ),
      otherwise: Yup.string(),
    }),
    monthly_revenue: Yup.number().when('integrations', {
      is: (integrations) => integrations?.asaas_status,
      then: Yup.number()
        .positive(intl.formatMessage({ id: 'errors.positive' }))
        .required(intl.formatMessage({ id: 'errors.required' })),
      otherwise: Yup.number(),
    }),
    address: Yup.array().when('integrations', {
      is: (integrations) =>
        integrations?.enotas_status || integrations?.asaas_status,
      then: Yup.array().of(
        Yup.object().shape({
          postal_code: Yup.string().required(
            intl.formatMessage({ id: 'errors.required.enotas_or_asaas' })
          ),
          street: Yup.string().required(
            intl.formatMessage({ id: 'errors.required.enotas_or_asaas' })
          ),
          number: Yup.string().required(
            intl.formatMessage({ id: 'errors.required.enotas_or_asaas' })
          ),
          neighborhood: Yup.string().required(
            intl.formatMessage({ id: 'errors.required.enotas_or_asaas' })
          ),
          state_id: Yup.number().required(
            intl.formatMessage({ id: 'errors.required.enotas_or_asaas' })
          ),
          city_id: Yup.number().required(
            intl.formatMessage({ id: 'errors.required.enotas' })
          ),
          country_id: Yup.number().required(
            intl.formatMessage({ id: 'errors.required.enotas' })
          ),
        })
      ),
      otherwise: Yup.array().of(
        Yup.object().shape({
          postal_code: Yup.string(),
          street: Yup.string(),
          number: Yup.string(),
          neighborhood: Yup.string(),
          state: Yup.string(),
          city: Yup.string(),
          country: Yup.string(),
        })
      ),
    }),
    municipal_service: Yup.string().when('integrations', {
      is: (integrations) => integrations?.enotas_status,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required.enotas' })
      ),
      otherwise: Yup.string(),
    }),
    aliquot: Yup.string().when('integrations', {
      is: (integrations) => integrations?.enotas_status,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required.enotas' })
      ),
      otherwise: Yup.string(),
    }),
    description_service: Yup.string().when('integrations', {
      is: (integrations) => integrations?.enotas_status,
      then: Yup.string().required(
        intl.formatMessage({ id: 'errors.required.enotas' })
      ),
      otherwise: Yup.string(),
    }),
    // certificate_file: Yup.string().when('integrations', {
    //   is: (integrations) => integrations?.enotas_status,
    //   then: Yup.string().required(
    //     intl.formatMessage({ id: 'errors.required.enotas' })
    //   ),
    //   otherwise: Yup.string(),
    // }),
    // certificate_password: Yup.string().when('integrations', {
    //   is: (integrations) => integrations?.enotas_status,
    //   then: Yup.string().required(
    //     intl.formatMessage({ id: 'errors.required.enotas' })
    //   ),
    //   otherwise: Yup.string(),
    // }),
    // certificate_valid: company.company_certificates?.certificate_valid || '',
    // certificate_name: company.company_certificates?.certificate_name || '',
    // certificate_file: '',
  };

  const validationSchema = Yup.object().shape(validationShape);

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    getAvailablesSpecialTaxationRegime();
  }, [formik.values.address?.[0]?.city_id]);

  if (companyType === 'company' && formik.values.integrations?.hotmart_status) {
    validationShape.address = Yup.array().of(
      Yup.object().shape({
        postal_code: Yup.string()
          .ensure()
          .when('integrations', {
            is: ({ hotmart_status }) => hotmart_status || true,
            then: Yup.string().required(
              intl.formatMessage({ id: 'errors.required' })
            ),
          }),
        // city_id: Yup.string().required(
        //   intl.formatMessage({ id: 'errors.required' })
        // ),
        // state_id: Yup.string().required(
        //   intl.formatMessage({ id: 'errors.required' })
        // ),
        // country_id: Yup.string().required(
        //   intl.formatMessage({ id: 'errors.required' })
        // ),
        // street: Yup.string().required(
        //   intl.formatMessage({ id: 'errors.required' })
        // ),
        // number: Yup.string().required(
        //   intl.formatMessage({ id: 'errors.required' })
        // ),
        // neighborhood: Yup.string().required(
        //   intl.formatMessage({ id: 'errors.required' })
        // ),
      })
    );
  }

  if (companyType === 'company' && formik.values.integrations?.guru_status) {
    validationShape.address = Yup.array().of(
      Yup.object().shape({
        postal_code: Yup.string()
          .ensure()
          .when('integrations', {
            is: ({ guru_status }) => guru_status || true,
            then: Yup.string().required(
              intl.formatMessage({ id: 'errors.required' })
            ),
          }),
      })
    );
  }

  if (companyType === 'company' && formik.values.integrations?.provi_status) {
    validationShape.address = Yup.array().of(
      Yup.object().shape({
        postal_code: Yup.string()
          .ensure()
          .when('integrations', {
            is: ({ provi_status }) => provi_status || true,
            then: Yup.string().required(
              intl.formatMessage({ id: 'errors.required' })
            ),
          }),
      })
    );
  }

  if (companyType === 'company' && formik.values.integrations?.eduzz_status) {
    validationShape.address = Yup.array().of(
      Yup.object().shape({
        postal_code: Yup.string()
          .ensure()
          .when('integrations', {
            is: ({ eduzz_status }) => eduzz_status || true,
            then: Yup.string().required(
              intl.formatMessage({ id: 'errors.required' })
            ),
          }),
      })
    );
  }

  if (companyType === 'company' && formik.values.integrations?.ticto_status) {
    validationShape.address = Yup.array().of(
      Yup.object().shape({
        postal_code: Yup.string()
          .ensure()
          .when('integrations', {
            is: ({ ticto_status }) => ticto_status || true,
            then: Yup.string().required(
              intl.formatMessage({ id: 'errors.required' })
            ),
          }),
      })
    );
  }

  if (companyType === 'company' && formik.values.integrations?.kiwify_status) {
    validationShape.address = Yup.array().of(
      Yup.object().shape({
        postal_code: Yup.string()
          .ensure()
          .when('integrations', {
            is: ({ kiwify_status }) => kiwify_status || true,
            then: Yup.string().required(
              intl.formatMessage({ id: 'errors.required' })
            ),
          }),
      })
    );
  }

  if (companyType === 'company' && formik.values.integrations?.tmb_status) {
    validationShape.address = Yup.array().of(
      Yup.object().shape({
        postal_code: Yup.string()
          .ensure()
          .when('integrations', {
            is: ({ tmb_status }) => tmb_status || true,
            then: Yup.string().required(
              intl.formatMessage({ id: 'errors.required' })
            ),
          }),
      })
    );
  }

  if (companyType === 'company' && formik.values.integrations?.hubla_status) {
    validationShape.address = Yup.array().of(
      Yup.object().shape({
        postal_code: Yup.string()
          .ensure()
          .when('integrations', {
            is: ({ hubla_status }) => hubla_status || true,
            then: Yup.string().required(
              intl.formatMessage({ id: 'errors.required' })
            ),
          }),
      })
    );
  }

  if (companyType === 'company' && formik.values.integrations?.dominio_status) {
    validationShape.address = Yup.array().of(
      Yup.object().shape({
        postal_code: Yup.string()
          .ensure()
          .when('integrations', {
            is: ({ dominio_status }) => dominio_status || true,
            then: Yup.string().required(
              intl.formatMessage({ id: 'errors.required' })
            ),
          }),
      })
    );
  }

  if (companyType === 'company' && formik.values.integrations?.cademi_status) {
    validationShape.address = Yup.array().of(
      Yup.object().shape({
        postal_code: Yup.string()
          .ensure()
          .when('integrations', {
            is: ({ cademi_status }) => cademi_status || true,
            then: Yup.string().required(
              intl.formatMessage({ id: 'errors.required' })
            ),
          }),
      })
    );
  }

  return (
    <PermissionGate permissions={permissionForm}>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
              {companyId && (
                <IuliPlanInfo dateExpiryAt={company.date_expiry_at} />
              )}
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.scrollTo(0, 0);
                  console.log({ formik });
                  console.log(formik.errors);
                  formik.handleSubmit(e);
                }}
              >
                <CompanyInfoForm
                  company={company}
                  companyType={companyType}
                  formik={formik}
                  availablesSpecialTaxationRegime={
                    availablesSpecialTaxationRegime
                  }
                />
                {companyId && (
                  <>
                    <CompanyContactsForm company={company} formik={formik} />
                    <CompanyAddressForm
                      company={company}
                      formik={formik}
                      addressRequired={companyType === 'company'}
                    />
                    {Boolean(companyType === 'company' && companyId) && (
                      <>
                        <CompanyAsaas formik={formik} />
                        <CompanyHotmart formik={formik} />
                        <CompanyGuru formik={formik} />
                        <CompanyProvi formik={formik} />
                        <CompanyEduzz formik={formik} />
                        <CompanyTicto formik={formik} />
                        <CompanyKiwify formik={formik} />
                        <CompanyTmb formik={formik} />
                        <CompanyHubla formik={formik} />
                        <CompanyCademi formik={formik} />
                        {formik.values.person_type === 1 && (
                          <CompanyEnotas formik={formik} />
                        )}
                        {formik.values.person_type === 1 && (
                          <CompanyDominio formik={formik} />
                        )}
                      </>
                    )}
                  </>
                )}
                <PermissionGate permissions={permissionButton}>
                  <Col
                    className="d-flex justify-content-end flex-wrap"
                    md="12"
                    sm="12"
                  >
                    <Button.Ripple
                      className="mt-1"
                      color="primary"
                      // disabled={!(formik.isValid && formik.dirty)}
                    >
                      <FormattedMessage type="submit" id="button.save" />
                    </Button.Ripple>
                  </Col>
                </PermissionGate>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </PermissionGate>
  );
};

CompanyForm.propTypes = {
  companyType: PropTypes.string.isRequired,
  formSubmit: PropTypes.func.isRequired,
  company: PropTypes.shape.isRequired,
  companyId: PropTypes.number.isRequired,
};

CompanyForm.defaultProps = {};

export default CompanyForm;
