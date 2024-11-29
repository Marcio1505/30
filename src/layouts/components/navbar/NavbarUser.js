import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';

import {
  FaUsersCog,
  FaPlus,
  FaPowerOff,
  FaRandom,
  FaBriefcase,
  FaSitemap,
} from 'react-icons/fa';

import { history } from '../../../history';

import PermissionGate from '../../../PermissionGate';

const handleNavigation = (e, path) => {
  e.preventDefault();
  history.push(path);
};

const NavbarUser = ({ userName, userImg, logout, currentCompany }) => (
  <ul className="nav navbar-nav navbar-nav-user float-right">
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle tag="a" className="nav-link dropdown-user-link">
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name text-bold-600">{userName}</span>
          <span className="user-status">Disponível</span>
        </div>
        <span data-tour="user">
          <img
            src={userImg}
            className="round"
            height="40"
            width="40"
            alt="avatar"
          />
        </span>
      </DropdownToggle>
      <DropdownMenu right>
        {currentCompany && (
          <>
            <PermissionGate permissions="companies.show">
              <DropdownItem
                tag="a"
                href="#"
                onClick={(e) =>
                  handleNavigation(
                    e,
                    `/admin/company/edit/${currentCompany.id}`
                  )
                }
              >
                <FaBriefcase size={14} className="mr-50" />
                <span className="align-middle">Editar Empresa</span>
              </DropdownItem>
            </PermissionGate>
            <PermissionGate permissions="permissions-users-companies.list">
              <DropdownItem
                tag="a"
                href="#"
                onClick={(e) => handleNavigation(e, '/admin/company-user/list')}
              >
                <FaUsersCog size={14} className="mr-50" />
                <span className="align-middle">Gerenciar Usuários</span>
              </DropdownItem>
            </PermissionGate>
            <PermissionGate permissions="reconciliation-rules.list">
              <DropdownItem
                tag="a"
                href="#"
                onClick={(e) =>
                  handleNavigation(e, '/admin/reconciliation-rule/list')
                }
              >
                <FaRandom size={14} className="mr-50" />
                <span className="align-middle">Regras de Conciliação</span>
              </DropdownItem>
            </PermissionGate>
          </>
        )}
        <PermissionGate permissions="categories.tree">
          <DropdownItem
            tag="a"
            href="#"
            onClick={(e) => handleNavigation(e, '/admin/category/list')}
          >
            <FaSitemap size={14} className="mr-50" />
            <span className="align-middle">Gerenciar Categorias</span>
          </DropdownItem>
        </PermissionGate>
        <DropdownItem
          tag="a"
          href="#"
          onClick={(e) => handleNavigation(e, '/admin/company/edit')}
        >
          <FaPlus size={14} className="mr-50" />
          <span className="align-middle">Adicionar Empresa</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem
          tag="a"
          href="/pages/login"
          onClick={(e) => {
            e.preventDefault();
            return logout();
          }}
        >
          <FaPowerOff size={14} className="mr-50" />
          <span className="align-middle">Sair</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
    {/* <Link to="//assine.iuli.com.br/ajuda" target="_blank" className="nav-link">
      <HelpCircle size={34} className="mr-2 mt-50" />
    </Link> */}
  </ul>
);

NavbarUser.propTypes = {
  userName: PropTypes.string.isRequired,
  userImg: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  currentCompany: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompany: state.companies.currentCompany,
});

export default connect(mapStateToProps)(NavbarUser);
