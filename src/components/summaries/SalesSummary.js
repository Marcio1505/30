import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Check, Clock, Plus, X } from 'react-feather';

import StatisticsCard from '../@vuexy/statisticsCard/StatisticsCard';

import '../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../assets/scss/pages/users.scss';

const SalesSummary = ({ summaryData }) => (
  <>
    <Row className="my-2 sales-summary">
      <Col lg="3" md="6" sm="12">
        <StatisticsCard
          solid
          hideChart
          iconBg="#FFF"
          className="mb-0 bg-success text-left"
          icon={<Check className="success" size={22} />}
          stat={summaryData.issued?.text_value}
          statTitle={`NF Emitida ${summaryData.issued?.text_number}`}
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
          stat={summaryData.pending?.text_value}
          statTitle={`NF a Emitir ${summaryData.pending?.text_number}`}
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
          stat={summaryData.error?.text_value}
          statTitle={`NF Erro ${summaryData.error?.text_number}`}
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
          statTitle={`Total de Vendas ${summaryData.total?.text_number}`}
          options={3}
          type="area"
        />
      </Col>
    </Row>
  </>
);

SalesSummary.propTypes = {
  summaryData: PropTypes.object.isRequired,
};

SalesSummary.defaultProps = {};

export default SalesSummary;
