import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
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
  ChevronDown,
  File,
  Download,
  Edit,
  Filter,
  Briefcase,
  Box,
  Plus,
  Upload,
  Trash,
  Check,
} from 'react-feather';

import {
  FaCalendar,
  FaFileInvoice,
  FaCheck,
  FaFileExport,
} from 'react-icons/fa';

import { ContextLayout } from '../../utility/context/Layout';
import { getPageSizeLabel } from '../../utils/tableUtils';
import '../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../assets/scss/pages/users.scss';

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
  handleRestore,
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
  dataType,
  handleWriteGroup,
  handleDestroyGroup,
  // fetchData,
}) => {
  const gridApi = useRef();
  const gridColumnApi = useRef();
  const [pageSize, setPageSize] = useState(200);
  const [searchVal, setSearchVal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  let permissiomTransactionDeleteGroup = null;
  let permissiomTransactionUpdateGroup = null;
  let permissiomTransactionExport = null;
  let permissiomTransactionImport = null;
  let permissiomTransactionReport = null;

  if (dataType === 'RECEIVABLE') {
    permissiomTransactionDeleteGroup = 'receivables.destroy';
    permissiomTransactionUpdateGroup = 'receivables.updateGroup';
    permissiomTransactionExport = 'receivables.export';
    permissiomTransactionImport = 'receivables.import';
    permissiomTransactionReport = 'receivables.report';
  } else if (dataType === 'PAYABLE') {
    permissiomTransactionDeleteGroup = 'payables.destroy';
    permissiomTransactionUpdateGroup = 'payables.updateGroup';
    permissiomTransactionExport = 'payables.export';
    permissiomTransactionImport = 'payables.import';
    permissiomTransactionReport = 'payables.report';
  }

  const onPaginationChanged = () => {
    setCurrentPage(gridApi.current?.paginationProxy?.currentPage || 0);
    // if (gridApi.current) {
    //   fetchData(gridApi.current);
    // }
  };
  const onSelectionChanged = () => {
    handleSummaryData(gridApi);
  };
  const onFilterChanged = () => {
    gridApi.current.deselectAll();
    handleSummaryData(gridApi);
  };
  const onGridReady = (params) => {
    gridApi.current = params.api;
    gridColumnApi.current = params.columnApi;
    if (sortModel) {
      gridApi.current.setSortModel(sortModel);
    }
    handleSummaryData(gridApi);
  };
  const filterSize = (val) => {
    if (gridApi.current) {
      gridApi.current.paginationSetPageSize(Number(val));
      setPageSize(val);
    }
  };
  const updateSearchQuery = (val) => {
    gridApi.current.setQuickFilter(val);
    setSearchVal(val);
  };

  return (
    <div className="ag-theme-material ag-grid-table allow-text-selection">
      <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
        <div className="sort-dropdown">
          <UncontrolledDropdown className="ag-dropdown p-1">
            <DropdownToggle tag="div">
              {getPageSizeLabel(currentPage, pageSize, rowData.length)}
              <ChevronDown className="ml-50" size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag="div" onClick={() => filterSize(10)}>
                10
              </DropdownItem>
              <DropdownItem tag="div" onClick={() => filterSize(20)}>
                20
              </DropdownItem>
              <DropdownItem tag="div" onClick={() => filterSize(50)}>
                50
              </DropdownItem>
              <DropdownItem tag="div" onClick={() => filterSize(100)}>
                100
              </DropdownItem>
              <DropdownItem tag="div" onClick={() => filterSize(100)}>
                200
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <div className="filter-actions d-flex">
          {hasFilters && (
            <Button
              onClick={toggleShowModalFilter}
              className="mr-2 btn-info btn small"
            >
              <span className="d-flex">
                <Filter />
                {isActiveFilterByDate && (
                  <FaCalendar size={20} className="ml-1" />
                )}
                {isActiveFilterByProduct && <Box size={20} className="ml-1" />}
                {isActiveFilterByBankAccount && (
                  <Briefcase size={20} className="ml-1" />
                )}
                {isActiveFilterByStatus && (
                  <FaCheck size={20} className="ml-1" />
                )}
                {isActiveFilterBySource && <Plus size={20} className="ml-1" />}
                {isActiveFilterByInvoiceDate && (
                  <FaFileInvoice size={20} className="ml-1" />
                )}
                {isActiveFilterByInvoiceStatus && (
                  <FaFileExport size={20} className="ml-1" />
                )}
              </span>
            </Button>
          )}
          <Input
            className="w-100 mr-1 mb-1 mb-sm-0"
            type="text"
            placeholder="buscar..."
            onChange={(e) => updateSearchQuery(e.target.value)}
            value={searchVal}
          />
          {Boolean(hasActions) && (
            <div className="dropdown actions-dropdown">
              <UncontrolledButtonDropdown>
                <DropdownToggle className="px-2 py-75 d-flex" color="white">
                  Ações
                  <ChevronDown className="ml-50" size={15} />
                </DropdownToggle>
                <DropdownMenu right>
                  {Boolean(handleEditGroup) && (
                    <PermissionGate
                      permissions={permissiomTransactionUpdateGroup}
                    >
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
                        <span className="align-middle ml-50">Emitir NFs</span>
                      </DropdownItem>
                    </PermissionGate>
                  )}
                  {Boolean(handleExportXLS) && (
                    <PermissionGate permissions={permissiomTransactionExport}>
                      <DropdownItem
                        tag="a"
                        onClick={() => {
                          const salectedRows =
                            gridApi.current.getSelectedRows();
                          handleExportXLS(salectedRows);
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
                    <PermissionGate permissions={permissiomTransactionImport}>
                      <DropdownItem tag="a" onClick={handleImportXLS}>
                        <Upload size={15} />
                        <span className="align-middle ml-50">
                          Importar XLSX
                        </span>
                      </DropdownItem>
                    </PermissionGate>
                  )}
                  {Boolean(handleShowReport) && (
                    <PermissionGate permissions={permissiomTransactionReport}>
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
                    </PermissionGate>
                  )}

                  {Boolean(handleWriteGroup) && (
                    <PermissionGate
                      permissions={permissiomTransactionUpdateGroup}
                    >
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
                    <PermissionGate
                      permissions={permissiomTransactionDeleteGroup}
                    >
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

                  {Boolean(handleRestore) && (
                    // <PermissionGate
                    //   permissions={permissiomTransactionUpdateGroup}
                    // >
                    <DropdownItem
                      tag="a"
                      onClick={() => {
                        const rows = gridApi.current.getSelectedRows();
                        handleRestore(rows);
                      }}
                    >
                      <Edit size={15} />
                      <span className="align-middle ml-50">
                        Restaurar Selecionadas
                      </span>
                    </DropdownItem>
                    // </PermissionGate>
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
            <AgGridReact
              gridOptions={{}}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              rowData={rowData}
              rowSelection="multiple"
              onGridReady={onGridReady}
              pagination
              paginationPageSize={pageSize}
              animateRows
              pivotPanelShow="always"
              onSelectionChanged={onSelectionChanged}
              onFilterChanged={onFilterChanged}
              onPaginationChanged={onPaginationChanged}
              resizable
              enableRtl={context.state.direction === 'rtl'}
              enableCellTextSelection
            />
          )}
        </ContextLayout.Consumer>
      ) : null}
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
  handleRestore: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  handleShowReport: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
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
  dataType: PropTypes.oneOf(['', 'PAYABLE', 'RECEIVABLE']),
  handleWriteGroup: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  handleDestroyGroup: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  // fetchData: PropTypes.func,
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
  handleRestore: false,
  handleShowReport: false,
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
  dataType: '',
  handleWriteGroup: false,
  handleDestroyGroup: false,
  // fetchData: () => null,
};
export default BasicListTable;
