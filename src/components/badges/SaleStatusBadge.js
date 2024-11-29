import React, { useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
// import * as Icon from 'react-feather';
import { PopoverHeader, PopoverBody, Popover } from 'reactstrap';

import { getSaleStatusInformation } from '../../utils/sales';

// Sale Status
// 1 = Iniciada
// 2 = Boleto Gerado
// 3 = Aguardando pagamento
// 4 = Em Análise
// 5 = Aprovada
// 6 = Completa
// 7 = Expirada
// 8 = Atrasada
// 9 = Cancelada
// 10 = Reclamada
// 11 = Reembolsada
// 12 = Reembolsada Manual
// 13 = Chargeback

const SaleStatusBadge = ({ saleStatus }) => {
  const [popoverSaleStatusOpen, setPopoverSaleStatusOpen] = useState(false);

  const togglePopoverSaleStatus = () =>
    setPopoverSaleStatusOpen(!popoverSaleStatusOpen);

  const popoverSaleStatusRef = useRef();

  const saleStatusInformation = getSaleStatusInformation(saleStatus);

  return (
    <>
      {saleStatusInformation.title && (
        <>
          <div
            className={`badge badge-pill badge-light-${saleStatusInformation.color}`}
            ref={popoverSaleStatusRef}
            onMouseEnter={() => setPopoverSaleStatusOpen(true)}
            onMouseLeave={() => setPopoverSaleStatusOpen(false)}
          >
            {saleStatusInformation.icon}
          </div>
          <Popover
            placement="top"
            isOpen={popoverSaleStatusOpen}
            target={popoverSaleStatusRef}
            toggle={togglePopoverSaleStatus}
          >
            <PopoverHeader>{saleStatusInformation.title}</PopoverHeader>
            <PopoverBody>{saleStatusInformation.description}</PopoverBody>
          </Popover>
        </>
      )}
    </>
  );
};

SaleStatusBadge.propTypes = {
  saleStatus: PropTypes.number,
};

SaleStatusBadge.defaultProps = {
  saleStatus: null,
};

export default SaleStatusBadge;
