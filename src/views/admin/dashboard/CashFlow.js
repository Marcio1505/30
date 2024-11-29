import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';
import Chart from 'react-apexcharts';
import { useIntl } from 'react-intl';
import { Eye, EyeOff } from 'react-feather';

import CashFlowLoading from './CashFlowLoading';
import themeColors from '../../../utils/themeColors';
import { formatMoney } from '../../../utils/formaters';

import { getCashFlow } from '../../../services/apis/dashboards.api';

const CashFlow = ({ currentCompanyId }) => {
  const intl = useIntl();
  const [cashFlow, setCashFlow] = useState({});
  const [isLoadingCashFlow, setIsLoadingCashFlow] = useState(false);
  const [showCashFlow, setShowCashFlow] = useState(false);

  const toggleShowCashFlow = async () => {
    if (cashFlow.options === undefined) {
      await getCashFlowData();
    }
    setShowCashFlow(!showCashFlow);
  };

  const getCashFlowData = async () => {
    setIsLoadingCashFlow(true);
    const data = await getCashFlow({ toggleLoading: false });
    setCashFlow({
      options: {
        chart: {
          toolbar: {
            show: false,
          },
          height: 350,
          type: 'line',
        },
        colors: [themeColors.success, themeColors.danger, themeColors.primary],
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '55%',
          },
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [2],
        },
        stroke: {
          show: true,
          width: 2,
          // colors: ["transparent"],
          // width: [0, 4]
        },
        legend: {
          offsetY: -10,
        },
        xaxis: {
          categories: data.data.cash_flow?.receivables.map(
            (_receivable, key) => key + 1
          ),
        },
        yaxis: {
          title: {
            text: 'R$',
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter(val) {
              return `R$ ${val}`;
            },
          },
        },
      },
      series: [
        {
          name: 'Entrada',
          data: data.data.cash_flow?.receivables.map((receivable) =>
            parseFloat(receivable || 0).toFixed(2)
          ),
          type: 'column',
        },
        {
          name: 'Saída',
          data: data.data.cash_flow?.payables.map((payable) =>
            parseFloat(payable || 0).toFixed(2)
          ),
          type: 'column',
        },
        {
          name: 'Saldo',
          data: data.data.cash_flow?.balance.map((balance) =>
            parseFloat(balance || 0).toFixed(2)
          ),
          tooltip: data.data.cash_flow?.balance.map((balance) =>
            formatMoney(parseFloat(balance) || 0)
          ),
          type: 'line',
        },
      ],
    });
    setIsLoadingCashFlow(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {intl.formatMessage({ id: 'dashboard.cash_flow' })}
        </CardTitle>
      </CardHeader>
      <CardBody className="overflow-hidden">
        {!isLoadingCashFlow && (
          <a onClick={toggleShowCashFlow}>
            {showCashFlow ? <Eye size={25} /> : <EyeOff size={25} />}
          </a>
        )}
        {isLoadingCashFlow ? (
          <CashFlowLoading />
        ) : (
          <>
            {showCashFlow && (
              <Chart
                options={cashFlow.options}
                series={cashFlow.series}
                height={350}
              />
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

CashFlow.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

CashFlow.defaultProps = {};

export default connect(mapStateToProps)(CashFlow);
