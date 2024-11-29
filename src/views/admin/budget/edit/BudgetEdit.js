import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import BudgetForm from './BudgetForm';
import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import PermissionGate from "../../../../PermissionGate";

const BudgetEdit = () => {
  const history = useHistory();
  const intl = useIntl();
  const { budget_id } = useParams();
  
  let permissionForm = '';

  if(budget_id)
  {
    permissionForm = 'budgets.show';
  }
  else
  {
    permissionForm = 'companies.budgets.store';
  }


  return (
    <>
    <PermissionGate permissions={permissionForm}>
      <Row>
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle={
              budget_id
                ? `${budget_id}`
                : intl.formatMessage({ id: 'button.create.budget' })
            }
            breadCrumbParents={[
              {
                name: intl.formatMessage({ id: 'button.list.budget' }),
                link: '/admin/budget/list',
              },
            ]}
            breadCrumbActive={
              budget_id
                ? intl.formatMessage({ id: 'button.edit.budget' })
                : intl.formatMessage({ id: 'button.create.budget' })
            }
          />
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
              <BudgetForm />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </PermissionGate>
    </>
  );
};
export default BudgetEdit;
