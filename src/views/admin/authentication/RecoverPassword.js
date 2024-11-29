import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { recoverPassword } from '../../../services/apis/auth.api';

const RecoverPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const intl = useIntl();

  const onSubmit = async (values) => {
    const resp = await recoverPassword({ data: values });
    if (resp?.user?.email) {
      setEmailSent(true);
    }
  };

  const initialValues = {
    document: '',
  };

  const validationSchema = Yup.object().shape({
    document: CustomValidators.cpf.required(
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
                  {emailSent ? (
                    <>
                      <h5 className="mb-2 px-md-2">
                        Foi enviado um link de recuperação de senha para o
                        e-mail associado à sua conta
                      </h5>
                      <Link to="/login">Ir para Login</Link>
                    </>
                  ) : (
                    <h5 className="mb-0 px-md-2">
                      Informe seu CPF para recuperar sua senha
                    </h5>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col sm="12" md="12" className="px-2 px-md-5">
          <div className="pt-1">
            {Boolean(!emailSent) && (
              <Form onSubmit={formik.handleSubmit} className="h-100">
                <TextField
                  required
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
                    Recuperar Senha
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

export default RecoverPassword;
