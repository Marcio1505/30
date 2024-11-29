import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { useIntl } from "react-intl"
import {
  Card,
  CardBody,
  Row,
  Col,
  Button
} from "reactstrap";
import PermissionUserForm from "./PermissionUserForm"
import "../../../../assets/scss/pages/users.scss"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb";

const PermissionUserEdit = () => {
  const history = useHistory();
  const intl = useIntl();
  const { permission_id  } = useParams()
  return (
    <>
      <Row>
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle={permission_id  ? `${permission_id }` : intl.formatMessage({id:"button.create.permission_user"})}
            breadCrumbParents={[
                {
                    name: intl.formatMessage({id:"button.list.permission_user"}),
                    link: '/admin/permission-user/list'
                }
            ]}
            breadCrumbActive={permission_id  ? intl.formatMessage({id:"button.edit.permission_user"}) : intl.formatMessage({id:"button.create.permission_user"})}
          />
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
              <PermissionUserForm />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default PermissionUserEdit
