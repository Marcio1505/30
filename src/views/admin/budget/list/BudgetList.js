import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { Edit } from 'react-feather';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { history } from '../../../../history';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  destroyBudget,
  fetchBudgetsList,
} from '../../../../services/apis/budget.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import BasicListTable from '../../../../components/tables/BasicListTable';

import StatusBadge from '../../../../components/badges/StatusBadge';

import PermissionGate from "../../../../PermissionGate";

const BudgetList = ({ currentCompanyId }) => {
  const intl = useIntl();

  const [rowData, setRowData] = useState([]);

  const loadBudgets = async () => {
    const { data: rowData } = await fetchBudgetsList();
    setRowData(rowData);
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [currentCompanyId]);

  const deleteBudget = async (id) => {
    store.dispatch(applicationActions.hideDialog());
    await destroyBudget({ id });
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: 'Projeto deletado com sucesso',
        hasTimeout: true,
      })
    );
    history.push('/admin/budget/list');
  };

  const defaultColDef = {
    sortable: true,
  };

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      width: 70,
    },
    {
      headerName: intl.formatMessage({ id: 'budgets.name' }),
      field: 'name',
      width: 250,
    },
    {
      headerName: intl.formatMessage({ id: 'budgets.type' }),
      field: 'type',
      width: 150,
    },
    {
      headerName: intl.formatMessage({ id: 'budgets.project' }),
      field: 'project_id',
      width: 150,
      cellRendererFramework: (params) => params.data.project?.name || '-',
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellRendererFramework: (params) => <StatusBadge status={params.value} />,
    },
    {
      headerName: 'Ações',
      field: 'transactions',
      width: 100,
      cellRendererFramework: (params) => (
        <div className="actions cursor-pointer text-success">
          <PermissionGate permissions={'budgets.show'}>
            <Edit
              className="mr-50"
              onClick={() => history.push(`/admin/budget/edit/${params.data.id}`)}
            />
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <PermissionGate permissions={'companies.budgets.index'}>
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="budgets" />}
            breadCrumbActive={<FormattedMessage id="button.list.budget" />}
          />
        </Col>
        <PermissionGate permissions={'companies.budgets.store'}>
        <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
          <Button.Ripple
            className="my-1"
            color="primary"
            onClick={() => history.push('/admin/budget/edit')}
          >
            <FormattedMessage id="button.create.budget" />
          </Button.Ripple>
        </Col>
        </PermissionGate>
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

export default connect(mapStateToProps)(BudgetList);
