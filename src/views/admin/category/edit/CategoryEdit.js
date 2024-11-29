import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import CostCenterForm from './CategoryForm';
import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

const CostCenterEdit = () => {
  const history = useHistory();
  const intl = useIntl();
  const { cost_center_id } = useParams();
  return (
    <>
      <Row>
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle={
              cost_center_id
                ? `${cost_center_id}`
                : intl.formatMessage({ id: 'button.create.cost_center' })
            }
            breadCrumbParents={[
              {
                name: intl.formatMessage({ id: 'button.list.cost_center' }),
                link: '/admin/cost-center/list',
              },
            ]}
            breadCrumbActive={
              cost_center_id
                ? intl.formatMessage({ id: 'button.edit.cost_center' })
                : intl.formatMessage({ id: 'button.create.cost_center' })
            }
          />
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
              <CostCenterForm />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default CostCenterEdit;
