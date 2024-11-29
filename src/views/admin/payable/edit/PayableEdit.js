import React from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Row, Col } from 'reactstrap';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import TransactionEdit from '../../transactions/edit/TransactionEdit';
import '../../../../assets/scss/pages/users.scss';

import PermissionGate from "../../../../PermissionGate";

const PayableEdit = () => {
  const { transaction_id } = useParams();
  const intl = useIntl();

  let permissionForm = '';
  if(transaction_id)
  {
    permissionForm = 'payables.show';
  }
  else
  {
    permissionForm = 'companies.payables.store';
  }

  return (
    <>
      <PermissionGate permissions={permissionForm}>
        <Row>
          <Col sm="12">
            <Breadcrumbs
              breadCrumbTitle={
                transaction_id
                  ? `${transaction_id}`
                  : intl.formatMessage({ id: 'button.create.payable' })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({ id: 'button.list.payable' }),
                  link: '/admin/payable/list',
                },
              ]}
              breadCrumbActive={
                transaction_id
                  ? intl.formatMessage({ id: 'button.edit.payable' })
                  : intl.formatMessage({ id: 'button.create.payable' })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody className="pt-2">
                <TransactionEdit
                  transactionId={transaction_id}
                  transactionType="payable"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </PermissionGate>
    </>
  );
};

export default PayableEdit;
