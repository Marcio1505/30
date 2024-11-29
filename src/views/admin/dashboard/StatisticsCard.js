import React from 'react';
import { Card, CardBody } from 'reactstrap';
import Chart from 'react-apexcharts';
import { formatMoney } from '../../../utils/formaters';

const StatisticsCards = ({
  statPercentage,
  stat,
  statPredict,
  cardBgColor,
  className,
  icon,
  iconBg,
  iconRight,
  hideChart,
  solid,
  statTitle,
  statMonth,
  statMonthPercentage,
  statQuarterly,
  statTitleQuarterly,
  statQuarterlyPercentage,
  statYearly,
  statYearlyPercentage,
  statTitleYearly,
  statTitleMonth,
  options,
  series,
  type,
  height,
}) => {
  const percentage = statPredict
    ? ((stat / statPredict) * 100).toFixed(2)
    : null;
  const color = percentage < 100 ? 'danger' : 'success';

  return (
    <Card className="mb-0">
      <CardBody
        style={{
          backgroundColor: cardBgColor,
        }}
        className={`${className || 'stats-card-body'} d-flex ${
          !iconRight && !hideChart
            ? 'flex-column align-items-start'
            : iconRight
            ? 'justify-content-between flex-row-reverse align-items-center'
            : hideChart && !iconRight
            ? 'justify-content-center flex-column'
            : null
        } ${!hideChart ? 'pb-0' : 'pb-2'} pt-2`}
      >
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
              className={`avatar avatar-stats p-30 m-0 ${
                iconBg ? `bg-rgba-${iconBg}` : 'bg-rgba-primary'
              }`}
            >
              <div className="avatar-content">{icon}</div>
            </div>
          )}
        </div>
        <div
          className="title-section"
          style={{
            color: solid && '#FFF',
          }}
        >
          <h3
            style={{
              color: solid && '#FFF',
            }}
            className="text-bold-600 mt-1 mb-25"
          >
            <p className="mb-0">{statTitle}</p>
          </h3>

          {(stat || stat == 0) && stat != 'null' && (
            <h3
              style={{
                color: solid && '#FFF',
              }}
              className="text-bold-600 mt-1 mb-25"
            >
              {formatMoney(stat, 2)}
            </h3>
          )}

          {(statMonth || statMonth == 0) && statTitleMonth && (
            <h6
              style={{
                color: solid && '#FFF',
              }}
              className="mb-0 text-bold-600 mt-1 mb-25"
            >
              {statTitleMonth}: {formatMoney(statMonth, 2)}
              {((statMonthPercentage || statMonthPercentage == 0) && statMonthPercentage != '') && (
                <span>
                    &nbsp;({statMonthPercentage}%)
                </span>
              )}
            </h6>
          )}

          {!statMonth && statTitleMonth && (statMonthPercentage || statMonthPercentage == 0) && (
            <h6
              style={{
                color: solid && '#FFF',
              }}
              className="mb-0 text-bold-600 mt-1 mb-25"
            >
              {statTitleMonth}: {parseFloat(statMonthPercentage).toFixed(2).replace('.', ',')}
              
            </h6>
          )}

          {(statQuarterly || statQuarterly == 0) && statTitleQuarterly && (
            <h6
              style={{
                color: solid && '#FFF',
              }}
              className="mb-0 text-bold-600 mt-1 mb-25"
            >
              {statTitleQuarterly}: {formatMoney(statQuarterly, 2)}
            </h6>
          )}

          {!statQuarterly && statTitleQuarterly && (statQuarterlyPercentage || statQuarterlyPercentage == 0) && (
            <h6
              style={{
                color: solid && '#FFF',
              }}
              className="mb-0 text-bold-600 mt-1 mb-25"
            >
              {statTitleQuarterly}: {parseFloat(statQuarterlyPercentage).toFixed(2).replace('.', ',')}
            </h6>
          )}

          {(statYearly || statYearly == 0) && statTitleYearly && (
            <h6
              style={{
                color: solid && '#FFF',
              }}
              className="mb-0 text-bold-600 mt-1 mb-25"
            >
              {statTitleYearly}: {formatMoney(statYearly, 2)}
              {((statYearlyPercentage || statYearlyPercentage == 0) && statYearlyPercentage != '') && (
                <span>
                    &nbsp;({statYearlyPercentage}%)
                </span>
              )}
            </h6>
          )}

          {!statYearly && statTitleYearly && (statYearlyPercentage || statYearlyPercentage == 0) && (
            <h6
              style={{
                color: solid && '#FFF',
              }}
              className="mb-0 text-bold-600 mt-1 mb-25"
            >
              {statTitleYearly}: {parseFloat(statYearlyPercentage).toFixed(2).replace('.', ',')}
            </h6>
          )}

          {statPercentage && (
            <h3
              style={{
                color: solid && '#FFF',
              }}
            >
              {statPercentage}

              {statPredict && <h6>Prev: {formatMoney(statPredict, 2)}</h6>}
            </h3>
          )}

          {percentage && (
            <h6 className={color}>
              {percentage}%<h6>Prev: {formatMoney(statPredict, 2)}</h6>
            </h6>
          )}
        </div>
      </CardBody>
      {!hideChart && (
        <Chart
          options={options}
          series={series}
          type={type}
          height={height || 100}
        />
      )}
    </Card>
  );
};

export default StatisticsCards;
