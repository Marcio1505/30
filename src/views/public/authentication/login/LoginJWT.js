import React from 'react';
import { Link } from 'react-router-dom';
import { CardBody, FormGroup, Form, Input, Button, Label } from 'reactstrap';
import { Mail, Lock, Check } from 'react-feather';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { login } from '../../../../redux/actions/auth/loginActions';
import { history } from '../../../../history';

class LoginJWT extends React.Component {
  state = {
    email: 'demo@demo.com',
    cpf: '266.674.902-94',
    password: 'demodemo',
    remember: false,
  };

  handleLogin = (e) => {
    e.preventDefault();
    this.props.login(this.state);
  };

  render() {
    return (
      <>
        <CardBody className="pt-1">
          <Form action="/" onSubmit={this.handleLogin}>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="text"
                placeholder="CPF"
                value={this.state.cpf}
                onChange={(e) => this.setState({ cpf: e.target.value })}
                required
              />
              <div className="form-control-position">
                <Mail size={15} />
              </div>
              <Label>
                <FormattedMessage id="user.cpf" />
              </Label>
            </FormGroup>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                required
              />
              <div className="form-control-position">
                <Lock size={15} />
              </div>
              <Label>
                <FormattedMessage id="user.password" />
              </Label>
            </FormGroup>
            <FormGroup className="d-flex justify-content-between align-items-center">
              <div className="float-right">
                <Link to="/forgot-password">
                  <FormattedMessage id="forgotPassword" />
                </Link>
              </div>
            </FormGroup>
            <div className="d-flex justify-content-between">
              <Button.Ripple
                color="primary"
                outline
                onClick={() => {
                  history.push('/register');
                }}
              >
                <FormattedMessage id="register" />
              </Button.Ripple>
              <Button.Ripple color="primary" type="submit">
                <FormattedMessage id="login" />
              </Button.Ripple>
            </div>
          </Form>
        </CardBody>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  values: state.auth.login,
});
export default connect(mapStateToProps, { login })(LoginJWT);
