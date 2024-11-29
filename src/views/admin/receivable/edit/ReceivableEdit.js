import React from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Row, Col } from 'reactstrap';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import TransactionEdit from '../../transactions/edit/TransactionEdit';
import '../../../../assets/scss/pages/users.scss';

import PermissionGate from '../../../../PermissionGate';

const ReceivableEdit = () => {
  const { transaction_id } = useParams();
  const intl = useIntl();

  let permissionForm = '';
  if (transaction_id) {
    permissionForm = 'receivables.show';
  } else {
    permissionForm = 'companies.receivables.store';
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
                  : intl.formatMessage({ id: 'button.create.receivable' })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({ id: 'button.list.receivable' }),
                  link: '/admin/receivable/list',
                },
              ]}
              breadCrumbActive={
                transaction_id
                  ? intl.formatMessage({ id: 'button.edit.receivable' })
                  : intl.formatMessage({ id: 'button.create.receivable' })
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
                  transactionType="receivable"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </PermissionGate>
    </>
  );
};

export default ReceivableEdit;
