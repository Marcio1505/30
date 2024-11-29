import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { Edit } from 'react-feather';
import { formatDateToHumanString } from '../../../../utils/formaters';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { history } from '../../../../history';

import { fetchIuliPaymentsList } from '../../../../services/apis/iuli_payment.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import BasicListTable from '../../../../components/tables/BasicListTable';

import PermissionGate from '../../../../PermissionGate';

const IuliPaymentList = ({ currentCompanyId }) => {
  const intl = useIntl();

  const [rowData, setRowData] = useState([]);

  const loadIuliPlans = async () => {
    const { data: _rowData } = await fetchIuliPaymentsList();
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
      headerName: intl.formatMessage({ id: 'iuli_payments.competency_date' }),
      field: 'sale.competency_date',
      cellRendererFramework: (params) =>
        params.data.sale.competency_date
          ? formatDateToHumanString(params.data.sale.competency_date)
          : '-',
      width: 150,
    },
    {
      headerName: intl.formatMessage({ id: 'sale' }),
      field: 'company.sale_id',
      width: 250,
      cellRendererFramework: (params) => (
        <div className="actions cursor-pointer text-success">
          <PermissionGate permissions="isIuliAdmin">
            <a href="#" target="_blank">
              {params.data.sale_id}
              {' - '}
              {params.data.sale.product_name}
            </a>
          </PermissionGate>
        </div>
      ),
    },
    {
      headerName: intl.formatMessage({ id: 'company' }),
      field: 'company.company_name',
      width: 250,
    },
    {
      headerName: intl.formatMessage({ id: 'iuli_payments.months_credit' }),
      field: 'months_credit',
      width: 150,
    },
    {
      headerName: 'Ações',
      field: 'iuli_payments',
      width: 100,
      cellRendererFramework: (params) => (
        <div className="actions cursor-pointer text-success">
          <PermissionGate permissions="isIuliAdmin">
            <Edit
              className="mr-50"
              onClick={() =>
                history.push(`/admin/iuli-payment/edit/${params.data.id}`)
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
            breadCrumbTitle={<FormattedMessage id="iuli_payments" />}
            breadCrumbActive={
              <FormattedMessage id="button.list.iuli_payment" />
            }
          />
        </Col>
        <Col sm="12">
          <Card>
            <CardBody>
              <BasicListTable
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                sortModel={[
                  {
                    colId: 'sale.competency_date',
                    sort: 'desc',
                  },
                ]}
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

IuliPaymentList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(IuliPaymentList);
