import React, { useRef, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useTable, useExpanded } from 'react-table';
import { Button, PopoverBody, Popover } from 'reactstrap';
import { FaChevronRight, FaChevronDown, FaFileExcel } from 'react-icons/fa';
import styled from 'styled-components';
import { DownloadTableExcel } from 'react-export-table-to-excel';

const CustomCel = ({ cell, getCellProps, openModalTransactions }) => {
  const [popoverCategoryOpen, setPopoverCategoryOpen] = useState(false);
  const togglePopoverCategory = () =>
    setPopoverCategoryOpen(!popoverCategoryOpen);
  const popoverCategoryRef = useRef();

  const showToolTip =
    cell.column.Header === 'Categoria' && cell.value.length > 32;

  const openModal =
    cell.value &&
    cell.row.original.category_id &&
    cell.row.original.level === 2 &&
    (cell.column.Header === 'Valor ($)' || cell.column.Header === '%');

  if (showToolTip) {
    return (
      <>
        <td
          className={`${openModal ? 'open-modal ' : ' '} ${
            cell.column?.Header === 'Valor' ? 'td-value ' : ' '
          }`}
          {...cell.getCellProps([
            {
              style: cell.column.style,
            },
            getCellProps(cell),
          ])}
          ref={popoverCategoryRef}
          onMouseEnter={() => setPopoverCategoryOpen(true)}
          onMouseLeave={() => setPopoverCategoryOpen(false)}
        >
          {cell.render('Cell')}
        </td>
        <Popover
          placement="top"
          isOpen={popoverCategoryOpen}
          target={popoverCategoryRef}
          toggle={togglePopoverCategory}
        >
          <PopoverBody>{cell.render('Cell')}</PopoverBody>
        </Popover>
      </>
    );
  }

  return (
    <td
      onClick={() => (openModal ? openModalTransactions(cell) : '')}
      className={`${openModal ? 'open-modal ' : ' '} ${
        cell.column?.Header === 'Valor' ? 'td-value ' : ' '
      }`}
      {...cell.getCellProps([
        {
          style: cell.column.style,
        },
        getCellProps(cell),
      ])}
    >
      {cell.render('Cell')}
    </td>
  );
};

const Styles = styled.div`
  width: 100%;
  text-align: center;
  overflow: hidden;
  max-height: 800px;
  overflow-y: auto;
  overflow-x: auto;

  table {
    border-spacing: 0;
    margin: 0 auto;
    border-collapse: separate;
    table-layout: fixed;
    width: max-content;

    thead tr:first-child {
      text-align: center;
    }

    thead tr:first-child, 
    thead tr:nth-child(2) {
      position: sticky;
      top: 0;
      background: #eee;
      z-index: 2;
    }

    thead tr:nth-child(2) {
      top: 24px;
    }

    tr {
      :last-child {
        td {
          border-bottom: 0;
          background: ${(props) => (props.type === 'DFC' ? '#EEE' : '#FFF')};
        }
      }
    }

    td.td-value {
      min-width: 150px;
      resize: horizontal;
      overflow: hidden;
      white-space: nowrap;
      border: 1px solid #ccc;
    }

    td.open-modal:hover {
      font-weight: 600;
    }

    td:first-child,
    th:first-child {
      position: sticky;
      left: 0;
      z-index: 1;
      text-align: left;
      width: 10px;
      min-width: initial;
      border-right: none;
      background-color: white;
      white-space: nowrap;
    }

    td:nth-child(2),
    th:nth-child(2) {
      position: sticky;
      left: 40px;
      z-index: 1;
      background-color: white;
      white-space: nowrap;
    }

    th {
      position: sticky;
      top: 0;
      background: #eee;
    }

    th:first-child,
    th:nth-child(2) {
      z-index: 3;
      text-align: left;
      border-right: none;
    }

    td:nth-child(2) {
      min-width: 250px;
    }

    td:nth-child(2) span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 250px;
    }

    th,
    td {
      margin: 0;
      padding: 0.2rem 1rem;
      min-width: 80px;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
      font-size: 0.9rem;
      overflow: hidden;
      white-space: nowrap;
      resize: horizontal;

      &::-webkit-resizer {
        display: none;
      }

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const StatementTable = ({
  columns,
  data,
  toggleModal,
  type,
  excelFileName,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded },
    toggleAllRowsExpanded,
  } = useTable(
    {
      columns,
      data,
    },
    useExpanded // Use the useExpanded plugin hook
  );
  const tableRef = useRef(null);

  const isSomeExpanded = () => {
    const arrayExpanded = Object.keys(expanded).map((key) => [
      Number(key),
      expanded[key],
    ]);
    return arrayExpanded.length;
  };

  const handleToggleAllRowsExpanded = () => {
    toggleAllRowsExpanded(!isSomeExpanded());
  };

  const openModalTransactions = (cell) => {
    toggleModal(cell);
  };

  const getCellProps = (cellInfo) => {
    const arrayYearMonth = cellInfo.column.parent?.id.split('/');
    let percentageClass = 'default';
    if (arrayYearMonth?.length) {
      percentageClass =
        cellInfo.row.original?.[
          `monthyear_${arrayYearMonth[1]}_${arrayYearMonth[0]}_percentage_class`
        ];
    }
    if (cellInfo.column.Header === 'Valor' || cellInfo.column.Header === '%') {
      let backgroundColor = '#36BBA4';
      return {
        // style: {
        //   backgroundColor,
        //   color: "white",
        // },
      };
      switch (percentageClass) {
        case 'success':
          backgroundColor = 'green';
          break;
        case 'danger':
          backgroundColor = 'red';
          break;
      }
      return {
        style: {
          backgroundColor,
          color: 'white',
        },
      };
    }
    if (cellInfo.column.id === 'expander') {
      switch (cellInfo.row.original.category_type) {
        case 'receivable':
          return {
            style: {
              borderLeft: '6px solid #28a745',
              width: '50px !important',
            },
          };
        case 'payable':
          return {
            style: {
              borderLeft: '6px solid #dc3545',
              width: '50px !important',
            },
          };
        case 'result':
          return {
            style: {
              borderLeft: '6px solid #6c757d55',
              width: '50px !important',
            },
          };
      }
    }
    return {};
  };

  return (
    <div className="mb-4 mx-2">
      <DownloadTableExcel
        filename={excelFileName}
        sheet={type}
        currentTableRef={tableRef.current}
      >
        <button type="button" className="mt-1 mb-2 btn btn-info">
          <FaFileExcel /> Exportar Excel
        </button>
      </DownloadTableExcel>
      <br />
      <Button.Ripple
        className="mt-1 mb-2"
        color="info"
        onClick={handleToggleAllRowsExpanded}
      >
        {!isSomeExpanded() ? <FaChevronRight /> : <FaChevronDown />}
      </Button.Ripple>
      <Styles type={type}>
        <table ref={tableRef} {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <CustomCel
                      cell={cell}
                      getCellProps={getCellProps}
                      openModalTransactions={openModalTransactions}
                    />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Styles>
    </div>
  );
};

StatementTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  excelFileName: PropTypes.string.isRequired,
};

export default StatementTable;
