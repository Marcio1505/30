import React from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Card, CardBody, Row, Col } from 'reactstrap';
import CompanyUserForm from './CompanyUserForm';
import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import PermissionGate from '../../../../PermissionGate';

const CompanyUserEdit = () => {
  const intl = useIntl();
  const { company_user_id } = useParams();

  let permission = 'permissions-users-companies.store';
  if (company_user_id) {
    permission = 'permissions-users-companies.show';
  }

  return (
    <>
      <PermissionGate permissions={permission}>
        <Row>
          <Col sm="12">
            <Breadcrumbs
              breadCrumbTitle={
                company_user_id
                  ? `${company_user_id}`
                  : intl.formatMessage({ id: 'button.create.company_user' })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({ id: 'button.list.company_user' }),
                  link: '/admin/company-user/list',
                },
              ]}
              breadCrumbActive={
                company_user_id
                  ? intl.formatMessage({ id: 'button.edit.company_user' })
                  : intl.formatMessage({ id: 'button.create.company_user' })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody className="pt-2">
                <CompanyUserForm />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </PermissionGate>
    </>
  );
};

export default CompanyUserEdit;
