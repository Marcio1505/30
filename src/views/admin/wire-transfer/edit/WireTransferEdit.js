import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardBody, Row, Col } from 'reactstrap';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import TransferForm from './WireTransferForm';
import '../../../../assets/scss/pages/users.scss';

import PermissionGate from '../../../../PermissionGate';

const TransferEdit = () => {
  const intl = useIntl();
  return (
    <>
    <PermissionGate permissions="api.bank_account.current_balance">
      <Row>
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle={intl.formatMessage({
              id: 'button.create.wire-transfer',
            })}
            breadCrumbParents={[
              {
                name: intl.formatMessage({ id: 'button.list.bank_account' }),
                link: '/admin/bank-account/list',
              },
            ]}
            breadCrumbActive={intl.formatMessage({
              id: 'button.create.wire-transfer',
            })}
          />
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
              <TransferForm />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </PermissionGate>
    </>
  );
};
export default TransferEdit;
