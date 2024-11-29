import React from 'react';
import propTypes from 'prop-types';
import { Button } from 'reactstrap';

import PermissionGate from '../../../../PermissionGate';

const PeriodClosure = ({
  cashPeriodClosureId,
  date,
  handleStoreCashPeriodClosure,
  handleDestroyCashPeriodClosure,
}) => (
  <span>
    {cashPeriodClosureId ? (
      <PermissionGate permissions="bank-accounts.period-closures.destroy">
        <Button.Ripple
          color="danger"
          onClick={() => handleDestroyCashPeriodClosure(cashPeriodClosureId)}
        >
          Reabrir Período
        </Button.Ripple>
      </PermissionGate>
    ) : (
      <PermissionGate permissions="bank-accounts.period-closures.store">
        <Button.Ripple
          color="success"
          onClick={() => handleStoreCashPeriodClosure(date)}
        >
          Encerrar Período
        </Button.Ripple>
      </PermissionGate>
    )}
  </span>
);

PeriodClosure.propTypes = {
  cashPeriodClosureId: propTypes.oneOfType([
    propTypes.number || propTypes.string || null,
  ]).isRequired,
  date: propTypes.string.isRequired,
  handleStoreCashPeriodClosure: propTypes.func.isRequired,
  handleDestroyCashPeriodClosure: propTypes.func.isRequired,
};

export default PeriodClosure;
