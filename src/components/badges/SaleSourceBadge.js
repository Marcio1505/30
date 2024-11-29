import React, { useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { PopoverHeader, PopoverBody, Popover } from 'reactstrap';

import { getSourceInformation } from '../../utils/sourceUtils';

const SaleSourceBadge = ({ saleSource, entity }) => {
  const [popoverSaleSourceOpen, setPopoverSaleSourceOpen] = useState(false);

  const togglePopoverSaleSource = () =>
    setPopoverSaleSourceOpen(!popoverSaleSourceOpen);

  const popoverSaleSourceRef = useRef();

  const saleSourceInformation = getSourceInformation(saleSource, entity);

  return (
    <>
      <div
        className={`badge badge-light-${saleSourceInformation.color} mr-1`}
        ref={popoverSaleSourceRef}
        onMouseEnter={() => setPopoverSaleSourceOpen(true)}
        onMouseLeave={() => setPopoverSaleSourceOpen(false)}
      >
        {saleSourceInformation.initials}
      </div>
      <Popover
        placement="top"
        isOpen={popoverSaleSourceOpen}
        target={popoverSaleSourceRef}
        toggle={togglePopoverSaleSource}
      >
        <PopoverHeader>{saleSourceInformation.title}</PopoverHeader>
        <PopoverBody>{saleSourceInformation.description}</PopoverBody>
      </Popover>
    </>
  );
};

SaleSourceBadge.propTypes = {
  saleSource: PropTypes.string,
  entity: PropTypes.string,
};

SaleSourceBadge.defaultProps = {
  saleSource: null,
  entity: 'Venda',
};

export default SaleSourceBadge;
