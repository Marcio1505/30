import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Edit, Eye, Copy } from 'react-feather';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { history } from '../../../../history';

import { listProductLinksByCompany } from '../../../../services/apis/product_link.api';

import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import BasicListTable from '../../../../components/tables/BasicListTable';

import { formatMoney } from '../../../../utils/formaters';

import ProductLinkStatusBadge from '../../../../components/badges/ProductLinkStatusBadge';

import PermissionGate from "../../../../PermissionGate";

const ProductLinkList = ({ currentCompanyId, companies }) => {
  const currentCompany = companies.find(
    (company) => currentCompanyId === company.id
  );

  const intl = useIntl();

  const [rowData, setRowData] = useState([]);

  const loadProductLinks = async () => {
    const { data: rowData } = await listProductLinksByCompany();
    setRowData(rowData);
  };

  useEffect(() => {
    loadProductLinks();
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
      width: 80,
    },
    {
      headerName: intl.formatMessage({ id: 'product_links.name' }),
      field: 'name',
      width: 250,
    },
    {
      headerName: intl.formatMessage({ id: 'product_links.price' }),
      field: 'price',
      width: 150,
      cellRendererFramework: (params) => formatMoney(params.value, true),
    },
    {
      headerName: intl.formatMessage({ id: 'product_links.url' }),
      field: 'url',
      width: 150,
      cellRendererFramework: (params) => (
        <>
          <a href={params.value} target="_blank" rel="noreferrer">
            <Eye />
          </a>
          <CopyToClipboard className="ml-1" text={params.value}>
            <a href={void 0}>
              <Copy />
            </a>
          </CopyToClipboard>
        </>
      ),
    }, 
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellRendererFramework: (params) => (
        <ProductLinkStatusBadge
          status={params.value}
          endDate={params.data.end_date}
        />
      ),
    },
    {
      headerName: 'Ações',
      field: 'transactions',
      width: 100,
      cellRendererFramework: (params) => (
        <PermissionGate permissions={'product-links.show'}>
          <div className="actions cursor-pointer text-success">
            <Edit
              className="mr-50"
              onClick={() =>
                history.push(`/admin/product-link/edit/${params.data.id}`)
              }
            />
          </div>
        </PermissionGate>
      ),
    },
  ];

  return (
    <PermissionGate permissions={'api.companies.product-links.list-by-company'}>
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="product_links" />}
            breadCrumbActive={<FormattedMessage id="button.list.product_link" />}
          />
        </Col>
        {Boolean(parseInt(currentCompany?.integrations?.asaas_status, 10)) && 
        (
          <PermissionGate permissions={'companies.products.product-links.store'}>
            <Col className="d-flex justify-content-end flex-wrap" md="4" sm="12">
              <Button.Ripple
                className="my-1"
                color="primary"
                onClick={() => history.push('/admin/product-link/edit')}
              >
                <FormattedMessage id="button.create.product_link" />
              </Button.Ripple>
            </Col>
          </PermissionGate>
        )}
        <Col sm="12">
          <Card>
            <CardBody>
              {parseInt(currentCompany?.integrations?.asaas_status, 10) ? 
              (
                <BasicListTable
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                />
              ) : (
                <>
                  Para criar links de pagamentos, habilite a função Conta Iuli nas
                  {` `}
                  <Link to={`/admin/company/edit/${currentCompanyId}`}>
                    configurações de sua empresa
                  </Link>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </PermissionGate>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  companies: state.companies.companies,
});

export default connect(mapStateToProps)(ProductLinkList);
