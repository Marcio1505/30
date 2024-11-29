import constants from './permissions.constants';
import permissionsInitialState from './permissions.initialState';

const reducer = (state = permissionsInitialState, { type, payload }) => {
  switch (type) {
    case constants.SET_CURRENT_PERMISSIONS: {
      const { currentPermissions } = payload;
      return {
        ...state,
        currentPermissions,
      };
    }

    default:
      return state;
  }
};

export default reducer;
