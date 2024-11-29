import React from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Card, CardBody, Row, Col } from 'reactstrap';
import ProjectForm from './ProjectForm';
import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import PermissionGate from '../../../../PermissionGate';

const ProjectEdit = () => {
  const intl = useIntl();
  const { project_id } = useParams();

  let permissionForm = 'companies.projects.store';
  if (project_id) {
    permissionForm = 'projects.show';
  }

  return (
    <>
      <PermissionGate permissions={permissionForm}>
        <Row>
          <Col sm="12">
            <Breadcrumbs
              breadCrumbTitle={
                project_id
                  ? `${project_id}`
                  : intl.formatMessage({ id: 'button.create.project' })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({ id: 'button.list.project' }),
                  link: '/admin/project/list',
                },
              ]}
              breadCrumbActive={
                project_id
                  ? intl.formatMessage({ id: 'button.edit.project' })
                  : intl.formatMessage({ id: 'button.create.project' })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody className="pt-2">
                <ProjectForm />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </PermissionGate>
    </>
  );
};

export default ProjectEdit;
