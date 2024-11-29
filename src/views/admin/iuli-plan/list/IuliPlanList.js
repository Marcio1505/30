import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { Edit } from 'react-feather';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { history } from '../../../../history';

import { fetchIuliPlansList } from '../../../../services/apis/iuli_plan.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import BasicListTable from '../../../../components/tables/BasicListTable';

import PermissionGate from '../../../../PermissionGate';

const IuliPlanList = ({ currentCompanyId }) => {
  const intl = useIntl();

  const [rowData, setRowData] = useState([]);

  const loadIuliPlans = async () => {
    const { data: _rowData } = await fetchIuliPlansList();
    setRowData(_rowData);
  };

  useEffect(() => {
    loadIuliPlans();
  }, [currentCompanyId]);

  const defaultColDef = {
    sortable: true,
  };

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      width: 110,
    },
    {
      headerName: intl.formatMessage({ id: 'iuli_plans.name' }),
      field: 'name',
      width: 250,
    },
    {
      headerName: intl.formatMessage({ id: 'iuli_plans.months_credit' }),
      field: 'months_credit',
      width: 150,
    },
    {
      headerName: intl.formatMessage({ id: 'iuli_plans.invoices_per_month' }),
      field: 'invoices_per_month',
      width: 150,
    },
    {
      headerName: 'Ações',
      field: 'iuli_plans',
      width: 100,
      cellRendererFramework: (params) => (
        <div className="actions cursor-pointer text-success">
          <PermissionGate permissions="isIuliAdmin">
            <Edit
              className="mr-50"
              onClick={() =>
                history.push(`/admin/iuli-plan/edit/${params.data.id}`)
              }
            />
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <PermissionGate permissions="isIuliAdmin">
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="iuli_plans" />}
            breadCrumbActive={<FormattedMessage id="button.list.iuli_plan" />}
          />
        </Col>
        <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
          <Button.Ripple
            className="my-1"
            color="primary"
            onClick={() => history.push('/admin/iuli-plan/edit')}
          >
            <FormattedMessage id="button.create.iuli_plan" />
          </Button.Ripple>
        </Col>
        <Col sm="12">
          <Card>
            <CardBody>
              <BasicListTable
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </PermissionGate>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

IuliPlanList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(IuliPlanList);
