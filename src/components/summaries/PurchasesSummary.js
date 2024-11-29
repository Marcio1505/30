import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Check, Clock, Plus, X } from 'react-feather';

import StatisticsCard from '../@vuexy/statisticsCard/StatisticsCard';

import '../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../assets/scss/pages/users.scss';

const PurchasesSummary = ({ summaryData }) => (
  <>
    <Row className="my-2 sales-summary">
      <Col lg="3" md="6" sm="12">
        <StatisticsCard
          solid
          hideChart
          iconBg="#FFF"
          className="mb-0 bg-success text-left"
          icon={<Check className="success" size={22} />}
          stat={summaryData.approved?.text_value}
          statTitle={`Aprovadas ${summaryData.approved?.text_number}`}
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
          stat={summaryData.waiting?.text_value}
          statTitle={`Aguardando Aprovação ${summaryData.waiting?.text_number}`}
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
          stat={summaryData.reprovedOrCanceled?.text_value}
          statTitle={`Reprovadas ou Canceladas ${summaryData.reprovedOrCanceled?.text_number}`}
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

PurchasesSummary.propTypes = {
  summaryData: PropTypes.object.isRequired,
};

PurchasesSummary.defaultProps = {};

export default PurchasesSummary;
