import constants from './permissions.constants';

const setCurrentPermissions = ({ currentPermissions }) => ({
  type: constants.SET_CURRENT_PERMISSIONS,
  payload: { currentPermissions },
});

export { setCurrentPermissions };
