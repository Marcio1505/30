
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom-v5-compat';

import { Card, CardBody, Row, Col } from 'reactstrap';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import TransferForm from './TransferForm';

import { showOfxTransaction } from '../../../../services/apis/ofx_transaction.api';

import '../../../../assets/scss/pages/users.scss';

import PermissionGate from "../../../../PermissionGate";

const TransferEdit = () => {
  const intl = useIntl();
  const [initialized, setInitialized] = useState(false);
  const { transfer_id } = useParams();

  const [searchParams] = useSearchParams();
  const ofxTransactionId = searchParams.get('ofxTransactionId');
  const [ofxTransaction, setOfxTransaction] = useState({});
  const [margemOfxTransaction, setMargemOfxTransaction] = useState(0);

  let permissionForm = '';
  if(transfer_id)
  {
    permissionForm = 'transfers.show';
  }
  else
  {
    permissionForm = 'transfers.store';
  }

  const getInitialData = async () => {
    if (ofxTransactionId) {
      setInitialized(false);
      const res = await showOfxTransaction({ id: ofxTransactionId });
      const dataOfxTransaction = res.data;

      setOfxTransaction(dataOfxTransaction);

      //console.log('dataOfxTransaction.margem_value',dataOfxTransaction.margem_value);

      if (dataOfxTransaction.type == 3) {
        setMargemOfxTransaction(dataOfxTransaction.margem_value);
      } else if (dataOfxTransaction.type == 4) {
        setMargemOfxTransaction(dataOfxTransaction.margem_value);
      }

      setInitialized(true);
    } else {
      setOfxTransaction({});
    }
    setInitialized(true);
  }

  useEffect(() => {
    getInitialData();
  }, [ofxTransactionId]);

  return (
    <>
    <PermissionGate permissions={permissionForm}>    
      <Row>
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle={
              transfer_id
                ? intl.formatMessage({ id: 'button.edit.transfer' })
                : intl.formatMessage({ id: 'button.create.transfer' })
            }
            breadCrumbParents={[
              {
                name: intl.formatMessage({ id: 'button.list.transfer' }),
                link: '/admin/transfer/list',
              },
            ]}
            breadCrumbActive={
              transfer_id
                ? intl.formatMessage({ id: 'button.edit.transfer' })
                : intl.formatMessage({ id: 'button.create.transfer' })
            }
          />
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
            {initialized && (
            <TransferForm 
                ofxTransaction={ofxTransaction}
                margemOfxTransaction={margemOfxTransaction}
              />
            )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </PermissionGate>
    </>
  );
};

export default TransferEdit;
