import React from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Card, CardBody, Row, Col } from 'reactstrap';
import IuliPlanForm from './IuliPlanForm';
import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import PermissionGate from '../../../../PermissionGate';

const IuliPlanEdit = () => {
  const intl = useIntl();
  const { iuli_plan_id } = useParams();

  return (
    <>
      <PermissionGate permissions="isIuliAdmin">
        <Row>
          <Col sm="12">
            <Breadcrumbs
              breadCrumbTitle={
                iuli_plan_id
                  ? `${iuli_plan_id}`
                  : intl.formatMessage({ id: 'button.create.iuli_plan' })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({ id: 'button.list.iuli_plan' }),
                  link: '/admin/iuli-plan/list',
                },
              ]}
              breadCrumbActive={
                iuli_plan_id
                  ? intl.formatMessage({ id: 'button.edit.iuli_plan' })
                  : intl.formatMessage({ id: 'button.create.iuli_plan' })
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
export default IuliPlanEdit;
