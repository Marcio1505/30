import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  Table,
  UncontrolledTooltip,
  Progress
} from "reactstrap"

import {
  formatMoney,
  getMonetaryValue,
} from '../../../utils/formaters';

import avatar1 from "../../../assets/img/portrait/small/avatar-s-5.jpg"
import avatar2 from "../../../assets/img/portrait/small/avatar-s-7.jpg"
import avatar3 from "../../../assets/img/portrait/small/avatar-s-10.jpg"
import avatar4 from "../../../assets/img/portrait/small/avatar-s-8.jpg"
import avatar5 from "../../../assets/img/portrait/small/avatar-s-1.jpg"
import avatar6 from "../../../assets/img/portrait/small/avatar-s-2.jpg"
import avatar7 from "../../../assets/img/portrait/small/avatar-s-3.jpg"
import avatar8 from "../../../assets/img/portrait/small/avatar-s-4.jpg"

class DispatchedOrders extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{this.props.title}</CardTitle>
        </CardHeader>
        <Table
          responsive
          className="dashboard-table table-hover-animation mb-0 mt-1"
        >
          <thead>
            <tr>
              {this.props.columns.map(d => (<th>{d}</th>))} 
            </tr>
          </thead>
          <tbody>
            {this.props.data.map(d => {
               let percentage = (getMonetaryValue(d[2]) / getMonetaryValue(d[1]) * 100).toFixed(2)
               let color = (percentage < 100) ? 'danger' : 'success'              
              return (                
                <tr>
                  <td>{d[0]}</td>
                  <td>{formatMoney(d[1],2)}</td>
                  <td>
                    <span>
                      {formatMoney(d[2],2)} ({percentage + '%'})          
                    </span>
                    <Progress className="mb-0 mt-1" color={color} value={percentage} />
                  </td>
                </tr>
            )}
            )}
          </tbody>
        </Table>
      </Card>
    )
  }
}
export default DispatchedOrders
