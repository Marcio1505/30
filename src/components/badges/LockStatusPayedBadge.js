import React, { useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { PopoverHeader, PopoverBody, Popover } from 'reactstrap';
import { AlertTriangle } from 'react-feather';

const LockStatusPayedBadge = ({ transaction }) => {
  const [popoverAlertOpen, setPopoverAlertOpen] = useState(false);

  const popoverAlertRef = useRef();
  const togglePopoverAlert = () => setPopoverAlertOpen(!popoverAlertOpen);

  const hasReconciled =
    transaction.reconciled == 1 || transaction.reconciled == 2;

  const hasSync =
    transaction.source === 'HOTMART' ||
    // transaction.source === 'ASAAS' ||
    transaction.source === 'GURUPAGARME' ||
    transaction.source === 'GURU2PAGARME2' ||
    transaction.source === 'GURUEDUZZ' ||
    transaction.source === 'PROVI' ||
    transaction.source === 'EDUZZ';

  let platform = '';
  switch (transaction.source) {
    case 'HOTMART':
      platform = 'Hotmart';
      break;
    case 'ASAAS':
      platform = 'Asaas';
      break;
    case 'GURUPAGARME':
      platform = 'Pagarme';
      break;
    case 'GURU2PAGARME2':
      platform = 'Pagarme2';
      break;
    case 'GURUEDUZZ':
      platform = 'Eduzz';
      break;
    case 'PROVI':
      platform = 'Provi';
      break;
    case 'EDUZZ':
      platform = 'Eduzz';
      break;
    default:
      platform = '';
      break;
  }

  let titleMessage = '';
  let bodyMessage = '';

  if (hasReconciled) {
    titleMessage = transaction.type == 1 ? 'Conta a receber' : 'Conta a pagar';
    bodyMessage =
      'Não é permitido alterar porque essa transação já está conciliada.';
  }

  if (hasSync) {
    titleMessage = transaction.type == 1 ? 'Conta a receber' : 'Conta a pagar';
    bodyMessage = `Não é permitido alterar porque essa transação foi sincronizada com a plataforma ${platform}.`;
  }

  if (!titleMessage) {
    return null;
  }

  return (
    <>
      <div className="d-flex">
        <div className="actions cursor-pointer">
          <>
            <span
              className="text-warning"
              ref={popoverAlertRef}
              onMouseEnter={() => setPopoverAlertOpen(true)}
              onMouseLeave={() => setPopoverAlertOpen(false)}
            >
              <AlertTriangle size={25} />
            </span>
            <Popover
              placement="top"
              isOpen={popoverAlertOpen}
              target={popoverAlertRef}
              toggle={togglePopoverAlert}
            >
              <PopoverHeader>{titleMessage}</PopoverHeader>
              <PopoverBody>{bodyMessage}</PopoverBody>
            </Popover>
          </>
        </div>
      </div>
    </>
  );
};

LockStatusPayedBadge.propTypes = {
  transaction: PropTypes.object.isRequired,
};

export default LockStatusPayedBadge;
