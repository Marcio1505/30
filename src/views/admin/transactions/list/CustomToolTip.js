import React, { Component } from 'react';

export default class CustomTooltip extends Component {
  getReactContainerClasses() {
    return ['custom-tooltip'];
  }

  render() {
    const { data } = this.props.api.getDisplayedRowAtIndex(this.props.rowIndex);
    return (
      <div
        className="custom-tooltip"
        style={{ backgroundColor: this.props.color || 'white' }}
      >
        <p>
          <span>{data.id}</span>
        </p>
        <p>
          <span>Country: </span> {data.id}
        </p>
        <p>
          <span>Total: </span> {data.id}
        </p>
      </div>
    );
  }
}
