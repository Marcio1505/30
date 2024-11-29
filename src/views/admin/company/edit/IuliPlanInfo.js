import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Row, Col } from 'reactstrap';

const IuliPlanInfo = ({ iuliPlan, dateExpiryAt }) => {
  const momentDateExpiryAt = dateExpiryAt
    ? moment(dateExpiryAt, 'YYYY-MM-DD')
    : null;

  const className =
    !momentDateExpiryAt || momentDateExpiryAt.isAfter(moment())
      ? 'success'
      : 'danger';

  return (
    <Row>
      <Col className="mt-1" sm="12">
        <h3 className="mb-1 text-primary">
          <span className="align-middle">Plano Iuli</span>
        </h3>
      </Col>
      <Col>
        {`Plano Contratado: `}
        <span className="font-medium-2 text-bold-700">{iuliPlan?.name}</span>
      </Col>
      <Col>
        {`Data de Expiração: `}
        <span className={`font-medium-2 text-bold-700 ${className}`}>
          {momentDateExpiryAt
            ? momentDateExpiryAt.format('DD/MM/YYYY')
            : 'Plano Vitalício'}
        </span>
      </Col>
    </Row>
  );
};

IuliPlanInfo.propTypes = {
  iuliPlan: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  dateExpiryAt: PropTypes.string.isRequired,
};

export default IuliPlanInfo;