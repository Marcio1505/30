import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Check, Clock, Plus, X } from 'react-feather';

import StatisticsCard from '../@vuexy/statisticsCard/StatisticsCard';

import '../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../assets/scss/pages/users.scss';

const TransactionsSummary = ({ summaryData, isPayable }) => (
  <>
    <Row className="my-2 sales-summary">
      <Col lg="3" md="6" sm="12">
        <StatisticsCard
          solid
          hideChart
          iconBg="#FFF"
          className="mb-0 bg-success text-left"
          icon={<Check className="success" size={22} />}
          stat={summaryData.paid?.text_value}
          statTitle={`Contas ${
            (isPayable ? 'Pagas ' : 'Recebidas ') +
            summaryData.paid?.text_number
          }`}
          options={3}
          type="area"
        />
      </Col>
      <Col lg="3" md="6" sm="12">
        <StatisticsCard
          solid
          hideChart
          iconBg="#FFF"
          className="mb-0 bg-warning text-left"
          icon={<Clock className="warning" size={22} />}
          stat={summaryData.toPay?.text_value}
          statTitle={`Contas ${
            (isPayable ? 'a Pagar ' : ' a Receber ') +
            summaryData.toPay?.text_number
          }`}
          options={3}
          type="area"
        />
      </Col>
      <Col lg="3" md="6" sm="12">
        <StatisticsCard
          solid
          hideChart
          iconBg="#FFF"
          className="mb-0 bg-danger text-left"
          icon={<X className="danger" size={22} />}
          stat={summaryData.overdue?.text_value}
          statTitle={`Contas Atrasadas ${summaryData.overdue?.text_number}`}
          options={3}
          type="area"
        />
      </Col>
      <Col lg="3" md="6" sm="12">
        <StatisticsCard
          solid
          hideChart
          iconBg="#FFF"
          className="mb-0 bg-success text-left"
          icon={<Plus className="success" size={22} />}
          stat={summaryData.total?.text_value}
          statTitle={`Total ${summaryData.total?.text_number}`}
          options={3}
          type="area"
        />
      </Col>
    </Row>
  </>
);

TransactionsSummary.propTypes = {
  summaryData: PropTypes.object.isRequired,
  isPayable: PropTypes.bool,
};

TransactionsSummary.defaultProps = {
  isPayable: false,
};

export default TransactionsSummary;
