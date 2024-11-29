import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { Edit } from 'react-feather';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { history } from '../../../../history';

import { fetchProjectsList } from '../../../../services/apis/project.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import BasicListTable from '../../../../components/tables/BasicListTable';

import { formatMoney } from '../../../../utils/formaters';

import PermissionGate from '../../../../PermissionGate';

const ProjectList = ({ currentCompanyId }) => {
  const intl = useIntl();

  const [rowData, setRowData] = useState([]);

  const loadProjects = async () => {
    const { data: _rowData } = await fetchProjectsList();
    setRowData(_rowData);
  };

  useEffect(() => {
    loadProjects();
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
      headerName: intl.formatMessage({ id: 'projects.name' }),
      field: 'name',
      width: 250,
    },
    {
      headerName: intl.formatMessage({ id: 'projects.abbreviation' }),
      field: 'abbreviation',
      width: 150,
    },
    {
      headerName: intl.formatMessage({ id: 'projects.forecasted_revenues' }),
      field: 'forecasted_revenues',
      width: 200,
      cellRendererFramework: (params) => formatMoney(params.value),
    },
    {
      headerName: intl.formatMessage({ id: 'projects.forecasted_expenses' }),
      field: 'forecasted_expenses',
      width: 200,
      cellRendererFramework: (params) => formatMoney(params.value),
    },
    {
      headerName: 'Ações',
      field: 'transactions',
      width: 100,
      cellRendererFramework: (params) => (
        <div className="actions cursor-pointer text-success">
          <PermissionGate permissions="projects.show">
            <Edit
              className="mr-50"
              onClick={() =>
                history.push(`/admin/project/edit/${params.data.id}`)
              }
            />
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <PermissionGate permissions="companies.projects.index">
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="projects" />}
            breadCrumbActive={<FormattedMessage id="button.list.project" />}
          />
        </Col>
        <PermissionGate permissions="companies.projects.store">
          <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
            <Button.Ripple
              className="my-1"
              color="primary"
              onClick={() => history.push('/admin/project/edit')}
            >
              <FormattedMessage id="button.create.project" />
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

ProjectList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(ProjectList);
