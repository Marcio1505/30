import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Container, Form, Button, Row, Col } from 'reactstrap';

import '../../../assets/scss/pages/authentication.scss';
import LogoIuli from '../../../assets/img/logo/iuli-logo.png';

import { formatCpf, getOnlyNumbers } from '../../../utils/formaters';
import CustomValidators from '../../../utils/customValidators';
import { history } from '../../../history';

import TextField from '../../../components/inputs/TextField';
import { login } from '../../../redux/actions/auth/loginActions';

const Login = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    dispatch(login(values));
  };

  const initialValues = {
    document: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    document: CustomValidators.document.required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    password: Yup.string()
      .required(intl.formatMessage({ id: 'errors.required' }))
      .min(6, intl.formatMessage({ id: 'errors.min' }, { min: 6 })),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <Container className="container-max-width-login">
      <Row className="m-0 justify-content-center align-items-center py-4 content-box">
        <Col
          sm="0"
          md="6"
          className="px-2 px-md-4 mb-2 mb-md-0 col-sm-0 col-md-6"
        >
          <Row className="m-0">
            <Col md="12" className="p-0">
              <div className="content-image w-100 text-center text-md-left">
                <img src={LogoIuli} alt="iuli-logo" className="logo-iuli" />
              </div>
              <div className="pb-1">
                <div className="text-center text-md-left">
                  <h4 className="mb-2">Bem-vindo(a)!</h4>
                  <h5 className="mb-0">
                    Efetue o login para acessar sua conta
                  </h5>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col sm="12" md="6" className="px-2">
          <div className="pt-1">
            <Form onSubmit={formik.handleSubmit} className="h-100">
              <TextField
                id="document"
                required
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
                id="password"
                type="password"
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                onChange={(e) =>
                  formik.setFieldValue('password', e.target.value)
                }
                placeholder={intl.formatMessage({
                  id: 'user.password',
                })}
                label={intl.formatMessage({ id: 'user.password' })}
                error={formik.touched.password && formik.errors.password}
              />
              {/* <FormGroup className="d-flex justify-content-between align-items-center">
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="Remember me"
                  defaultChecked={false}
                  onChange={this.handleRemember}
                />
                <div className="float-right">
                  <Link to="/recover-password">Forgot Password?</Link>
                </div>
              </FormGroup> */}
              <div className="d-flex justify-content-end align-items-center mb-1">
                <Link to="/recover-password">Esqueci minha senha</Link>
              </div>
              <div className="d-flex justify-content-end align-items-center">
                <Link to="/resend-confirmation-email">
                  Reenviar email confirmação
                </Link>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button.Ripple
                  color="primary"
                  outline
                  onClick={() => {
                    history.push('/register');
                  }}
                >
                  Criar Conta
                </Button.Ripple>
                <Button.Ripple color="primary" type="submit">
                  Login
                </Button.Ripple>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default Login;
