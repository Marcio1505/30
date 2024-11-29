import React from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';

const ProductLinkStatusBadge = ({ status, endDate }) => {
  const isProductLinkExpired = moment(endDate).isBefore(
    moment().startOf('day')
  );
  if (isProductLinkExpired) {
    return (
      <>
        <div className="badge badge-pill badge-light-danger">Expirado</div>
      </>
    );
  }
  return (
    <>
      {status === 1 && (
        <div className="badge badge-pill badge-light-success">Ativo</div>
      )}
      {status === 0 && (
        <div className="badge badge-pill badge-light-danger">Inativo</div>
      )}
    </>
  );
};

ProductLinkStatusBadge.propTypes = {
  status: PropTypes.number.isRequired,
  endDate: PropTypes.string.isRequired,
};

export default ProductLinkStatusBadge;
