import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import { useIntl } from 'react-intl';

import { Row, Col } from 'reactstrap';
import { Cpu } from 'react-feather';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  updateClient,
  createClient,
  showClient,
  dashClient,
} from '../../../../services/apis/client.api';

import StatisticsCard from '../dashboard/StatisticsCard';

import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import CompanyForm from '../../company/edit/CompanyForm';

import PermissionGate from '../../../../PermissionGate';

const ClientEdit = ({ currentCompanyId }) => {
  const intl = useIntl();
  const history = useHistory();
  const { company_id } = useParams();
  const [company, setCompany] = useState({});
  const [dash, setDash] = useState({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let dataCompany = {};
      let dataDash = {};
      if (company_id) {
        const clientResp = await showClient({ id: company_id });
        dataCompany = clientResp.data;

        const dashResp = await dashClient({ id: company_id });
        dataDash = dashResp.data;
      }

      setCompany(dataCompany);
      setDash(dataDash);

      setInitialized(true);
    };
    fetchData();
  }, [company_id]);

  const permissionForm = company_id
    ? 'clients.show'
    : 'companies.clients.store';

  useEffect(() => {
    if (company.company_id && currentCompanyId !== company.company_id) {
      history.push(`/admin/client/list`);
    }
  }, [currentCompanyId]);

  const formSubmit = async (payload) => {
    if (company_id) {
      await updateClient(payload);
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Cliente atualizado com sucesso',
          hasTimeout: true,
        })
      );
      history.push(`/admin/client/list`);
    } else {
      const { data } = await createClient(payload);
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Cliente criado com sucesso',
          hasTimeout: true,
        })
      );
      history.push(`/admin/client/list`);
    }
  };

  return (
    <>
      {initialized && (
        <>
          <PermissionGate permissions={permissionForm}>
            <Row>
              <Col sm="12">
                <Breadcrumbs
                  breadCrumbTitle={
                    company_id
                      ? `${company.company_name}`
                      : intl.formatMessage({ id: 'button.create.client' })
                  }
                  breadCrumbParents={[
                    {
                      name: intl.formatMessage({ id: 'button.list.client' }),
                      link: '/admin/client/list',
                    },
                  ]}
                  breadCrumbActive={
                    company_id
                      ? intl.formatMessage({ id: 'button.edit.client' })
                      : intl.formatMessage({ id: 'button.create.client' })
                  }
                />
              </Col>
              {/* Dashboard client */}
              <Col lg="6" sm="6">
                <StatisticsCard
                  hideChart
                  iconRight
                  iconBg="primary"
                  icon={<Cpu className="primary" size={18} />}
                  statTitle="Total Pago"
                  currency
                  stat={dash?.[0]?.TotalPago}
                />
              </Col>
              <Col lg="6" sm="6">
                <StatisticsCard
                  hideChart
                  iconRight
                  iconBg="primary"
                  icon={<Cpu className="primary" size={18} />}
                  statTitle="Quantidade"
                  stat={dash?.[0]?.QtdProdutos}
                />
              </Col>
            </Row>
            <Row>
              <Col>&nbsp;</Col>
            </Row>
            <CompanyForm
              companyType="client"
              company={company}
              companyId={company_id}
              formSubmit={formSubmit}
            />
          </PermissionGate>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(ClientEdit);
