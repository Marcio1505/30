import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { NavItem, NavLink, UncontrolledTooltip } from 'reactstrap';
import Select from 'react-select';
import { history } from '../../../history';
import { apiPermissions } from '../../../services/apis/permissions.api';
import { updateCurrentCompany } from '../../../redux/actions/companies/index';
import Avatar from '../../../components/@vuexy/avatar/AvatarComponent';

const NavbarCompanies = ({
  companies,
  currentCompanyId,
  updateCurrentCompany,
  currentUser,
}) => {
  const dispatch = useDispatch();

  const companiesOptions = companies.map((company) => ({
    ...company,
    value: company.id,
    label: company.trading_name || company.company_name,
  }));

  const handleUpdateCompany = async (companyId) => {
    updateCurrentCompany(companyId);
    const respGetPermissions = await apiPermissions({
      userId: currentUser?.id,
    });
    dispatch({
      type: 'PERMISSIONS/SET_CURRENT_PERMISSIONS',
      payload: {
        currentPermissions: respGetPermissions,
      },
    });
    dispatch({
      type: 'PAYABLES/SET_INITIAL_STATE',
      payload: {},
    });
    dispatch({
      type: 'RECEIVABLES/SET_INITIAL_STATE',
      payload: {},
    });
    dispatch({
      type: 'SALES/SET_INITIAL_STATE',
      payload: {},
    });
    dispatch({
      type: 'PURCHASES/SET_INITIAL_STATE',
      payload: {},
    });
    dispatch({
      type: 'INVOICE_DOWNLOADS/SET_INITIAL_STATE',
      payload: {},
    });

    history.push('/admin');
  };

  if (companies.length > 5) {
    return (
      <div className="d-flex">
        <div
          className="align-items-center mt-2 mt-xl-0"
          style={{
            width: '300px',
          }}
        >
          <Select
            options={companiesOptions}
            defaultValue={companiesOptions.find(
              (company) => company.id === currentCompanyId
            )}
            onChange={(selected) => handleUpdateCompany(selected.value)}
            className="React"
            classNamePrefix="select"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
      <ul className="nav navbar-nav bookmark-icons">
        {companies.map((company, index) => (
          <NavItem
            key={`nav-item${index}`}
            className="nav-item d-lg-flex align-items-center"
          >
            <NavLink
              tag="span"
              id={`nav-link-company-id-${company.id}`}
              className="nav-link cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateCompany(company.id);
              }}
            >
              <Avatar
                id={`avatar-company-id-${company.id}`}
                content={
                  company.trading_name
                    ? company.trading_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                    : company.company_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                }
                size={company.id === currentCompanyId ? 'lg' : ''}
                style={
                  company.id === currentCompanyId
                    ? {
                        border: '1px green solid',
                        backgroundColor: 'green',
                      }
                    : ''
                }
              />
              {/* <Avatar img={company.image} /> */}
              <UncontrolledTooltip
                placement="top"
                target={`avatar-company-id-${company.id}`}
              >
                {company.trading_name || company.company_name}
              </UncontrolledTooltip>
            </NavLink>
          </NavItem>
        ))}
        {/* {companies.length > 0 ? (
          <NavItem>
            <NavLink tag="div">
              <UncontrolledDropdown>
                <DropdownToggle tag="span">
                  <Icon.ChevronDown />
                </DropdownToggle>
                <DropdownMenu right>
                  {companies.map(company => (
                    <DropdownItem key={company.id} href={company.id}>
                      <span className="align-middle ml-1">{company.name}</span>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavLink>
          </NavItem>
        ) : null} */}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  companies: state.companies.companies,
  currentCompanyId: state.companies.currentCompanyId,
  currentUser: state.auth?.login?.values?.loggedInUser,
});

export default connect(mapStateToProps, { updateCurrentCompany })(
  NavbarCompanies
);
