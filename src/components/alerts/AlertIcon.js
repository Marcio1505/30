import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { AlertTriangle } from 'react-feather';

const AlertIcon = ({ text, type, children }) => (
  <Alert color={type}>
    <AlertTriangle size={15} />
    <span>
      {text}
      {children}
    </span>
  </Alert>
);

AlertIcon.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.node,
};

AlertIcon.defaultProps = {
  type: 'info',
  text: null,
  children: null,
};

export default AlertIcon;
