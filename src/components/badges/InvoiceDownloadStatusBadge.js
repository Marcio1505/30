import React from 'react';
import { PropTypes } from 'prop-types';
import { Download, Clock } from 'react-feather';

import PermissionGate from '../../PermissionGate';

const InvoiceDownloadStatusBadge = ({ status, fileUrl }) => (
  <div className="actions cursor-pointer text-success text-center">
    {status === 1 && (
      <PermissionGate permissions="invoice-downloads.download-zip">
        <a target="_blank" href={fileUrl} rel="noreferrer">
          <Download className="mr-50" />
        </a>
      </PermissionGate>
    )}
    {Boolean(status === 0 || status === null) && (
      <div className="badge badge-pill badge-light-info">
        <Clock size={16} />
      </div>
    )}
    {Boolean(status === 9) && (
      <div className="badge badge-pill badge-light-warning">
        <Clock size={16} />
      </div>
    )}
  </div>
);

InvoiceDownloadStatusBadge.propTypes = {
  status: PropTypes.number.isRequired,
  fileUrl: PropTypes.string.isRequired,
};

export default InvoiceDownloadStatusBadge;
