import React from 'react';
import '../../assets/scss/components/app-loader.scss';

class ComponentSpinner extends React.Component {
  render() {
    return (
      <div className="loading-spinner">
        <div className="loading component-loader">
          <div className="effect-1 effects" />
          <div className="effect-2 effects" />
          <div className="effect-3 effects" />
        </div>
      </div>
    );
  }
}

export default ComponentSpinner;
