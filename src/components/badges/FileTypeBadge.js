import React from 'react';
import { PropTypes } from 'prop-types';

const FileTypeBadge = ({ fileType }) => {
  switch (fileType) {
    case 'XML':
      return <div className="badge badge-pill badge-light-success">XML</div>;
    case 'PDF':
      return <div className="badge badge-pill badge-light-danger">PDF</div>;
    default:
      return <div className="badge badge-pill badge-light-warning">Todas</div>;
  }
};

FileTypeBadge.propTypes = {
  fileType: PropTypes.string.isRequired,
};

export default FileTypeBadge;
