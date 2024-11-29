import React from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Card, CardBody, Row, Col } from 'reactstrap';
import IuliPlanForm from './IuliPaymentForm';
import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import PermissionGate from '../../../../PermissionGate';

const IuliPaymentEdit = () => {
  const intl = useIntl();
  const { iuli_payment_id } = useParams();

  return (
    <>
      <PermissionGate permissions="isIuliAdmin">
        <Row>
          <Col sm="12">
            <Breadcrumbs
              breadCrumbTitle={
                iuli_payment_id
                  ? `${iuli_payment_id}`
                  : intl.formatMessage({ id: 'button.create.iuli_payment' })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({ id: 'button.list.iuli_payment' }),
                  link: '/admin/iuli-payment/list',
                },
              ]}
              breadCrumbActive={
                iuli_payment_id
                  ? intl.formatMessage({ id: 'button.edit.iuli_payment' })
                  : intl.formatMessage({ id: 'button.create.iuli_payment' })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody className="pt-2">
                <IuliPlanForm />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </PermissionGate>
    </>
  );
};
export default IuliPaymentEdit;
