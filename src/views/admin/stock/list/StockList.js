import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { PropTypes } from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { addArrayParams } from '../../../../utils/queryPramsUtils';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import NewBasicListTable from '../../../../components/tables/NewBasicListTable';
import StockSummary from '../../../../components/summaries/StockSummary';
import { fetchSalesList } from '../../../../services/apis/sale.api';
import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';
import { fetchCostCentersList } from '../../../../services/apis/cost_center.api';
import { fetchProjectsList } from '../../../../services/apis/project.api';
import { fetchProductsList } from '../../../../services/apis/product.api';
import { fetchCategoriesList } from '../../../../services/apis/category.api';
import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';
import { setFilters } from '../../../../new.redux/sales/sales.actions';
import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';
import { columnDefs } from './TableConfig';
import { exportStockXLS } from './exportStockXLS';
import PermissionGate from '../../../../PermissionGate';

const StockList = ({ companies, filter, setFilters }) => {
  // Vou usar
  const [summaryData, setSummaryData] = useState({});
  const loggedUInUser = useSelector(
    (state) => state.auth.login.values.loggedInUser
  );

  const [reloadSales, setReloadSales] = useState(false);
  const [searchBy, setSearchBy] = useState('');

  const [costCenters, setCostCenters] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({});

  const [initialized, setInitialized] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(50);

  const [rowData, setRowData] = useState([]);

  const [showModalEditGroupSale, setShowModalEditGroupSale] = useState(false);
  const [salesToEdit, setSalesToEdit] = useState([]);
  const [showModalFilterSale, setShowModalFilterSale] = useState(false);

  const handleSummaryData = (gridApi) => {
    const totalValueBalance = gridApi?.total_sales || 0;

    const amountItensActive = gridApi?.total_sales || 0;

    const amountItensExpire = gridApi?.total_sales || 0;

    setSummaryData({
      active: amountItensActive,
      expire: amountItensExpire,
      balance: totalValueBalance,
    });
  };

  const handleEditGroupSale = async (sales) => {
    if (isEmpty(sales)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Nenhuma venda selecionada',
          message: `Selecione pelo menos uma venda para editar em grupo`,
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }
    setShowModalEditGroupSale(true);
    setSalesToEdit(sales);
  };

  const handleExportStockXLS = (sales) => {
    exportStockXLS(sales);
  };

  const getSales = debounce(async ({ searchBy: _searchBy } = {}) => {
    setRowData([]);
    setInitialized(false);

    const {
      filterSaleCompetencyDate,
      filterSaleStatuses,
      filterSaleProducts,
      filterSaleBankAccounts,
      filterSaleCategories,
      filterSaleSources,
      filterInvoiceDate,
      filterInvoiceStatus,
      filterSalesIds,
      filterExternalsIds,
      currentPage,
    } = filter;

    const page = currentPage ? currentPage + 1 : 1;

    let params = `page=${page}&per_page=${dataPerPage}`;

    if (filterSaleCompetencyDate?.[0] && filterSaleCompetencyDate[1]) {
      params += `&date_from=${filterSaleCompetencyDate[0]}&date_to=${filterSaleCompetencyDate[1]}`;
    }
    if (filterInvoiceDate?.[0] && filterInvoiceDate?.[1]) {
      params += `&invoice_date_from=${filterInvoiceDate[0]}&invoice_date_to=${filterInvoiceDate[1]}`;
    }
    if (filterInvoiceStatus && filterInvoiceStatus !== 'all') {
      params += `&nfe_status=${filterInvoiceStatus}`;
    }
    params = addArrayParams(params, [
      ['bank_accounts_ids', filterSaleBankAccounts, 'value'],
      ['categories_ids', filterSaleCategories, 'value'],
      ['statuses', filterSaleStatuses, 'value'],
      ['sources', filterSaleSources, 'value'],
      ['products_ids', filterSaleProducts, 'value'],
      ['sales_ids', filterSalesIds],
      ['externals_ids', filterExternalsIds],
    ]);
    if (_searchBy || searchBy) {
      params += `&search_by=${_searchBy || searchBy}`;
    }
    try {
      const { data, meta, summary } = await fetchSalesList({ params });
      setShowModalFilterSale(false);
      setSummary(summary);
      setRowData(data);
      setPageCount(meta.last_page);
      setDataCount(meta.total);
      setInitialized(true);
    } catch (error) {
      setShowModalFilterSale(true);
      setInitialized(true);
    }
  }, 1000);

  const getBankAccounts = async () => {
    const respBankAccountList = await fetchBankAccountsList();
    const dataBankAccounts = respBankAccountList.data || [];
  };
  const getProducts = async () => {
    const respProducts = await fetchProductsList();
    const dataProducts = respProducts.data || [];
  };
  const getProjects = async () => {
    const respProjects = await fetchProjectsList();
    const dataProjects = respProjects.data || [];
    setProjects(
      dataProjects.map((project) => ({
        ...project,
        label: project.name,
        value: project.id,
      }))
    );
  };

  const getCostCenters = async () => {
    const respCostCenters = await fetchCostCentersList();
    const dataCostCenters = respCostCenters.data || [];
    setCostCenters(
      dataCostCenters.map((costCenter) => ({
        ...costCenter,
        label: costCenter.name,
        value: costCenter.id,
      }))
    );
  };

  const getCategoryOptions = async () => {
    const { data: dataCategories } = await fetchCategoriesList({
      params: '?type=1',
    });
    setCategories(
      dataCategories.map((category) => ({
        ...category,
        value: category.id,
        label: category.name,
      }))
    );
  };

  const fetchData = async () => {
    setInitialized(false);
    await Promise.all([
      getSales(),
      getBankAccounts(),
      getProducts(),
      getCostCenters(),
      getProjects(),
      getCategoryOptions(),
    ]);
    setInitialized(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSummaryData();
  }, [filter, summary]);

  useEffect(() => {
    if (reloadSales) {
      setReloadSales(false);
    }
  }, [reloadSales]);

  useEffect(() => {
    getSales();
  }, [filter]);

  return (
    <Row className="app-user-list">
      <PermissionGate permissions="companies.sales.index">
        <Col md="6" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="stock" />}
            breadCrumbActive={<FormattedMessage id="button.list.stock" />}
          />
        </Col>

        <Col sm="12">
          <StockSummary summaryData={summaryData} />
          <Card>
            <CardBody>
              <NewBasicListTable
                hasSearch={false}
                exportButton
                handleExportXLS={handleExportStockXLS}
                sortModel={[
                  {
                    colId: 'competency_date',
                    sort: 'desc', // 'asc'
                  },
                ]}
                filter={filter}
                setFilters={setFilters}
                handleSummaryData={handleSummaryData}
                handleEditGroup={handleEditGroupSale}
                toggleShowModalFilter={() =>
                  setShowModalFilterSale(!showModalFilterSale)
                }
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                }}
                fetchData={getSales}
                pageCount={pageCount}
                dataCount={dataCount}
                dataPerPage={dataPerPage}
                setDataPerPage={setDataPerPage}
                initialized={initialized}
                dataType="STOCK"
              />
            </CardBody>
          </Card>
        </Col>
      </PermissionGate>
    </Row>
  );
};

StockList.propTypes = {
  companies: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  companies: state.companies,
  filter: state.sales.filter,
});

const mapDispatchToProps = {
  setFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(StockList);
