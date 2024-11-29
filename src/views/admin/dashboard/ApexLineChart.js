import React from "react"
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"
import Chart from "react-apexcharts"

import {
  formatMoney,
  getMonetaryValue,
} from '../../../utils/formaters';

class ApexLineCharts extends React.Component {
  state = {
    options: {
      chart: {
        id: "lineChart"
      },
      xaxis: {
        categories: this.props.categories,
      },
      stroke: {
        curve: "straight"
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: 'R$',
        align: "left"
      },
      colors: this.props.themeColors,
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      }
    },
    series: [
      {
        name: this.props.textData,
        data: this.props.data,
        //data: this.props.data?.map(val => formatMoney(val))
      }
    ],
  }

  render() {
  

  return (
      <Card>
        <CardHeader>
          <CardTitle>{this.props.titleText}</CardTitle>
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
    )
  }
}
export default ApexLineCharts
