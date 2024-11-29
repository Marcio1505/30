import React from 'react';

const StatusBadge = ({ status }) => (
  <>
    {status === 1 && (
      <div className="badge badge-pill badge-light-success">Ativo</div>
    )}
    {status === 0 && (
      <div className="badge badge-pill badge-light-danger">Inativo</div>
    )}
  </>
);

export default StatusBadge;
