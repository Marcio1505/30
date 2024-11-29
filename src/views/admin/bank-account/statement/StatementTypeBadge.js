import React from 'react';
import propTypes from 'prop-types';
import { Badge } from 'reactstrap';

const StatementStatusBadge = ({ statement }) => {
  if (statement.statement_type === 1 && statement.type === 3) {
    return <Badge className="badge-info mr-1">S</Badge>;
  }
  if (statement.statement_type === 1 && statement.type === 1) {
    return <Badge className="badge-success mr-1">C</Badge>;
  }
  if (statement.statement_type === 1 && statement.type === 2) {
    return <Badge className="badge-danger mr-1">D</Badge>;
  }
  if (statement.statement_type === 2) {
    return (
      <Badge
        className={
          statement.type === 1 ? 'badge-success mr-1' : 'badge-danger mr-1'
        }
      >
        T
      </Badge>
    );
  }
  return null;
};

StatementStatusBadge.propTypes = {
  statement: propTypes.shape({
    statement_type: propTypes.number,
    type: propTypes.number,
  }).isRequired,
};

export default StatementStatusBadge;
