import React from 'react';
import { Button, Navbar, NavItem, NavLink } from 'reactstrap';
import * as Icon from 'react-feather';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { logout } from '../../../redux/actions/auth/loginActions';
import NavbarCompanies from './NavbarCompanies';
import NavbarUser from './NavbarUser';
import userImg from '../../../assets/img/admin/user-default.png';

const ThemeNavbar = (props) => {
  const colorsArr = ['primary', 'danger', 'success', 'info', 'warning', 'dark'];
  const navbarTypes = ['floating', 'static', 'sticky', 'hidden'];

  return (
    <>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar
        className={classnames(
          'header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow',
          {
            'navbar-light':
              props.navbarColor === 'default' ||
              !colorsArr.includes(props.navbarColor),
            'navbar-dark': colorsArr.includes(props.navbarColor),
            'bg-primary':
              (props.navbarColor === 'primary' &&
                props.navbarType !== 'static') ||
              process.env.REACT_APP_ENV === 'hmg',
            'bg-danger':
              props.navbarColor === 'danger' && props.navbarType !== 'static',
            'bg-success':
              props.navbarColor === 'success' && props.navbarType !== 'static',
            'bg-info':
              props.navbarColor === 'info' && props.navbarType !== 'static',
            'bg-warning':
              props.navbarColor === 'warning' && props.navbarType !== 'static',
            'bg-dark':
              props.navbarColor === 'dark' && props.navbarType !== 'static',
            'd-none': props.navbarType === 'hidden' && !props.horizontal,
            'floating-nav':
              (props.navbarType === 'floating' && !props.horizontal) ||
              (!navbarTypes.includes(props.navbarType) && !props.horizontal),
            'navbar-static-top':
              props.navbarType === 'static' && !props.horizontal,
            'fixed-top': props.navbarType === 'sticky' || props.horizontal,
            scrolling: props.horizontal && props.scrolling,
          }
        )}
      >
        <div className="navbar-wrapper">
          <div className="navbar-container content">
            <div
              className="navbar-collapse d-flex justify-content-between align-items-center"
              id="navbar-mobile"
            >
              <div className="bookmark-wrapper">
                <div
                  className="float-left bookmark-wrapper d-flex align-items-center"
                  style={{ marginTop: '10px', marginRight: '10px' }}
                >
                  <ul className="navbar-nav d-xl-none">
                    <NavItem className="mobile-menu mr-auto">
                      <NavLink
                        className="nav-menu-main menu-toggle hidden-xs is-active"
                        onClick={props.sidebarVisibility}
                      >
                        <Icon.Menu className="ficon" />
                      </NavLink>
                    </NavItem>
                  </ul>
                </div>
                <NavbarCompanies />
              </div>
              {props.horizontal ? (
                <div className="logo d-flex align-items-center">
                  <div className="brand-logo mr-50" />
                  <h2 className="text-primary brand-text mb-0">iuli</h2>
                </div>
              ) : null}
              <div className="d-none d-lg-block">
                <Button.Ripple
                  color="warning"
                  onClick={() =>
                    window.open(
                      'https://go.iuli.com.br/cadastro/indique',
                      '_blank'
                    )
                  }
                  className="btn-icon full-screen float-right px-4"
                >
                  Indique e Ganhe!
                </Button.Ripple>
              </div>
              <NavbarUser
                handleAppOverlay={props.handleAppOverlay}
                changeCurrentLang={props.changeCurrentLang}
                userName={
                  props.user?.login?.values?.loggedInUser?.name ||
                  'Consultor Par'
                }
                userImg={props.user.login.values?.photoUrl || userImg}
                logout={props.logout}
              />
            </div>
          </div>
        </div>
      </Navbar>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth,
});

export default connect(mapStateToProps, {
  logout,
})(ThemeNavbar);
