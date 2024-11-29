import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from "reactstrap"
import { Home, Settings } from "react-feather"
import { NavLink } from "react-router-dom"

class BreadCrumbs extends React.Component {
  render() {
    return (
      <div className="content-header row">
        <div className="content-header-left col-12 my-2">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              {this.props.breadCrumbTitle ? (
                <h2 className="content-header-title float-left mb-0">
                  {this.props.breadCrumbTitle}
                </h2>
              ) : (
                ""
              )}
              <div className="breadcrumb-wrapper vx-breadcrumbs d-sm-block d-none col-12">
                <Breadcrumb tag="ol">
                  <BreadcrumbItem tag="li">
                    <NavLink to="/">
                      <Home className="align-top" size={15} />
                    </NavLink>
                  </BreadcrumbItem>
                  {this.props.breadCrumbParents && this.props.breadCrumbParents.map(parent => {
                    return (
                      <BreadcrumbItem 
                        key={parent.name}
                        tag="li"
                      >
                        <NavLink to={parent.link}>
                          {parent.name}
                        </NavLink>
                      </BreadcrumbItem>
                    )
                  })}
                  <BreadcrumbItem tag="li" active>
                    {this.props.breadCrumbActive}
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="content-header-right text-md-right col-md-3 col-12 d-md-block d-none"> */}
        <div className="content-header-right text-md-right col-md-3 col-12 d-none">
          <div className="form-group breadcrum-right dropdown">
            <UncontrolledButtonDropdown>
              <DropdownToggle
                color="primary"
                size="sm"
                className="btn-icon btn-round dropdown-toggle"
              >
                <Settings
                  size={14}
                  style={{
                    left: 0
                  }}
                />
              </DropdownToggle>
              <DropdownMenu tag="ul" right>
                <DropdownItem tag="li">
                  <NavLink className="text-dark w-100" to="/chat">
                    Chat
                  </NavLink>
                </DropdownItem>
                <DropdownItem tag="li">
                  <NavLink className="text-dark w-100" to="/email/inbox">
                    Email
                  </NavLink>
                </DropdownItem>
                <DropdownItem tag="li">
                  <NavLink className="text-dark w-100" to="/calendar">
                    Calendar
                  </NavLink>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </div>
        </div>
      </div>
    )
  }
}
export default BreadCrumbs
