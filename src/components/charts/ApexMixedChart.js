import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';
import Chart from 'react-apexcharts';
import { formatMoney, formatDateToHumanString } from '../../utils/formaters';

class ApexMixedCharts extends React.Component {
  state = {
    options: {
      chart: {
        stacked: false,
      },
      colors: this.props.themeColors,
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: this.props.labels,
      markers: {
        size: 0,
      },
      legend: {
        offsetY: -10,
      },
      xaxis: {
        type: 'string',
      },
      yaxis: {
        // min: 0,
        tickAmount: 5,
        // title: {
        //   text: this.props.yaxisTitleText
        // },
        labels: {
          show: true,
          align: 'right',
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label',
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          formatter(val, index) {
            return formatMoney(val);
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter(y) {
            if (typeof y !== 'undefined') {
              return formatMoney(y);
            }
            return y;
          },
        },
      },
    },
    series: this.props.series,
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{this.props.title}</CardTitle>
        </CardHeader>
        <CardBody>
          <Chart
            options={this.state.options}
            series={this.state.series}
            type="line"
            height={350}
          />
        </CardBody>
      </Card>
    );
  }
}
export default ApexMixedCharts;
