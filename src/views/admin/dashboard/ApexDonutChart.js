import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';
import Chart from 'react-apexcharts';

import { formatMoney, getMonetaryValue } from '../../../utils/formaters';

const ApexDonutCharts = ({ series, title, themeColors, labels }) => {
  const options = {
    colors: themeColors,
    labels,
    legend: {
      itemMargin: {
        horizontal: 2,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 350,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],

    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: undefined,
              offsetY: -10,
              formatter(val) {
                return val;
              },
            },
            value: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter(val) {
                return val;
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '14px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: '#373d3f',
              formatter(w) {
                return formatMoney(
                  w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                );
              },
            },
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <Chart
          options={options}
          series={series}
          labels={labels}
          type="donut"
          height={350}
        />
      </CardBody>
    </Card>
  );
};

export default ApexDonutCharts;
