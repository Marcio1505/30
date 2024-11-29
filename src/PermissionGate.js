import { connect } from 'react-redux';

const PermissionGate = ({
  children,
  permissions,
  currentPermissions,
  currentUser,
}) => {
  if (permissions === 'public') {
    return children;
  }
  if (permissions === 'isIuliAdmin') {
    if (currentUser.is_iuli_admin) {
      return children;
    }
    return null;
  }

  const permissionValid = (currentPermissions || []).filter(({ name }) =>
    name.includes(permissions)
  );

  if (permissionValid?.length || currentUser.is_iuli_admin) {
    return children;
  }
  return null;
};

const mapStateToProps = (state) => ({
  currentPermissions: state.permissions.currentPermissions,
  currentUser: state.auth?.login?.values?.loggedInUser,
});

export default connect(mapStateToProps)(PermissionGate);
