import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';
import Chart from 'react-apexcharts';
import { useIntl } from 'react-intl';

import themeColors from '../../../utils/themeColors';

const Revenue = ({ revenue }) => {
  const intl = useIntl();
  const revenueOptions = {
    chart: {
      toolbar: {
        show: false,
        // offsetX: 0,
        // offsetY: 0,
        tools: {
          // download: true,
          // selection: true,
          // zoom: true,
          // zoomin: true,
          // zoomout: true,
          // pan: true,
          // reset: true | '<img src="/static/icons/reset.png" width="20">',
          // customIcons: []
        },
        // export: {
        //   csv: {
        //     filename: undefined,
        //     columnDelimiter: ',',
        //     headerCategory: 'category',
        //     headerValue: 'value',
        //     dateFormatter(timestamp) {
        //       return new Date(timestamp).toDateString()
        //     }
        //   },
        //   svg: {
        //     filename: undefined,
        //   },
        //   png: {
        //     filename: undefined,
        //   }
        // },
        // autoSelected: 'zoom'
      },
    },
    colors: [themeColors.colors.success.main, themeColors.colors.success.light],
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    legend: {
      offsetY: -50,
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dez',
      ],
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {intl.formatMessage({ id: 'dashboard.month_sales' })}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Chart
          options={revenueOptions}
          series={revenue.series}
          type="bar"
          height={350}
        />
      </CardBody>
    </Card>
  );
};
export default Revenue;
