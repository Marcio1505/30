import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

import { ChevronDown } from 'react-feather';

import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  CustomInput,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Collapse,
} from 'reactstrap';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { groupBy } from 'lodash';
import TextField from '../../../../components/inputs/TextField';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import { formatCpf, getOnlyNumbers } from '../../../../utils/formaters';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  showCompanyUser,
  updateCompanyUser,
  createCompanyUserPermissions,
  showPermissionsCompanyUser,
} from '../../../../services/apis/company_user.api';

import { searchUserByCpf } from '../../../../services/apis/user.api';

import { fetchAllPermissionsList } from '../../../../services/apis/permission_user.api';

import { fetchPermissionsRoles } from '../../../../services/apis/permissions_role.api';

import PermissionGate from '../../../../PermissionGate';

const CompanyUserForm = ({ currentCompanyId }) => {
  const [collapseId, setCollapseId] = useState('');
  const [dataPermissionsGrouped, setDataPermissionsGrouped] = useState([]);

  const history = useHistory();
  const intl = useIntl();
  const { user_id } = useParams();

  const [initialized, setInitialized] = useState(false);
  const [userNotRegistered, setUserNotRegistered] = useState(false);
  const [documentFilled, setDocumentFilled] = useState(false);
  const [companyUser, setCompanyUser] = useState({});

  const [rowDataPermissionsRole, setRowDataPermissionsRole] = useState([]);

  const toggleCollapse = (newCollapseId) => {
    if (collapseId === newCollapseId) {
      setCollapseId('');
    } else {
      setCollapseId(newCollapseId);
    }
  };

  const loadPermissionsRole = async () => {
    const { data: _rowDataPermissionsRole } = await fetchPermissionsRoles();
    _rowDataPermissionsRole.push({
      value: 'none',
      label: 'Limpar Permissões',
    });
    setRowDataPermissionsRole(_rowDataPermissionsRole);
    return _rowDataPermissionsRole;
  };

  const loadPermissions = async () => {
    const { data: _rowDataPermissions } = await fetchAllPermissionsList();
    const groupByPermissions = groupBy(
      _rowDataPermissions,
      (permission) => permission.permissions_group
    );
    setDataPermissionsGrouped(
      Object.keys(groupByPermissions).map((key) => groupByPermissions[key])
    );
    return _rowDataPermissions;
  };

  const [rowDataPermissionUsers, setRowDataPermissionUsers] = useState([]);

  const loadPermissionUsers = async (userId) => {
    const { data: _rowDataPermissionUsers } = await showPermissionsCompanyUser({
      user_id: userId,
    });
    setRowDataPermissionUsers(_rowDataPermissionUsers);
    return _rowDataPermissionUsers;
  };

  const fetchInitialData = async () => {
    let dataCompanyUser = {};
    if (user_id) {
      loadPermissionUsers(user_id);
      const res = await showCompanyUser({ id: user_id });
      dataCompanyUser = res.data;
    }
    setCompanyUser(dataCompanyUser);
    loadPermissionsRole();
    loadPermissions();
    setInitialized(true);
  };

  const selcheckbox = (sel) => {
    const chk = document.getElementsByName('chkpermissions');
    for (let i = 0; i < chk.length; i++) {
      chk[i].checked = sel;
    }
  };

  const roleOnChange = (option) => {
    selcheckbox(false);
    if (option.value > 0) {
      const permissions = option.roles.split(',');

      for (let j = 0; j < permissions.length; j++) {
        document.getElementById(
          `chkpermissions_${permissions[j]}`
        ).checked = true;
      }
    }
  };

  const handleSearchUserByCpf = async (cpf) => {
    const { data } = await searchUserByCpf({ cpf });
    if (data.id && data.name) {
      const dataPermissionUsers = await loadPermissionUsers(data.id);
      if (dataPermissionUsers.length > 0) {
        history.push(`/admin/company-user/edit/${data.id}`);
      }
      formik.setFieldValue('user_id', data.id);
      formik.setFieldValue('name', data.name);
      setUserNotRegistered(false);
    } else {
      formik.setFieldValue('user_id', '');
      formik.setFieldValue('name', '');
      setRowDataPermissionUsers([]);
      setUserNotRegistered(true);
      setDocumentFilled(false);
    }
  };

  const mountPayload = (chkpermission) => ({
    userId: formik.values.user_id,
    dataCompanyUserPermissions: {
      ...(user_id && { id: user_id }),
      permissions: chkpermission.split(',').filter((item) => item),
    },
  });

  const onSubmit = async () => {
    const chk = document.getElementsByName('chkpermissions');
    let chkpermission = '';
    let vcount = 0;
    for (let i = 0; i < chk.length; i++) {
      if (chk[i].checked) {
        chkpermission = `${chk[i].value},${chkpermission}`;
        vcount += 1;
      }
    }
    if (vcount == 0) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'error',
          title: 'Ops',
          message: 'Selecione pelo menos uma permissão para o usuário',
          hasTimeout: false,
        })
      );
    } else if (user_id) {
      await updateCompanyUser(mountPayload(chkpermission));
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Permissões do usuário atualizadas com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/company-user/list');
    } else {
      await createCompanyUserPermissions(mountPayload(chkpermission));
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Usuário criado com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/company-user/list');
    }
  };

  const initialValues = {
    user_id: companyUser?.id || '',
    document: companyUser?.document || '',
    name: companyUser?.name || '',
    // role_id: companyUser?.role_id || '',
    permissions: rowDataPermissionUsers || [],
  };

  const validationSchema = Yup.object().shape({
    user_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    /*
    role_id: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
   */
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    fetchInitialData();
  }, [currentCompanyId, user_id]);

  useEffect(() => {
    if (formik.values.document.length === 11) {
      setDocumentFilled(true);
      handleSearchUserByCpf(formik.values.document);
    } else {
      setDocumentFilled(false);
    }
  }, [formik.values.document]);

  return (
    <PermissionGate permissions="permissions-users-companies.show">
      <Form onSubmit={formik.handleSubmit}>
        {initialized && (
          <Row className="mt-1">
            <Col className="mt-1" md={{ size: 12, offset: 0 }} sm="12">
              <Row>
                <Col className="mt-1" md={{ size: 8, offset: 2 }} sm="12">
                  <Row>
                    <Col md="4" sm="12">
                      <TextField
                        id="document"
                        required
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formatCpf(formik.values.document)}
                        onChange={(e) =>
                          formik.setFieldValue(
                            'document',
                            getOnlyNumbers(e.target.value)
                          )
                        }
                        placeholder={intl.formatMessage({ id: 'user.cpf' })}
                        label={intl.formatMessage({ id: 'user.cpf' })}
                        error={
                          formik.touched.document && formik.errors.document
                        }
                        disabled={!!user_id}
                      />
                    </Col>
                    <Col md="4" sm="12">
                      <FormGroup>
                        <Label for="name">
                          <FormattedMessage id="user.name" />
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="name"
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          placeholder={intl.formatMessage({
                            id: 'user.name',
                          })}
                        />
                        {formik.errors.name && formik.touched.name ? (
                          <div className="invalid-tooltip mt-25">
                            {formik.errors.name}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>

                    {Boolean(
                      documentFilled && rowDataPermissionsRole.length
                    ) && (
                      <Col md="4" sm="12">
                        <FormGroup>
                          <Label for="role">
                            <FormattedMessage id="user.role" />
                          </Label>
                          <Select
                            id="role"
                            onBlur={formik.handleBlur}
                            defaultValue={rowDataPermissionsRole.filter(
                              (availableRole) => availableRole.value === 0 // "formik.initialValues.role_id"
                            )}
                            onChange={(option) => roleOnChange(option)}
                            options={rowDataPermissionsRole}
                          />
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>

              {Boolean(documentFilled && dataPermissionsGrouped.length) && (
                <Row>
                  <Col className="mt-1" md={{ size: 8, offset: 2 }} sm="12">
                    <Row>
                      {dataPermissionsGrouped.map((permissionGroup, index) => (
                        <Col md="12" sm="12">
                          <div
                            className="collapse-margin accordion vx-collapse"
                            key={index}
                          >
                            <Card
                              onClick={() => toggleCollapse(index)}
                              className="shadow-none"
                            >
                              <CardHeader>
                                <CardTitle className="lead collapse-title collapsed text-truncate w-75">
                                  {permissionGroup[0].permissions_group}
                                </CardTitle>
                                <ChevronDown
                                  className="collapse-icon"
                                  size={15}
                                />
                              </CardHeader>
                              <Collapse isOpen={index === collapseId}>
                                <CardBody>
                                  {permissionGroup.map((permission) => (
                                    <Col md="12" sm="12">
                                      <CustomInput
                                        type="switch"
                                        id={`chkpermissions_${permission.id}`}
                                        name="chkpermissions"
                                        inline
                                        defaultChecked={
                                          formik.values.permissions.some(
                                            (item) => permission.id === item.id
                                          )
                                            ? 'true'
                                            : null
                                        }
                                        onBlur={formik.handleBlur}
                                        value={permission.id}
                                      >
                                        <span className="switch-label">
                                          {permission.display_name}
                                        </span>
                                      </CustomInput>
                                    </Col>
                                  ))}
                                </CardBody>
                              </Collapse>
                            </Card>
                          </div>
                        </Col>
                      ))}
                    </Row>

                    <Row>
                      <Col
                        className="mt-1"
                        md={{ size: 12, offset: 0 }}
                        sm="12"
                      >
                        <Row>
                          <PermissionGate permissions="permissions-users-companies.update">
                            <Col
                              className="d-flex justify-content-end flex-wrap"
                              sm="12"
                            >
                              <Button.Ripple className="mt-1" color="primary">
                                <FormattedMessage id="button.save" />
                              </Button.Ripple>
                            </Col>
                          </PermissionGate>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
              {Boolean(userNotRegistered) && (
                <Row>
                  <Col className="mt-1" md={{ size: 8, offset: 2 }} sm="12">
                    <FormGroup>
                      <Label for="role">
                        O usuário não está cadastrado no IULI.
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        )}
      </Form>
    </PermissionGate>
  );
};

CompanyUserForm.propTypes = {};

CompanyUserForm.defaultProps = {};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

CompanyUserForm.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(CompanyUserForm);
