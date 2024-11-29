import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
} from "reactstrap"
import RegisterJWT from "./RegisterJWT"
import registerImg from "../../../../assets/img/pages/register.jpg"
import "../../../../assets/scss/pages/authentication.scss"
import { FormattedMessage } from "react-intl"

class Register extends React.Component {
  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-1 py-0"
              >
                <img className="mr-1" src={registerImg} alt="registerImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 p-2">
                  <CardHeader className="pb-1 pt-50">
                    <CardTitle>
                      <h4 className="mb-0">
                        <FormattedMessage id="register.title"/>
                      </h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title mb-0">
                    <FormattedMessage id="register.message"/>
                  </p>
                  <RegisterJWT />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }
}
export default Register
