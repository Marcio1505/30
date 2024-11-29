import React, { useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
// import * as Icon from 'react-feather';
import { PopoverHeader, PopoverBody, Popover } from 'reactstrap';

import { getPaymentMethod } from '../../utils/sales';

// Sale Payment Method
// 1 = Crédito
// 2 = Débito
// 3 = Boleto
// 4 = PIX
// 5 = TED/DOC
// 6 = Saldo
// 99 = Outros

const SalePaymentMethodBadge = ({ salePaymentMethod }) => {
  const [popoverSalePaymentMethodOpen, setPopoverSalePaymentMethodOpen] =
    useState(false);

  const togglePopoverSalePaymentMethod = () =>
    setPopoverSalePaymentMethodOpen(!popoverSalePaymentMethodOpen);

  const popoverSalePaymentMethodRef = useRef();

  const salePaymentMethodInformation = getPaymentMethod(salePaymentMethod);

  return (
    <>
      {salePaymentMethodInformation.title && (
        <>
          <div
            className={`badge badge-pill badge-light-${salePaymentMethodInformation.color}`}
            ref={popoverSalePaymentMethodRef}
            onMouseEnter={() => setPopoverSalePaymentMethodOpen(true)}
            onMouseLeave={() => setPopoverSalePaymentMethodOpen(false)}
          >
            {salePaymentMethodInformation.icon}
          </div>
          <Popover
            placement="top"
            isOpen={popoverSalePaymentMethodOpen}
            target={popoverSalePaymentMethodRef}
            toggle={togglePopoverSalePaymentMethod}
          >
            <PopoverHeader>{salePaymentMethodInformation.title}</PopoverHeader>
            <PopoverBody>
              {salePaymentMethodInformation.description}
            </PopoverBody>
          </Popover>
        </>
      )}
    </>
  );
};

SalePaymentMethodBadge.propTypes = {
  salePaymentMethod: PropTypes.number,
};

SalePaymentMethodBadge.defaultProps = {
  salePaymentMethod: null,
};

export default SalePaymentMethodBadge;
