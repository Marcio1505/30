// TO DO Check if there are ACTIONS to exclude

import constants from './application.constants';

const toggleDialog = ({
  message = '',
  details = '',
  allErrors = [],
  requestedUrl = '',
  type = '',
  title = '',
  icon = '',
  colour = '',
  onSubmit = null,
  onConfirm = null,
  onClose = null,
  onCancel = null,
  isConfirmDialog = false,
  ...rest
} = {}) => ({
  type: constants.TOGGLE_DIALOG,
  payload: {
    message,
    details,
    allErrors,
    requestedUrl,
    type,
    colour,
    title,
    icon,
    onSubmit,
    onConfirm,
    onClose,
    onCancel,
    isConfirmDialog,
    ...rest,
  },
});

const saveAdminBodyRef = (ref) => ({
  type: constants.SAVE_ADMIN_BODY_REF,
  payload: { ref },
});

const toggleDialogV2 = (dialogProps = {}) => ({
  type: constants.TOGGLE_DIALOG_V2,
  payload: { ...dialogProps },
});

const toggleErrorDialog = (dialogProps = {}) => ({
  type: constants.TOGGLE_ERROR_DIALOG,
  payload: { ...dialogProps },
});

const toggleLoading = () => ({
  type: constants.TOGGLE_LOADING,
});

const hideLoading = () => ({
  type: constants.HIDE_LOADING,
});

const hideDialog = () => ({
  type: constants.HIDE_DIALOG,
});

const hideErrorDialog = () => ({
  type: constants.HIDE_ERROR_DIALOG,
});

const hideDialogV2 = () => ({
  type: constants.HIDE_DIALOG_V2,
});

const dialogConfirmYes = () => ({
  type: constants.DIALOG_CONFIRM_YES,
});

const dialogConfirmNo = () => ({
  type: constants.DIALOG_CONFIRM_NO,
});

const registerResource = (resource) => ({
  type: constants.REGISTER_RESOURCE,
  payload: { resource },
});

const unregisterResource = (resourceName) => ({
  type: constants.UNREGISTER_RESOURCE,
  payload: { resourceName },
});

const resetApplicationLoading = () => ({
  type: constants.RESET_APPLICATION_LOADING,
});

export default {
  saveAdminBodyRef,

  toggleDialog,
  hideDialog,

  toggleLoading,
  hideLoading,

  dialogConfirmYes,
  dialogConfirmNo,

  registerResource,
  unregisterResource,

  resetApplicationLoading,

  toggleDialogV2,
  hideDialogV2,

  toggleErrorDialog,
  hideErrorDialog,
};
