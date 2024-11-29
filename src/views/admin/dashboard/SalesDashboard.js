import React, { useEffect, useRef, useState } from 'react';
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
import ApexLineChart from './ApexLineChart';
import ApexMixedChart from '../../../components/charts/ApexMixedChart';
import themeColors from '../../../utils/themeColors';
import { getDashboard } from '../../../services/apis/dashboards.api';
import PermissionGate from '../../../PermissionGate';

const SalesDashboard = ({ currentCompanyId }) => {
  const intl = useIntl();
  const history = useHistory();
  const [competencyDate, setCompetencyDate] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [ebitidaMonths, setEbitidaMonths] = useState(false);
  const prevCompencyDateRef = useRef([]);

  const setInitialStates = () => {
    setDashboard(null);
    setInitialized(false);
  };

  const handleGetDashboard = async (params) => {
    const respGetDashboard = await getDashboard({ params });

    if (respGetDashboard.data) {
      setDashboard(respGetDashboard.data);
    }

    const _ebitidaMonths = Object.values(respGetDashboard.data.arr_ebitda).map(
      (month) => month.value
    );
    _ebitidaMonths.pop();

    setEbitidaMonths(_ebitidaMonths);
  };

  const getDashboardData = async () => {
    setInitialStates();
    if (currentCompanyId && competencyDate.length) {
      const params = `?statement_type=DRE&year=${moment(
        competencyDate[0]
      ).format('YYYY')}`;

      await Promise.all([handleGetDashboard(params)]);

      setInitialized(true);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, [currentCompanyId]);

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
    } else {
      getDashboardData();
    }
    prevCompencyDateRef.current = competencyDate;
  }, [competencyDate]);

  if (!currentCompanyId) {
    history.push(`/admin/company/edit`);
  }

  return (
    <PermissionGate permissions="companies.dashboards.index">
      <Row className="">
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="dashboard.sales" />}
            breadCrumbParents={[
              {
                name: <FormattedMessage id="dashboard" />,
                link: '/',
              },
            ]}
            breadCrumbActive={<FormattedMessage id="dashboard.sales" />}
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
              {/* objetos quadrados do topo */}
              <Row className="match-height mt-2">
                <Col lg="3" sm="6">
                  <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="primary"
                    icon={<Cpu className="primary" size={18} />}
                    statTitle="CAC"
                    statTitleMonth="Mensal"
                    statMonth={
                      dashboard.arr_cac[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.cac
                    }
                    statTitleQuarterly={`${Math.ceil(
                      parseInt(moment(competencyDate[0]).format('MM'), 10) / 3
                    )}º Trimestre`}
                    statQuarterly={
                      dashboard.arr_cac.quarterly[
                        Math.ceil(
                          parseInt(moment(competencyDate[0]).format('MM'), 10) /
                            3
                        ) - 1
                      ].cac
                    }
                    statTitleYearly="Anual"
                    statYearly={dashboard.arr_cac.yearly.cac}
                  />
                </Col>
                <Col lg="3" sm="6">
                  <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="primary"
                    icon={<Cpu className="primary" size={18} />}
                    statTitle="LTV"
                    statTitleMonth="Mensal"
                    statMonth={
                      dashboard.arr_ltv_cac[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.ltv
                    }
                    statTitleQuarterly={`${Math.ceil(
                      parseInt(moment(competencyDate[0]).format('MM'), 10) / 3
                    )}º Trimestre`}
                    statQuarterly={
                      dashboard.arr_ltv_cac.quarterly[
                        Math.ceil(
                          parseInt(moment(competencyDate[0]).format('MM'), 10) /
                            3
                        ) - 1
                      ].ltv
                    }
                    statTitleYearly="Anual"
                    statYearly={dashboard.arr_ltv_cac.yearly.ltv}
                  />
                </Col>
                <Col lg="3" sm="6">
                  <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="primary"
                    icon={<Cpu className="primary" size={18} />}
                    statTitle="LTV/CAC"
                    statTitleMonth="Mensal"
                    statMonthPercentage={
                      dashboard.arr_ltv_cac[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.ltv_cac
                    }
                    statTitleQuarterly={`${Math.ceil(
                      parseInt(moment(competencyDate[0]).format('MM'), 10) / 3
                    )}º Trimestre`}
                    statQuarterlyPercentage={
                      dashboard.arr_ltv_cac.quarterly[
                        Math.ceil(
                          parseInt(moment(competencyDate[0]).format('MM'), 10) /
                            3
                        ) - 1
                      ].ltv_cac
                    }
                    statTitleYearly="Anual"
                    statYearlyPercentage={dashboard.arr_ltv_cac.yearly.ltv_cac}
                  />
                </Col>
                <Col lg="3" sm="6">
                  <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="danger"
                    icon={<Activity className="danger" size={18} />}
                    stat="null"
                    statTitle="Ebitda"
                    statTitleMonth="Mensal"
                    statMonth={
                      dashboard.arr_ebitda[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.value
                    }
                    statMonthPercentage={
                      (dashboard.arr_ebitda[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.percentage ??
                        null) ||
                      null
                    }
                    statTitleYearly={`Acumulado ${moment(
                      competencyDate[0]
                    ).format('YYYY')}`}
                    statYearly={dashboard.arr_ebitda.total?.value}
                    // {Object.values(dashboard.arr_ebitda)
                    //   .map((month) => month.value)
                    //   .reduce((acc, value) => acc + value, 0)}
                    statYearlyPercentage={
                      dashboard.arr_ebitda.total?.percentage || null
                    }
                  />
                </Col>
                <Col lg="6" sm="6">
                  <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="warning"
                    icon={<AlertOctagon className="warning" size={18} />}
                    stat={
                      dashboard.arr_gross_income[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.value
                    }
                    statTitle="Faturamento"
                  />
                </Col>
                <Col lg="6" sm="6">
                  <StatisticsCard
                    hideChart
                    iconRight
                    iconBg="warning"
                    icon={<AlertOctagon className="warning" size={18} />}
                    statTitle="Reembolso"
                    statMonth={
                      dashboard.refunded[
                        moment(competencyDate[0]).format('YYYY_MM')
                      ]?.value
                    }
                    statTitleMonth="Mensal"
                    statYearly={dashboard.refunded?.total?.value}
                    statTitleYearly="Anual"
                  />
                </Col>
              </Row>

              {/* objetos gráfico de linha */}
              <Row className="match-height mt-2">
                <Col lg="6" sm="12">
                  <ApexLineChart
                    themeColors={themeColors.arrayThemeColors}
                    titleText={`Vendas da Semana ( de ${moment(
                      dashboard.arr_sales_week.week.start
                    ).format('DD')} à ${moment(
                      dashboard.arr_sales_week.week.end
                    ).format('DD/MM/YYYY')})`}
                    textData="R$"
                    data={dashboard.arr_sales_week.values.map(
                      (weekDay) => weekDay.value
                    )}
                    categories={[
                      'Dom',
                      'Seg',
                      'Ter',
                      'Qua',
                      'Qui',
                      'Sex',
                      'Sab',
                    ]}
                  />
                </Col>
                <Col lg="6" sm="12">
                  <ApexLineChart
                    themeColors={themeColors.arrayThemeColors}
                    titleText={`Vendas anuais (${moment(
                      competencyDate[0]
                    ).format('YYYY')})`}
                    textData="R$"
                    data={Object.values(dashboard.arr_gross_income).map((val) =>
                      val.value.toFixed(2)
                    )}
                    categories={[
                      'Jan',
                      'Fev',
                      'Mar',
                      'Abr',
                      'Mai',
                      'Jun',
                      'Jul',
                      'Ago',
                      'Set',
                      'Out',
                      'Nov',
                      'Dez',
                    ]}
                  />
                </Col>
              </Row>

              {/* objetos grafico */}
              <Row className="match-height mt-2">
                <Col lg="12" sm="12">
                  <ApexMixedChart
                    title={`Demonstrativo de Resultado (${moment(
                      competencyDate[0]
                    ).format('YYYY')})`}
                    themeColors={[
                      themeColors.info,
                      themeColors.success,
                      themeColors.danger,
                    ]}
                    series={[
                      {
                        name: 'Receita Bruta',
                        type: 'column',
                        data: Object.values(dashboard.arr_gross_income).map(
                          (month) => month.value
                        ),
                      },
                      {
                        name: 'Margem de contribuição',
                        type: 'area',
                        data: Object.values(
                          dashboard.arr_contribution_margin
                        ).map((month) => month.value),
                      },
                      {
                        name: 'Ebitda',
                        type: 'line',
                        data: ebitidaMonths,
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
                </Col>
              </Row>

              {/* objetos grid */}
              {/* <Row className="match-height mt-2">
              <Col lg="12" sm="12">            
                <DispatchedOrders 
                  title={'Resultado Por Projeto'}
                  columns={['Nome do Projeto','Previsão','Resultado']}
                  data={[
                          ['PDCT˜', '500100.86', '450350.99'],
                          ['Viver Bem', '1200000.00', '985345.00'],
                        ]}
                />
              </Col>
            </Row> */}
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

SalesDashboard.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

SalesDashboard.defaultProps = {};

export default connect(mapStateToProps)(SalesDashboard);
