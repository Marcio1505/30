import constants from './application.constants';
import applicationInitialState from './application.initialState';

const reducer = (state = applicationInitialState, { type, payload }) => {
  switch (type) {
    case constants.SAVE_ADMIN_BODY_REF: {
      const { ref } = payload;

      return {
        ...state,
        adminBodyRef: ref,
      };
    }

    case constants.TOGGLE_DIALOG: {
      const {
        title,
        message,
        onConfirm,
        onClose,
        onCancel,
        allErrors,
        requestedUrl,
        ...rest
      } = payload;

      return {
        ...state,
        dialog: {
          visible: true,
          title,
          message,
          onConfirm,
          onClose,
          onCancel,
          allErrors,
          requestedUrl,
          ...rest,
        },
      };
    }

    case constants.TOGGLE_DIALOG_V2: {
      return {
        ...state,
        dialogV2: {
          visible: true,
          ...payload,
        },
      };
    }

    case constants.HIDE_DIALOG_V2: {
      return {
        ...state,
        dialogV2: {
          ...applicationInitialState.dialogV2,
        },
      };
    }

    case constants.TOGGLE_ERROR_DIALOG: {
      return {
        ...state,
        errorDialog: {
          visible: true,
          ...payload,
        },
      };
    }

    case constants.HIDE_ERROR_DIALOG: {
      return {
        ...state,
        errorDialog: {
          ...applicationInitialState.errorDialog,
        },
      };
    }

    case constants.HIDE_DIALOG:
      return {
        ...state,
        dialog: {
          ...applicationInitialState.dialog,
          visible: false,
        },
      };

    case constants.TOGGLE_LOADING:
      return {
        ...state,
        loading: true,
      };

    case constants.HIDE_LOADING:
      return {
        ...state,
        loading: false,
      };

    case constants.DIALOG_CONFIRM_YES:
    case constants.DIALOG_CONFIRM_NO:
      return {
        ...state,
        dialog: {
          ...applicationInitialState.dialog,
        },
      };

    case constants.REGISTER_RESOURCE: {
      const { resource } = payload;

      return {
        ...state,
        resources: {
          ...state.resources,
          [resource.name]: resource,
        },
      };
    }

    case constants.UNREGISTER_RESOURCE: {
      const { resourceName } = payload;
      const { [resourceName]: resource, ...rest } = state.resources;

      return {
        ...state,
        resources: rest,
      };
    }

    default:
      return state;
  }
};

export default reducer;
