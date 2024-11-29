import React from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Form, Button, Row, Col } from 'reactstrap';

import '../../../assets/scss/pages/authentication.scss';
import LogoIuli from '../../../assets/img/logo/iuli-logo.png';

import { formatCpf, getOnlyNumbers } from '../../../utils/formaters';
import CustomValidators from '../../../utils/customValidators';
import { history } from '../../../history';

import TextField from '../../../components/inputs/TextField';

import { resetPassword } from '../../../services/apis/auth.api';

import { store } from '../../../redux/storeConfig/store';
import { applicationActions } from '../../../new.redux/actions';

const ResetPassword = () => {
  const intl = useIntl();
  const { document, recover_password_token } = useParams();

  const onSubmit = async (values) => {
    const resp = await resetPassword({ data: values });
    if (resp?.user?.email) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Senha modificada com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/login');
    }
  };

  const initialValues = {
    document,
    recover_password_token,
    password: '',
    password_confirmation: '',
  };

  const validationSchema = Yup.object().shape({
    document: CustomValidators.cpf.required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    recover_password_token: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    password: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    password_confirmation: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
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
                  {/* <h4 className="mb-2"></h4> */}
                  <h5 className="mb-0 px-md-2">
                    Informe nos campos abaixo a nova senha
                  </h5>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col sm="12" md="12" className="px-2 px-md-5">
          <div className="pt-1">
            <Form onSubmit={formik.handleSubmit} className="h-100">
              <TextField
                required
                readOnly
                id="document"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
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
                required
                type="password"
                id="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                onChange={(e) =>
                  formik.setFieldValue('password', e.target.value)
                }
                placeholder={intl.formatMessage({ id: 'user.password' })}
                label={intl.formatMessage({ id: 'user.password' })}
                error={formik.touched.password && formik.errors.password}
              />
              <TextField
                required
                type="password"
                id="password_confirmation"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password_confirmation}
                onChange={(e) =>
                  formik.setFieldValue('password_confirmation', e.target.value)
                }
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
                  Salvar Nova Senha
                </Button.Ripple>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
