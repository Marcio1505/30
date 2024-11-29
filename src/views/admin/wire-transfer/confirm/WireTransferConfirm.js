import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import { history } from '../../../../history';
import { confirmWireTransfer } from '../../../../services/apis/wire_transfers.api';

const ConfirmAccount = () => {
  const { wire_transfer_id, token } = useParams();
  const handleConfirmWireTransfer = async () => {
    const respConfirmWireTransfer = await confirmWireTransfer({
      wire_transfer_id,
      token,
    });
    history.push('/');
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: 'Transferência realizada com sucesso',
        hasTimeout: true,
      })
    );
  };

  useEffect(() => {
    handleConfirmWireTransfer();
  }, []);

  return (
    <Container className="container-max-width-register">
      <Row>
        <Col />
      </Row>
    </Container>
  );
};

export default ConfirmAccount;
