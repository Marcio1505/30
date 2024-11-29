import React from 'react';
import { PropTypes } from 'prop-types';

const YesOrNoBadge = ({ booleanData }) => (
  <>
    {booleanData === 1 ? (
      <div className="badge badge-pill badge-light-success mr-1">Sim</div>
    ) : (
      <div className="badge badge-pill badge-light-danger mr-1">Não</div>
    )}
  </>
);

YesOrNoBadge.propTypes = {
  booleanData: PropTypes.bool.isRequired,
};

YesOrNoBadge.defaultProps = {};

export default YesOrNoBadge;
