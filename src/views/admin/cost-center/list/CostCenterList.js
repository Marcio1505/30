import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { Edit } from 'react-feather';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { history } from '../../../../history';

import { fetchCostCentersList } from '../../../../services/apis/cost_center.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import BasicListTable from '../../../../components/tables/BasicListTable';

import PermissionGate from '../../../../PermissionGate';

const CostCenterList = ({ currentCompanyId }) => {
  const [rowData, setRowData] = useState([]);

  const intl = useIntl();

  const loadCostCenters = async () => {
    const { data: _rowData } = await fetchCostCentersList();
    setRowData(_rowData);
  };

  useEffect(() => {
    loadCostCenters();
  }, [currentCompanyId]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    minWidth: 70,
  };

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      width: 110,
    },
    {
      headerName: intl.formatMessage({ id: 'cost_centers.name' }),
      field: 'name',
      width: 250,
    },
    {
      headerName: intl.formatMessage({ id: 'cost_centers.abbreviation' }),
      field: 'abbreviation',
      width: 150,
    },
    {
      headerName: 'Ações',
      field: 'transactions',
      width: 100,
      cellRendererFramework: (params) => (
        <div className="actions cursor-pointer text-success">
          <PermissionGate permissions="cost-centers.show">
            <Edit
              className="mr-50"
              onClick={() =>
                history.push(`/admin/cost-center/edit/${params.data.id}`)
              }
            />
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <PermissionGate permissions="companies.cost-centers.index">
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="cost_centers" />}
            breadCrumbActive={<FormattedMessage id="button.list.cost_center" />}
          />
        </Col>
        <PermissionGate permissions="companies.cost-centers.store">
          <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
            <Button.Ripple
              className="my-1"
              color="primary"
              onClick={() => history.push('/admin/cost-center/edit')}
            >
              <FormattedMessage id="button.create.cost_center" />
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

CostCenterList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(CostCenterList);
