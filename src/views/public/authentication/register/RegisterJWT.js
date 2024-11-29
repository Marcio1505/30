import React from 'react';
import { CardBody, FormGroup, Form, Input, Button, Label } from 'reactstrap';
import { Check } from 'react-feather';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Checkbox from '../../../../components/@vuexy/checkbox/CheckboxesVuexy';
import { signup } from '../../../../redux/actions/auth/registerActions';
import { history } from '../../../../history';

class Register extends React.Component {
  state = {
    email: '',
    name: '',
    cpf: '',
    password: '',
    confirmPass: '',
  };

  handleRegister = (e) => {
    e.preventDefault();
    this.props.signup(
      this.state.name,
      this.state.cpf,
      this.state.email,
      this.state.password
    );
  };

  render() {
    return (
      <>
        <CardBody className="pt-1">
          <Form action="/" onSubmit={this.handleRegister}>
            <FormGroup className="form-label-group">
              <Input
                type="text"
                placeholder="nome"
                required
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
              <Label>
                <FormattedMessage id="user.name" />
              </Label>
            </FormGroup>
            <FormGroup className="form-label-group">
              <Input
                type="email"
                placeholder="email"
                required
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
              <Label>
                <FormattedMessage id="user.email" />
              </Label>
            </FormGroup>
            <FormGroup className="form-label-group">
              <Input
                type="text"
                placeholder="cpf"
                required
                value={this.state.cpf}
                onChange={(e) => this.setState({ cpf: e.target.cpf })}
              />
              <Label>
                <FormattedMessage id="user.cpf" />
              </Label>
            </FormGroup>
            <FormGroup className="form-label-group">
              <Input
                type="password"
                placeholder="senha"
                required
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
              />
              <Label>
                <FormattedMessage id="user.password" />
              </Label>
            </FormGroup>
            <FormGroup className="form-label-group">
              <Input
                type="password"
                placeholder="confirmar senha"
                required
                value={this.state.confirmPass}
                onChange={(e) => this.setState({ confirmPass: e.target.value })}
              />
              <Label>
                <FormattedMessage id="user.confPassword" />
              </Label>
            </FormGroup>
            <FormGroup>
              <Checkbox
                color="primary"
                icon={<Check className="vx-icon" size={16} />}
                label={<FormattedMessage id="user.acceptTerms" />}
                defaultChecked
              />
            </FormGroup>
            <div className="d-flex justify-content-between">
              <Button.Ripple
                color="primary"
                outline
                onClick={() => {
                  history.push('/login');
                }}
              >
                <FormattedMessage id="goBack" />
              </Button.Ripple>
              <Button.Ripple color="primary" type="submit">
                <FormattedMessage id="register" />
              </Button.Ripple>
            </div>
          </Form>
        </CardBody>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  values: state.auth.register,
});
export default connect(mapStateToProps, { signup })(Register);
