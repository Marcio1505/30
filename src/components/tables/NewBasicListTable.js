import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import {
  Input,
  UncontrolledButtonDropdown,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import {
  Check,
  ChevronDown,
  File,
  Download,
  Edit,
  Trash,
  Filter,
  Calendar,
  Briefcase,
  Box,
  Plus,
  Upload,
} from 'react-feather';
import Loading from '../loading/Loading';
import BasicPagination from '../pagination/BasicPagination';
import { ContextLayout } from '../../utility/context/Layout';
import { getPageSizeLabel } from '../../utils/tableUtils';

import '../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../assets/scss/pages/users.scss';
import '../../assets/scss/plugins/extensions/react-paginate.scss';

import PermissionGate from '../../PermissionGate';

const BasicListTable = ({
  rowData,
  columnDefs,
  defaultColDef,
  sortModel,
  handleSummaryData,
  handleStoreGroupInvoice,
  handleEditGroup,
  handleExportXLS,
  handleImportXLS,
  handleShowReport,
  handleWriteGroup,
  handleDestroyGroup,
  toggleShowModalFilter,
  hasActions,
  hasFilters,
  isActiveFilterByDate,
  isActiveFilterByStatus,
  isActiveFilterByProduct,
  isActiveFilterByBankAccount,
  isActiveFilterBySource,
  isActiveFilterByInvoiceDate,
  isActiveFilterByInvoiceStatus,
  filter,
  setFilters,
  fetchData,
  pageCount,
  dataCount,
  dataType,
  // currentPage,
  // setCurrentPage,
  dataPerPage,
  setDataPerPage,
  searchBy,
  setSearchBy,
  order,
  setOrder,
  initialized,
  customMenu,
  hasSearch,
}) => {
  const gridApi = useRef();
  const gridColumnApi = useRef();
  const firstRenderForFilter = useRef(true);
  const firstRenderForDataPerPage = useRef(true);
  const firstRenderForSearchBy = useRef(true);
  const firstRenderForOrder = useRef(true);

  let permissionDeleteGroup = null;
  let permissionUpdateGroup = null;
  let permissionExport = null;
  let permissionImport = null;
  let permissionReport = null;

  switch (dataType) {
    case 'RECEIVABLE':
      permissionDeleteGroup = 'receivables.destroy';
      permissionUpdateGroup = 'receivables.updateGroup';
      permissionExport = 'receivables.export';
      permissionImport = 'receivables.import';
      permissionReport = 'receivables.report';
      break;
    case 'PAYABLE':
      permissionDeleteGroup = 'payables.destroy';
      permissionUpdateGroup = 'payables.updateGroup';
      permissionExport = 'payables.export';
      permissionImport = 'payables.import';
      permissionReport = 'payables.report';
      break;
    case 'SALE':
      permissionDeleteGroup = 'sales.destroy';
      permissionUpdateGroup = 'api.companies.sales.update-group';
      permissionExport = 'exportar_planilha_vendas';
      permissionImport = 'api.companies.sales.import';
      permissionReport = 'sales.report';
      break;
    case 'STOCK':
      permissionDeleteGroup = 'sales.destroy';
      permissionUpdateGroup = 'api.companies.sales.update-group';
      permissionExport = 'exportar_planilha_vendas';
      permissionImport = 'api.companies.sales.import';
      permissionReport = 'sales.report';
      break;
    default:
      break;
  }

  const onSelectionChanged = () => {
    handleSummaryData(gridApi);
  };

  const onFilterChanged = () => {
    gridApi.current.deselectAll();
    handleSummaryData(gridApi);
  };

  const onSortChanged = () => {
    const sortModel = gridApi.current.getSortModel();
    setOrder({
      by: sortModel[0]?.colId,
      type: sortModel[0]?.sort,
    });
  };

  const onGridReady = (params) => {
    gridApi.current = params.api;
    gridColumnApi.current = params.columnApi;
    if (sortModel) {
      gridApi.current.setSortModel(sortModel);
    }
    handleSummaryData(gridApi);
  };

  const onPageChange = (page) => {
    setFilters({
      filters: {
        ...filter,
        currentPage: page.selected,
      },
    });
  };

  useEffect(() => {
    if (firstRenderForDataPerPage.current) {
      firstRenderForDataPerPage.current = false;
      return;
    }
    setFilters({
      filters: {
        ...filter,
        currentPage: 0,
      },
    });
  }, [dataPerPage]);

  const loadDataAfterSearching = useCallback(
    debounce((_searchBy) => {
      fetchData({
        order: {
          by: sortModel[0]?.colId,
          type: sortModel[0]?.sort,
        },
        searchBy: _searchBy,
      });
    }, 1000),
    [filter]
  );

  useEffect(() => {
    if (firstRenderForSearchBy.current) {
      firstRenderForSearchBy.current = false;
    } else {
      loadDataAfterSearching(searchBy);
    }
  }, [searchBy]);

  useEffect(() => {
    if (firstRenderForOrder.current) {
      firstRenderForOrder.current = false;
    } else {
      fetchData({
        order,
        searchBy,
      });
    }
  }, [order]);

  return (
    <div style={{ minHeight: '500px' }}>
      {!initialized && <Loading />}
      <>
        <div className="ag-theme-material ag-grid-table">
          <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
            <div className="sort-dropdown">
              <UncontrolledDropdown className="ag-dropdown p-1">
                <DropdownToggle tag="div">
                  {getPageSizeLabel(
                    filter.currentPage || 0,
                    dataPerPage,
                    dataCount
                  )}
                  <ChevronDown className="ml-50" size={15} />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag="div" onClick={() => setDataPerPage(50)}>
                    50
                  </DropdownItem>
                  <DropdownItem tag="div" onClick={() => setDataPerPage(100)}>
                    100
                  </DropdownItem>
                  <DropdownItem tag="div" onClick={() => setDataPerPage(200)}>
                    200
                  </DropdownItem>
                  <DropdownItem tag="div" onClick={() => setDataPerPage(500)}>
                    500
                  </DropdownItem>
                  <DropdownItem tag="div" onClick={() => setDataPerPage(1000)}>
                    1000
                  </DropdownItem>
                  <DropdownItem tag="div" onClick={() => setDataPerPage(5000)}>
                    5000
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
            <div className="filter-actions d-flex">
              {customMenu}
              {hasFilters && (
                <Button
                  onClick={toggleShowModalFilter}
                  className="mr-2 btn-info btn small"
                >
                  <span className="d-flex">
                    <Filter />
                    {isActiveFilterByDate && (
                      <Calendar size={20} className="ml-1" />
                    )}
                    {isActiveFilterByProduct && (
                      <Box size={20} className="ml-1" />
                    )}
                    {isActiveFilterByBankAccount && (
                      <Briefcase size={20} className="ml-1" />
                    )}
                    {isActiveFilterByStatus && (
                      <Plus size={20} className="ml-1" />
                    )}
                    {isActiveFilterBySource && (
                      <Plus size={20} className="ml-1" />
                    )}
                    {isActiveFilterByInvoiceDate && (
                      <Plus size={20} className="ml-1" />
                    )}
                    {isActiveFilterByInvoiceStatus && (
                      <Plus size={20} className="ml-1" />
                    )}
                  </span>
                </Button>
              )}
              {Boolean(hasSearch) && (
                <Input
                  className="w-100 mr-1 mb-1 mb-sm-0"
                  type="text"
                  placeholder="buscar..."
                  readOnly={!initialized}
                  onChange={(e) => setSearchBy(e.target.value)}
                  value={searchBy}
                />
              )}

              {Boolean(hasActions) && (
                <div className="dropdown actions-dropdown">
                  <UncontrolledButtonDropdown>
                    <DropdownToggle className="px-2 py-75 d-flex" color="white">
                      Ações
                      <ChevronDown className="ml-50" size={15} />
                    </DropdownToggle>
                    <DropdownMenu right>
                      {Boolean(handleEditGroup) && (
                        <PermissionGate permissions={permissionUpdateGroup}>
                          <DropdownItem
                            tag="a"
                            onClick={() => {
                              const rows = gridApi.current.getSelectedRows();
                              handleEditGroup(rows);
                            }}
                          >
                            <Edit size={15} />
                            <span className="align-middle ml-50">
                              Editar Selecionadas
                            </span>
                          </DropdownItem>
                        </PermissionGate>
                      )}

                      {Boolean(handleStoreGroupInvoice) && (
                        <PermissionGate permissions="api.companies.store-group-invoices">
                          <DropdownItem
                            tag="a"
                            onClick={() => {
                              const sales = gridApi.current.getSelectedRows();
                              handleStoreGroupInvoice(sales);
                            }}
                          >
                            <File size={15} />
                            <span className="align-middle ml-50">
                              Emitir NFs
                            </span>
                          </DropdownItem>
                        </PermissionGate>
                      )}

                      {Boolean(handleExportXLS) && (
                        <PermissionGate permissions={permissionExport}>
                          <DropdownItem
                            tag="a"
                            onClick={() => {
                              const sales = gridApi.current.getSelectedRows();
                              handleExportXLS(sales);
                            }}
                          >
                            <Download size={15} />
                            <span className="align-middle ml-50">
                              Exportar XLSX
                            </span>
                          </DropdownItem>
                        </PermissionGate>
                      )}

                      {Boolean(handleImportXLS) && (
                        <PermissionGate permissions={permissionImport}>
                          <DropdownItem tag="a" onClick={handleImportXLS}>
                            <Upload size={15} />
                            <span className="align-middle ml-50">
                              Importar XLSX
                            </span>
                          </DropdownItem>
                        </PermissionGate>
                      )}

                      {Boolean(handleShowReport) && (
                        <DropdownItem
                          tag="a"
                          onClick={() => {
                            const rows = gridApi.current.getSelectedRows();
                            handleShowReport(rows);
                          }}
                        >
                          <File size={15} />
                          <span className="align-middle ml-50">Relatório</span>
                        </DropdownItem>
                      )}

                      {Boolean(handleWriteGroup) && (
                        <PermissionGate permissions={permissionUpdateGroup}>
                          <DropdownItem
                            tag="a"
                            onClick={() => {
                              const rows = gridApi.current.getSelectedRows();
                              handleWriteGroup(rows);
                            }}
                          >
                            <Check size={15} />
                            <span className="align-middle ml-50">
                              Alterar Baixa em Lote
                            </span>
                          </DropdownItem>
                        </PermissionGate>
                      )}

                      {Boolean(handleDestroyGroup) && (
                        <PermissionGate permissions={permissionDeleteGroup}>
                          <DropdownItem
                            tag="a"
                            onClick={() => {
                              const rows = gridApi.current.getSelectedRows();
                              handleDestroyGroup(rows);
                            }}
                          >
                            <Trash size={15} />
                            <span className="align-middle ml-50">
                              Apagar em Lote
                            </span>
                          </DropdownItem>
                        </PermissionGate>
                      )}
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </div>
              )}
            </div>
          </div>
          {rowData !== null ? (
            <ContextLayout.Consumer>
              {(context) => (
                <>
                  <AgGridReact
                    alwaysShowHorizontalScroll
                    scrollbarWidth="16"
                    defaultColDef={defaultColDef}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    rowSelection="multiple"
                    onGridReady={onGridReady}
                    suppressPaginationPanel
                    animateRows
                    onSelectionChanged={onSelectionChanged}
                    onFilterChanged={onFilterChanged}
                    onSortChanged={onSortChanged}
                    resizable
                    enableRtl={context.state.direction === 'rtl'}
                    enableCellTextSelection
                  />
                </>
              )}
            </ContextLayout.Consumer>
          ) : null}
        </div>
        <BasicPagination
          currentPage={filter.currentPage}
          totalPages={pageCount}
          onPageChange={onPageChange}
        />
      </>
    </div>
  );
};

BasicListTable.propTypes = {
  rowData: PropTypes.array,
  columnDefs: PropTypes.array,
  defaultColDef: PropTypes.object,
  sortModel: PropTypes.array,
  handleSummaryData: PropTypes.func,
  handleStoreGroupInvoice: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  handleEditGroup: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  handleExportXLS: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  handleImportXLS: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  handleShowReport: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  handleDestroyGroup: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  handleWriteGroup: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  toggleShowModalFilter: PropTypes.func,
  hasActions: PropTypes.bool,
  hasFilters: PropTypes.bool,
  isActiveFilterByDate: PropTypes.bool,
  isActiveFilterByStatus: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isActiveFilterByProduct: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isActiveFilterByBankAccount: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isActiveFilterBySource: PropTypes.bool,
  isActiveFilterByInvoiceDate: PropTypes.bool,
  isActiveFilterByInvoiceStatus: PropTypes.bool,
  filter: PropTypes.object,
  setFilters: PropTypes.func,
  fetchData: PropTypes.func,
  pageCount: PropTypes.number,
  dataCount: PropTypes.number,
  dataType: PropTypes.string,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  dataPerPage: PropTypes.number,
  setDataPerPage: PropTypes.func,
  searchBy: PropTypes.string,
  setSearchBy: PropTypes.func,
  order: PropTypes.object,
  setOrder: PropTypes.func,
  initialized: PropTypes.bool,
  customMenu: PropTypes.element,
  hasSearch: PropTypes.bool,
};

BasicListTable.defaultProps = {
  rowData: [],
  columnDefs: [],
  defaultColDef: {},
  sortModel: [{ colId: 'confirmation_date', sort: 'desc' }],
  handleSummaryData: () => null,
  handleStoreGroupInvoice: false,
  handleEditGroup: false,
  handleExportXLS: false,
  handleImportXLS: false,
  handleShowReport: false,
  handleDestroyGroup: false,
  handleWriteGroup: false,
  toggleShowModalFilter: () => null,
  hasActions: false,
  hasFilters: false,
  isActiveFilterByDate: false,
  isActiveFilterByStatus: false,
  isActiveFilterByProduct: false,
  isActiveFilterByBankAccount: false,
  isActiveFilterBySource: false,
  isActiveFilterByInvoiceDate: false,
  isActiveFilterByInvoiceStatus: false,
  fetchData: () => null,
  pageCount: 1,
  dataCount: 0,
  dataType: '',
  // currentPage: 0,
  // setCurrentPage: () => null,
  dataPerPage: 0,
  setDataPerPage: () => null,
  searchBy: '',
  setSearchBy: () => null,
  order: '',
  setOrder: () => null,
  initialized: false,
  customMenu: null,
  hasSearch: true,
};

export default BasicListTable;
