const applicationInitialState = {
  resources: {},
  loading: false,

  dialogV2: { visible: false },
  errorDialog: { visible: false },
  adminBodyRef: null,

  dialog: {
    visible: false,
    message: '',
    allErros: [],
    requestedUrl: '',
    type: '',
    colour: '',
    title: '',
    isConfirmDialog: false,
    onConfirm: null,
    onClose: null,
    onCancel: null,
  },
};

export default applicationInitialState;
