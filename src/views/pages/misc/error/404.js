import React from 'react';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import errorImg from '../../../../assets/img/pages/404.png';

class Error404 extends React.Component {
  render() {
    return (
      <Row className="m-0">
        <Col sm="12">
          <Card className="auth-card bg-transparent shadow-none rounded-0 mb-0 w-100">
            <CardBody className="text-center">
              {/* <img
                src={errorImg}
                alt="ErrorImg"
                className="img-fluid align-self-center"
              /> */}
              <h1 className="font-large-2 my-1">
                <FormattedMessage id="page_404.title" />
              </h1>
              {/* <p className="pt-2 mb-0">
                <FormattedMessage id="page_404.text" />
              </p> */}
              <Button.Ripple
                tag="a"
                href="/"
                color="primary"
                size="lg"
                className="mt-2"
              >
                <FormattedMessage id="page_404.button.title" />
              </Button.Ripple>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default Error404;
