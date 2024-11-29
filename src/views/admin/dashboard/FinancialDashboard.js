import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Row, Col, FormGroup, Card, CardBody } from 'reactstrap';
import moment from 'moment';
import { FormattedMessage, useIntl } from 'react-intl';
import { Cpu, Server, Activity, AlertOctagon } from 'react-feather';
import CustomDatePicker from '../../../components/datepicker/CustomDatePicker';
import Breadcrumbs from '../../../components/@vuexy/breadCrumbs/BreadCrumb';
import '../../../assets/scss/pages/dashboard-analytics.scss';
import StatisticsCard from './StatisticsCard';
import themeColors from '../../../utils/themeColors';
import {
  getDayBalance,
  getDashboard,
} from '../../../services/apis/dashboards.api';
import ApexDonutChart from './ApexDonutChart';
import ApexMixedChart from '../../../components/charts/ApexMixedChart';

import PermissionGate from '../../../PermissionGate';

const FinancialDashboard = ({ currentCompanyId }) => {
  const [competencyDate, setCompetencyDate] = useState([]);
  const [dayBalance, setDayBalance] = useState(null);
  const [dashboard, setDashboard] = useState({});
  const [initialized, setInitialized] = useState(false);

  const setInitialData = () => {
    setDashboard({});
    setInitialized(false);
  };

  const intl = useIntl();
  const history = useHistory();
  const prevCompencyDateRef = useRef([]);

  const handleGetDashboard = async (params) => {
    const respGetDashboard = await getDashboard({ params });
    if (respGetDashboard.data) {
      setDashboard(respGetDashboard.data);
      console.log(respGetDashboard.data);
    }
  };

  const handleGetDayBalance = async (params) => {
    const respGetDayBalance = await getDayBalance({ params });
    if (respGetDayBalance.data) {
      setDayBalance(respGetDayBalance.data.day_balance);
    }
  };

  const getDashboardData = async () => {
    setInitialData();
    const handleGetDashboardParams = `?statement_type=DFC&year=${moment(
      competencyDate[0]
    ).format('YYYY')}`;
    const params = `?execute=DFC&year_month=${moment(competencyDate[0]).format(
      'MM-YYYY'
    )}`;
    await Promise.all([
      handleGetDashboard(handleGetDashboardParams),
      handleGetDayBalance(params),
    ]);
    setInitialized(true);
  };

  useEffect(() => {
    if (competencyDate[0] && prevCompencyDateRef.current[0]) {
      if (
        !moment(competencyDate[0]).isSame(
          prevCompencyDateRef.current[0],
          'year'
        )
      ) {
        getDashboardData();
      }
    }
    prevCompencyDateRef.current = competencyDate;
  }, [competencyDate]);

  useEffect(() => {
    setInitialized(false);
    getDashboardData();
  }, [currentCompanyId]);

  if (!currentCompanyId) {
    history.push(`/admin/company/edit`);
  }

  return (
    <PermissionGate permissions="companies.dashboards.index">
      <Row className="">
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="dashboard.financial" />}
            breadCrumbParents={[
              {
                name: <FormattedMessage id="dashboard" />,
                link: '/',
              },
            ]}
            breadCrumbActive={<FormattedMessage id="dashboard.financial" />}
          />
        </Col>
        <Col sm="12">
          <Card>
            <CardBody>
              <Row>
                <Col sm="12">
                  <Row>
                    <Col
                      className="d-flex justify-content-start flex-wrap"
                      md="6"
                      sm="12"
                    >
                      <FormGroup>
                        <CustomDatePicker
                          handleChangeFilterDate={(dates) => {
                            setCompetencyDate(dates);
                          }}
                          filterDate={competencyDate}
                          onlyMonths
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
          {initialized && (
            <>
              <Row className="match-height mt-2">
                <Col lg="4" sm="6">
                  {dayBalance === null ? (
                    <>Loading</>
                  ) : (
                    <StatisticsCard
                      hideChart
                      iconRight
                      iconBg="primary"
                      icon={<Cpu className="primary" size={18} />}
                      stat={dayBalance}
                      statTitle="Saldo do dia"
                    />
                  )}
                </Col>
                <Col lg="4" sm="6">
                  {!dashboard.arr_cash_generation ? (
                    <>Loading</>
                  ) : (
                    <StatisticsCard
                      hideChart
                      iconRight
                      iconBg="success"
                      icon={<Server className="success" size={18} />}
                      statTitle={`Geração de Caixa em (${moment(
                        competencyDate[0]
                      ).format('MM/YYYY')})`}
                      stat={
                        dashboard.arr_cash_generation[
                          moment(competencyDate[0]).format('YYYY_MM')
                        ]?.value
                      }
                    />
                  )}
                </Col>
                <Col lg="4" sm="6">
                  {!dashboard.arr_cash_generation ? (
                    <>Loading</>
                  ) : (
                    <StatisticsCard
                      hideChart
                      iconRight
                      iconBg="success"
                      icon={<Server className="success" size={18} />}
                      statTitle={`Geração de Caixa em (${moment(
                        competencyDate[0]
                      ).format('YYYY')})`}
                      stat={dashboard.arr_cash_generation.total.value}
                    />
                  )}
                </Col>
              </Row>
              <Row className="match-height mt-2">
                <Col lg="6" sm="12">
                  <ApexDonutChart
                    themeColors={themeColors.arrayThemeColors}
                    labels={
                      dashboard.arr_inputs?.general?.[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.categories || []
                    }
                    series={
                      dashboard.arr_inputs?.general?.[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.values || []
                    }
                    title="Entradas"
                  />
                </Col>
                <Col lg="6" sm="12">
                  <ApexDonutChart
                    themeColors={themeColors.arrayThemeColors}
                    labels={
                      dashboard.arr_outputs?.general?.[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.categories || []
                    }
                    series={
                      dashboard.arr_outputs?.general?.[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.values || []
                    }
                    title="Saídas"
                  />
                </Col>
              </Row>
              <Row className="match-height mt-2">
                <Col lg="12" sm="12">
                  {!dashboard.arr_outputs.cash_flow &&
                  !dashboard.arr_inputs.cash_flow ? (
                    <>Loading</>
                  ) : (
                    <ApexMixedChart
                      title="Fluxo de Caixa"
                      themeColors={[
                        themeColors.danger,
                        themeColors.success,
                        themeColors.primary,
                      ]}
                      series={[
                        {
                          name: 'Contas a Pagar',
                          type: 'column',
                          data: dashboard.arr_outputs.cash_flow,
                        },
                        {
                          name: 'Contas a Receber',
                          type: 'area',
                          data: dashboard.arr_inputs.cash_flow,
                        },
                        {
                          name: 'Saldo',
                          type: 'line',
                          data: dashboard.arr_balance.values,
                        },
                      ]}
                      labels={[
                        'Janeiro',
                        'Fevereiro',
                        'Março',
                        'Abril',
                        'Maio',
                        'Junho',
                        'Julho',
                        'Agosto',
                        'Setembro',
                        'Outubro',
                        'Novembro',
                        'Dezembro',
                      ]}
                    />
                  )}
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </PermissionGate>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

FinancialDashboard.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

FinancialDashboard.defaultProps = {};

export default connect(mapStateToProps)(FinancialDashboard);
