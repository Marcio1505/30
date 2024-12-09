import React from 'react';
import { Card, CardBody } from 'reactstrap';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

const IconSection = ({ solid, icon, iconBg }) => (
  <div className="icon-section">
    {solid ? (
      <div
        className="avatar avatar-stats p-50 m-0"
        style={{
          backgroundColor: '#FFF',
        }}
      >
        <div className="avatar-content">{icon}</div>
      </div>
    ) : (
      <div
        className={`avatar avatar-stats p-50 m-0 ${
          iconBg ? `bg-rgba-${iconBg}` : 'bg-rgba-primary'
        }`}
      >
        <div className="avatar-content">{icon}</div>
      </div>
    )}
  </div>
);

IconSection.propTypes = {
  solid: PropTypes.bool,
  icon: PropTypes.node,
  iconBg: PropTypes.string,
};

IconSection.defaultProps = {
  solid: false,
  icon: null,
  iconBg: 'primary',
};

const TitleSection = ({ solid, stat, statTitle }) => (
  <div
    className="title-section"
    style={{
      color: solid && '#FFF',
    }}
  >
    <h2
      style={{
        color: solid && '#FFF',
      }}
      className="text-bold-600 mt-1 mb-25"
    >
      {stat}
    </h2>
    <p className="mb-0">{statTitle}</p>
  </div>
);

const getClassNames = (iconRight, hideChart) => {
  if (!iconRight && !hideChart) {
    return 'flex-column align-items-start';
  }
  if (iconRight) {
    return 'justify-content-between flex-row-reverse align-items-center';
  }
  if (hideChart && !iconRight) {
    return 'justify-content-center flex-column';
  }
  return '';
};

const StatisticsCards = ({
  cardBgColor,
  className,
  iconRight,
  hideChart,
  solid,
  icon,
  iconBg,
  stat,
  statTitle,
  options,
  series,
  type,
  height,
}) => (
  <Card className="mb-0">
    <CardBody
      style={{
        backgroundColor: cardBgColor,
      }}
      className={`${className || 'stats-card-body'} d-flex ${getClassNames(
        iconRight,
        hideChart
      )} ${!hideChart ? 'pb-0' : 'pb-2'} pt-2`}
    >
      <IconSection solid={solid} icon={icon} iconBg={iconBg} />

      <TitleSection solid={solid} stat={stat} statTitle={statTitle} />
    </CardBody>
    {!hideChart && (
      <Chart options={options} series={series} type={type} height={height} />
    )}
  </Card>
);

StatisticsCards.propTypes = {
  cardBgColor: PropTypes.string,
  className: PropTypes.string,
  iconRight: PropTypes.bool,
  hideChart: PropTypes.bool,
  solid: PropTypes.bool,
  icon: PropTypes.node,
  iconBg: PropTypes.string,
  stat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  statTitle: PropTypes.string,
  options: PropTypes.object,
  series: PropTypes.array,
  type: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

StatisticsCards.defaultProps = {
  cardBgColor: '#fff',
  className: 'stats-card-body',
  iconRight: false,
  hideChart: false,
  solid: false,
  iconBg: 'primary',
  height: 100,
};

TitleSection.propTypes = {
  solid: PropTypes.bool,
  stat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  statTitle: PropTypes.string,
};

export default StatisticsCards;
