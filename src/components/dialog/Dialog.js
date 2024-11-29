import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SweetAlert from 'react-bootstrap-sweetalert';
import { exportValidationErrors } from '../../utils/exportValidationErrors';

const Dialog = ({
  isVisible,
  type,
  hasTimeout,
  timeout,
  title,
  message,
  details,
  allErrors,
  requestedUrl,
  onConfirm,
  onClose,
  onCancel,
  showCancel,
  reverseButtons,
  cancelBtnBsStyle,
  confirmBtnBsStyle,
  confirmBtnText,
  cancelBtnText,
}) => (
  <div className={isVisible ? 'global-dialog' : ''}>
    <SweetAlert
      showCancel={showCancel}
      reverseButtons={reverseButtons}
      cancelBtnBsStyle={cancelBtnBsStyle}
      confirmBtnBsStyle={confirmBtnBsStyle}
      confirmBtnText={confirmBtnText}
      cancelBtnText={cancelBtnText}
      timeout={hasTimeout ? timeout : 0}
      warning={type === 'warning'}
      error={type === 'error'}
      info={type === 'info'}
      success={type === 'success'}
      title={title}
      show={isVisible}
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
    >
      <h4 className="sweet-alert-text my-2">{details || message}</h4>
      {Boolean(message && details) && (
        <p className="sweet-alert-text small my-2">{message}</p>
      )}
      {Boolean(allErrors.length) && (
        <p>
          Faça o
          <Link
            to="#"
            color="primary"
            onClick={() => exportValidationErrors(allErrors, requestedUrl)}
          >
            {' '}
            download do arquivo de erros{' '}
          </Link>
          para visualizar os detalhes.
        </p>
      )}
    </SweetAlert>
  </div>
);

Dialog.propTypes = {
  isVisible: PropTypes.bool,
  type: PropTypes.string,
  hasTimeout: PropTypes.bool,
  timeout: PropTypes.number,
  title: PropTypes.string,
  message: PropTypes.string,
  details: PropTypes.string,
  allErrors: PropTypes.array,
  requestedUrl: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  showCancel: PropTypes.bool,
  reverseButtons: PropTypes.bool,
  cancelBtnBsStyle: PropTypes.string,
  confirmBtnBsStyle: PropTypes.string,
  confirmBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
};

Dialog.defaultProps = {
  isVisible: false,
  type: 'success',
  hasTimeout: false,
  timeout: 3000,
  title: 'Título',
  message: 'Ops! Ocorreu um erro inesperado',
  details: null,
  allErrors: [],
  requestedUrl: '',
  showCancel: false,
  reverseButtons: false,
  cancelBtnBsStyle: 'danger',
  confirmBtnBsStyle: 'success',
  confirmBtnText: 'Confirmar',
  cancelBtnText: 'Cancelar',
};

export default Dialog;
