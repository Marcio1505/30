import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Form, Button, Row, Col } from 'reactstrap';
import { Check } from 'react-feather';
import Checkbox from '../../../components/@vuexy/checkbox/CheckboxesVuexy';

import '../../../assets/scss/pages/authentication.scss';
import LogoIuli from '../../../assets/img/logo/iuli-logo.png';

import {
  formatCpf,
  formatMobilePhone,
  getOnlyNumbers,
} from '../../../utils/formaters';
import CustomValidators from '../../../utils/customValidators';
import { history } from '../../../history';

import TextField from '../../../components/inputs/TextField';
import { authRegister } from '../../../services/apis/auth.api';

const LabelTermsAndConditions = () => (
  <>
    Concordo com os
    <Link to="/terms-and-conditions"> Termos e Condições</Link>
  </>
);

const helperPassword = (
  <>
    Senha precisa conter:
    <ul>
      <li>no mínimo 8 caracteres</li>
      <li>pelo menos uma letra maiúscula</li>
      <li>pelo menos uma letra minúscula</li>
      <li>pelo menos um número</li>
      <li>pelo menos um caracter especial (!, @, #, $, %, &, *)</li>
    </ul>
  </>
);

const Register = () => {
  const [userCreated, setUserCreated] = useState(false);
  const intl = useIntl();

  const onSubmit = async (values) => {
    const resp = await authRegister({ data: values });
    if (resp?.status === 204) {
      setUserCreated(true);
    }
  };

  const initialValues = {
    name: '',
    email: '',
    mobile_phone: '',
    document: '',
    password: '',
    password_confirmation: '',
    agreeWithTermsAndConditions: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    email: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    mobile_phone: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    document: CustomValidators.cpf.required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    password: Yup.string()
      .required(intl.formatMessage({ id: 'errors.required' }))
      .min(8, intl.formatMessage({ id: 'errors.min' }, { min: 8 }))
      .matches(
        /^(?=.*[a-z])/,
        'Senha precisa conter pelo menos uma letra minúscula'
      )
      .matches(
        /^(?=.*[A-Z])/,
        'Senha precisa conter pelo menos uma letra maiúscula'
      )
      .matches(/^(?=.*[0-9])/, 'Senha precisa conter pelo menos um número')
      .matches(
        /^(?=.*[!@#\$%\^&\*])/,
        'Senha precisa conter pelo menos um caracter especial'
      ),
    password_confirmation: Yup.string()
      .required(intl.formatMessage({ id: 'errors.required' }))
      .oneOf(
        [Yup.ref('password')],
        'Senha e Confirmação de Senha não conferem'
      ),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <Container className="container-max-width-register">
      <Row className="m-0 justify-content-center align-items-center py-4 content-box">
        <Col
          sm="12"
          md="12"
          className="px-2 px-md-5 mb-2 mb-md-0 col-sm-0 col-md-6"
        >
          <Row className="m-0">
            <Col md="12" className="p-0">
              <div className="content-image w-100 text-center">
                <img
                  src={LogoIuli}
                  alt="iuli-logo"
                  className="logo-iuli ml-0"
                />
              </div>
              <div className="pb-1">
                <div className="text-center">
                  {userCreated ? (
                    <>
                      <h5 className="mb-2">Dados registrados com sucesso.</h5>
                      <h5>
                        Enviamos um <b>e-mail</b> para você{' '}
                        <b>confirmar o cadastro</b>.
                      </h5>
                    </>
                  ) : (
                    <h5 className="mb-0">
                      Preencha os dados para efetuar o seu cadastro
                    </h5>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col sm="12" md="12" className="px-2 px-md-5">
          <div className="pt-1">
            {Boolean(!userCreated) && (
              <Form onSubmit={formik.handleSubmit} className="h-100">
                <TextField
                  id="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  placeholder={intl.formatMessage({ id: 'user.name' })}
                  label={intl.formatMessage({ id: 'user.name' })}
                  error={formik.touched.name && formik.errors.name}
                />
                <TextField
                  id="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  placeholder={intl.formatMessage({ id: 'user.email' })}
                  label={intl.formatMessage({ id: 'user.email' })}
                  error={formik.touched.email && formik.errors.email}
                />
                <TextField
                  id="mobile_phone"
                  onBlur={formik.handleBlur}
                  value={formatMobilePhone(formik.values.mobile_phone)}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'mobile_phone',
                      getOnlyNumbers(e.target.value)
                    )
                  }
                  placeholder={intl.formatMessage({ id: 'user.mobile_phone' })}
                  label={intl.formatMessage({ id: 'user.mobile_phone' })}
                  error={
                    formik.touched.mobile_phone && formik.errors.mobile_phone
                  }
                />
                <TextField
                  id="document"
                  onBlur={formik.handleBlur}
                  value={formatCpf(formik.values.document)}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'document',
                      getOnlyNumbers(e.target.value)
                    )
                  }
                  placeholder={intl.formatMessage({ id: 'user.cpf' })}
                  label={intl.formatMessage({ id: 'user.cpf' })}
                  error={formik.touched.document && formik.errors.document}
                />
                <TextField
                  id="password"
                  type="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  placeholder={intl.formatMessage({
                    id: 'user.password',
                  })}
                  label={intl.formatMessage({ id: 'user.password' })}
                  error={formik.touched.password && formik.errors.password}
                  warning={helperPassword}
                />
                <TextField
                  id="password_confirmation"
                  type="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password_confirmation}
                  placeholder={intl.formatMessage({
                    id: 'user.password_confirmation',
                  })}
                  label={intl.formatMessage({
                    id: 'user.password_confirmation',
                  })}
                  error={
                    formik.touched.password_confirmation &&
                    formik.errors.password_confirmation
                  }
                />
                <div className="d-flex justify-content-start align-items-center">
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    label={<LabelTermsAndConditions />}
                    defaultChecked={false}
                    onChange={(e) => {
                      formik.setFieldValue(
                        'remember',
                        formik.values.agreeWithTermsAndConditions
                      );
                      return false;
                    }}
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Button.Ripple
                    color="primary"
                    outline
                    onClick={() => {
                      history.push('/login');
                    }}
                  >
                    Voltar
                  </Button.Ripple>
                  <Button.Ripple color="primary" type="submit">
                    Criar Conta
                  </Button.Ripple>
                </div>
              </Form>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
