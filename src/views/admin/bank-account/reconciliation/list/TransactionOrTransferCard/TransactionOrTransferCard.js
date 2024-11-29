import React from 'react';
import { Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';

import BasicTab from '../../../../../../components/tabs/BasicTab';

const TransactionOrTransferCard = ({ ofxTransaction }) => (
  <Card>
    <CardBody>
      <BasicTab
        tabs={ofxTransaction.tabs}
        bodyColor={ofxTransaction.background_color}
        statusStyle={ofxTransaction.status_style}
        title={ofxTransaction.type_text}
      />
    </CardBody>
  </Card>
);

TransactionOrTransferCard.propTypes = {
  ofxTransaction: PropTypes.shape({
    background_color: PropTypes.string,
    status_style: PropTypes.string,
    type_text: PropTypes.string,
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.object,
      })
    ),
  }).isRequired,
};

export default TransactionOrTransferCard;
