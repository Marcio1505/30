import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Check, Clock, DollarSign } from 'react-feather';
import StatisticsCard from '../@vuexy/statisticsCard/StatisticsCard';
import '../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../assets/scss/pages/users.scss';

const StockSummary = ({ summaryData: { active, expire, balance } }) => (
  <>
    <Row className="my-2 sales-summary">
      <Col lg="4" md="6" sm="12">
        <StatisticsCard
          solid
          hideChart
          iconBg="#FFF"
          className="mb-0 bg-warning text-left"
          icon={<Check className="warning" size={22} />}
          stat={`${active} Produtos`}
          statTitle="Ativos"
          options={3}
          type="area"
        />
      </Col>
      <Col lg="4" md="6" sm="12">
        <StatisticsCard
          solid
          hideChart
          iconBg="#FFF"
          className="mb-0 bg-success text-left"
          icon={<DollarSign className="success" size={22} />}
          stat={balance}
          statTitle="Saldo em Estoque"
          options={3}
          type="area"
        />
      </Col>
      <Col lg="4" md="6" sm="12">
        <StatisticsCard
          solid
          hideChart
          iconBg="#FFF"
          className="mb-0 bg-danger text-left"
          icon={<Clock className="danger" size={22} />}
          stat={`${expire} Produtos`}
          statTitle="A Vender nos Próximos 30 dias"
          options={3}
          type="area"
        />
      </Col>
    </Row>
  </>
);

StockSummary.propTypes = {
  summaryData: PropTypes.shape({
    active: PropTypes.string.isRequired,
    expire: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }).isRequired,
};

StockSummary.defaultProps = {};

export default StockSummary;
