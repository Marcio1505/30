import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardText,
  CardBody,
  Row,
  Col,
} from 'reactstrap';
import Chart from 'react-apexcharts';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';

// import SalesCard from "./SalesCard"
// import SuberscribersGained from "../../ui-elements/cards/statistics/SubscriberGained"
// import OrdersReceived from "../../ui-elements/cards/statistics/OrdersReceived"
// import AvgSession from "../../ui-elements/cards/analytics/AvgSessions"
// import SupportTracker from "../../ui-elements/cards/analytics/SupportTracker"
// import ProductOrders from "../../ui-elements/cards/analytics/ProductOrders"
// import SalesStat from "../../ui-elements/cards/analytics/Sales"
// import ActivityTimeline from "./ActivityTimeline"
// import DispatchedOrders from "./DispatchedOrders"
import '../../../assets/scss/pages/dashboard-analytics.scss';
import { formatMoney } from '../../../utils/formaters';

import BankAccounts from './BankAccounts';
import Revenue from './Revenue';
import CashFlow from './CashFlow';

import themeColors from '../../../utils/themeColors';

import { indexDashboards } from '../../../services/apis/dashboards.api';

import PermissionGate from '../../../PermissionGate';

const AnalyticsDashboard = ({ currentCompanyId }) => {
  const intl = useIntl();
  const history = useHistory();

  const [paymentsToday, setPaymentsToday] = useState({});
  const [receivablesToday, setReceivablesToday] = useState({});
  const [bankAccountsInfo, setBankAccountsInfo] = useState({});
  const [revenue, setRevenue] = useState({});

  const [initialized, setInitialized] = useState(false);

  const getDashboardData = async () => {
    setInitialized(false);
    if (currentCompanyId) {
      const data = await indexDashboards();

      const receivablesLabels = data.data.receivables_today?.map(
        (receivable) => receivable.transaction_category?.name || 'Indefinido'
      );
      const receivablesSeries = data.data.receivables_today?.map(
        (receivable) => receivable.total_transaction_value
      );
      setReceivablesToday({
        options: {
          colors: [
            themeColors.colors.success.main,
            themeColors.colors.danger.main,
            themeColors.colors.warning.main,
            themeColors.colors.info.main,
            themeColors.colors.warning.light,
            themeColors.colors.info.light,
            themeColors.colors.success.light,
          ],
          labels: receivablesLabels,
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
        },
        series: receivablesSeries,
      });

      const paymentsLabels = data.data.payments_today?.map(
        (receivable) => receivable.transaction_category?.name || 'Indefinido'
      );
      const paymentsSeries = data.data.payments_today?.map(
        (payment) => payment.total_transaction_value
      );
      setPaymentsToday({
        options: {
          colors: [
            themeColors.colors.danger.main,
            themeColors.colors.success.main,
            themeColors.colors.warning.main,
            themeColors.colors.info.main,
            themeColors.colors.warning.light,
            themeColors.colors.info.light,
            themeColors.colors.success.light,
          ],
          labels: paymentsLabels,
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
        },
        series: paymentsSeries,
      });

      setBankAccountsInfo(data.data.bank_accounts || []);

      setRevenue({
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          colors: themeColors.arrayThemeColors,
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
            offsetY: -10,
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
              text: '$ (thousands)',
            },
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter(val) {
                return `$ ${val} thousands`;
              },
            },
          },
        },
        series: [
          {
            name: 'Revenue',
            data: data.data.month_revenues.map((revenue) =>
              parseFloat(revenue || 0).toFixed(2)
            ),
          },
        ],
      });
      setInitialized(true);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, [currentCompanyId]);

  if (!currentCompanyId) {
    history.push(`/admin/company/edit`);
  }

  return (
    <>
      <Helmet>
        <title>Iuli - Dashboard</title>
      </Helmet>
      {initialized && (
        <PermissionGate permissions="companies.dashboards.index">
          <Row className="match-height mt-2">
            <Col lg="6" md="12">
              <Row className="match-height">
                <PermissionGate permissions="companies.bank-accounts.index">
                  <Col md="12">
                    {/* <SalesCard /> */}
                    <BankAccounts bankAccountsInfo={bankAccountsInfo} />
                  </Col>
                </PermissionGate>
                <PermissionGate permissions="companies.sales.index">
                  <Col md="12">
                    <Revenue
                      themeColors={themeColors.arrayThemeColors}
                      revenue={revenue}
                    />
                  </Col>
                </PermissionGate>
              </Row>
            </Col>

            <Col lg="6" md="12">
              <Row className="match-height">
                <PermissionGate permissions="companies.payables.index">
                  <Col md="12">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {intl.formatMessage({
                            id: 'dashboard.payments_today',
                          })}
                        </CardTitle>
                        <CardText className="font-small-4">
                          {`${formatMoney(
                            paymentsToday.series?.reduce(
                              (acc, payment) => acc + payment,
                              0
                            )
                          )}`}
                        </CardText>
                      </CardHeader>
                      <CardBody>
                        {Boolean(paymentsToday.series?.length) && (
                          <Chart
                            options={paymentsToday.options}
                            series={paymentsToday.series}
                            type="pie"
                            height={350}
                          />
                        )}
                        {!paymentsToday.series?.length && (
                          <p className="text-center">
                            Não há contas a pagar hoje
                          </p>
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                </PermissionGate>
                <PermissionGate permissions="companies.receivables.index">
                  <Col md="12">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {intl.formatMessage({
                            id: 'dashboard.receivables_today',
                          })}
                        </CardTitle>
                        <CardText className="font-small-4">
                          {` ${formatMoney(
                            receivablesToday.series.reduce(
                              (acc, receivable) => acc + receivable,
                              0
                            )
                          )}`}
                        </CardText>
                      </CardHeader>
                      <CardBody>
                        {Boolean(receivablesToday.series?.length) && (
                          <Chart
                            options={receivablesToday.options}
                            series={receivablesToday.series}
                            type="pie"
                            height={350}
                          />
                        )}
                        {!receivablesToday.series?.length && (
                          <p className="text-center">
                            Não há contas a receber hoje
                          </p>
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                </PermissionGate>
              </Row>
            </Col>
          </Row>
          <Row className="match-height">
            <Col md="12">
              <PermissionGate permissions="api.statements.getDfc">
                <CashFlow
                  themeColors={[
                    themeColors.success,
                    themeColors.danger,
                    themeColors.primary,
                  ]}
                />
              </PermissionGate>
            </Col>
          </Row>
          {/* 
          <Row className="match-height">
            <Col lg="6" md="12">
              <SalesCard />
            </Col>
            <Col lg="3" md="6" sm="12">
              <SuberscribersGained />
            </Col>
            <Col lg="3" md="6" sm="12">
              <OrdersReceived />
            </Col>
          </Row>
          <Row className="match-height">
            <Col md="6" sm="12">
              <AvgSession labelColor={colors.label_color} primary={colors.primary} />
            </Col>
            <Col md="6" sm="12">
              <SupportTracker
                primary={colors.primary}
                danger={colors.danger}
                white={colors.white}
              />
            </Col>
          </Row>
          <Row className="match-height">
            <Col lg="4">
              <ProductOrders
                primary={colors.primary}
                warning={colors.warning}
                danger={colors.danger}
                primaryLight={colors.primary_light}
                warningLight={colors.warning_light}
                dangerLight={colors.danger_light}
              />
            </Col>
            <Col lg="4">
              <SalesStat
                strokeColor={colors.stroke_color}
                infoLight={colors.info_light}
                primary={colors.primary}
                info={colors.info}
              />
            </Col>
            <Col lg="4">
              <ActivityTimeline />
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <DispatchedOrders />
            </Col>
          </Row> */}
        </PermissionGate>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

AnalyticsDashboard.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

AnalyticsDashboard.defaultProps = {};

export default connect(mapStateToProps)(AnalyticsDashboard);
