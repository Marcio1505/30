import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { Edit } from 'react-feather';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { history } from '../../../../history';

import { fetchReconciliationRuleList } from '../../../../services/apis/reconciliation_rule.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import BasicListTable from '../../../../components/tables/BasicListTable';

import PermissionGate from '../../../../PermissionGate';

const ReconciliationRuleList = () => {
  const intl = useIntl();

  const [reconciliationRules, setReconciliationRules] = useState([]);

  const loadReconciliationRules = async () => {
    const { data } = await fetchReconciliationRuleList();
    setReconciliationRules(data);
  };

  useEffect(() => {
    loadReconciliationRules();
  }, []);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    minWidth: 70,
  };

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      width: 80,
    },
    {
      headerName: intl.formatMessage({ id: 'reconciliation_rules.name' }),
      field: 'name',
      width: 250,
    },
    {
      headerName: 'Ações',
      field: 'transactions',
      width: 100,
      cellRendererFramework: (params) => (
        <PermissionGate permissions="reconciliation-rules.show">
          <div className="actions cursor-pointer text-success">
            <Edit
              className="mr-50"
              onClick={() =>
                history.push(
                  `/admin/reconciliation-rule/edit/${params.data.id}`
                )
              }
            />
          </div>
        </PermissionGate>
      ),
    },
  ];

  return (
    <PermissionGate permissions="api.companies.reconciliation-rules.list">
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="reconciliation_rules" />}
            breadCrumbActive={
              <FormattedMessage id="button.list.reconciliation_rule" />
            }
          />
        </Col>
        <PermissionGate permissions="companies.reconciliation-rules.store">
          <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
            <Button.Ripple
              className="my-1"
              color="primary"
              onClick={() => history.push('/admin/reconciliation-rule/edit')}
            >
              <FormattedMessage id="button.create.reconciliation_rule" />
            </Button.Ripple>
          </Col>
        </PermissionGate>
        <Col sm="12">
          <Card>
            <CardBody>
              <BasicListTable
                rowData={reconciliationRules}
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

export default ReconciliationRuleList;
