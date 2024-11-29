import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import { store } from '../../../redux/storeConfig/store';
import { applicationActions } from '../../../new.redux/actions';

import { history } from '../../../history';
import { confirmEmail } from '../../../services/apis/auth.api';

const ConfirmAccount = () => {
  const { document, confirm_email_token } = useParams();
  const confirmEmailAccount = async () => {
    const respConfirmEmail = await confirmEmail({
      document,
      confirm_email_token,
    });
    history.push('/login');
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: respConfirmEmail?.message,
        hasTimeout: true,
      })
    );
  };

  useEffect(() => {
    confirmEmailAccount();
  }, []);

  return (
    <Container className="container-max-width-register">
      <Row>
        <Col>...</Col>
      </Row>
    </Container>
  );
};

export default ConfirmAccount;
