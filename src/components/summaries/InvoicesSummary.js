import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Check, Clock, Plus, X } from 'react-feather';

import StatisticsCard from '../@vuexy/statisticsCard/StatisticsCard';

import '../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../assets/scss/pages/users.scss';

const InvoicesSummary = ({ summaryData }) => (
  <>
    <Row className="my-2 sales-summary">
      <Col lg="3" md="6" sm="12">
        <StatisticsCard
          solid
          hideChart
          iconBg="#FFF"
          className="mb-0 bg-success text-left"
          icon={<Check className="success" size={22} />}
          stat={summaryData.authorized?.text_value}
          statTitle={`NF Emitidas ${summaryData.authorized?.text_number}`}
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
          stat={summaryData.processing?.text_value}
          statTitle={`NF Processando ${summaryData.processing?.text_number}`}
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
          stat={summaryData.canceled?.text_value}
          statTitle={`NF Canceladas ${summaryData.canceled?.text_number}`}
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
          icon={<Plus className="danger" size={22} />}
          stat={summaryData.denied?.text_value}
          statTitle={`NF Negadas ${summaryData.denied?.text_number}`}
          options={3}
          type="area"
        />
      </Col>
    </Row>
  </>
);

InvoicesSummary.propTypes = {
  summaryData: PropTypes.object.isRequired,
};

InvoicesSummary.defaultProps = {};

export default InvoicesSummary;
