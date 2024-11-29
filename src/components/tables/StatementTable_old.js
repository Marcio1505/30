import React from 'react';
import { useTable, useExpanded } from 'react-table';
import styled from 'styled-components';

const Styles = styled.div`
  width: 100%;
  text-align: right;
  overflow: auto;

  table {
    border-spacing: 0;
    margin: 0 auto;
    border-collapse: separate;

    thead tr:first-child {
      text-align: center;
    }

    tr {
      :last-child {
        td {
          border-bottom: 0;
          background: ${(props) => (props.type === 'DFC' ? '#EEE' : '#FFF')};
        }
      }
      :first-child {
        td {
          background: ${(props) => (props.type === 'DFC' ? '#EEE' : '#FFF')};
        }
      }
    }

    td.open-modal {
      cursor: pointer;
    }

    td.td-value {
      min-width: 150px;
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
    }

    td:nth-child(2),
    th:nth-child(2) {
      position: sticky;
      left: 40px;
      z-index: 1;
      background-color: white;
    }

    th {
      position: sticky;
      top: 0;
      background: #eee;
      /* z-index:2; */
    }

    th:first-child,
    th:nth-child(2) {
      z-index: 3;
      text-align: left;
    }

    td:nth-child(2) {
      min-width: 250px;
    }

    th,
    td {
      margin: 0;
      padding: 0.7rem 1rem;
      min-width: 80px;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const StatementTableOld = ({ columns, data, toggleModal, type }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded },
  } = useTable(
    {
      columns,
      data,
    },
    useExpanded // Use the useExpanded plugin hook
  );

  const openModalTransactions = (cell) => {
    toggleModal(cell);
  };

  const getCellProps = (cellInfo) => {
    // console.log(cellInfo.column.parent?.id)
    const arrayYearMonth = cellInfo.column.parent?.id.split('/');
    // console.log({arrayYearMonth})
    let percentageClass = 'default';
    if (arrayYearMonth?.length) {
      // console.log('dasdasd')
      // console.log(cellInfo.row.original?.[`monthyear_${arrayYearMonth[1]}_${arrayYearMonth[0]}_percentage_class`])
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
      <Styles type={type}>
        <table {...getTableProps()}>
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
                  {row.cells.map((cell) => {
                    // console.log({cell})
                    // console.log(cell.column.Header);
                    const openModal =
                      cell.value &&
                      (cell.row.original.transaction_category_id ||
                        cell.row.original
                          .transaction_subcategory_first_level_id) &&
                      (cell.column.Header === 'Valor' ||
                        cell.column.Header === '%');
                    return (
                      <td
                        onClick={() =>
                          openModal ? openModalTransactions(cell) : ''
                        }
                        className={`${openModal ? 'open-modal ' : ' '} ${
                          cell.column?.Header === 'Valor' ? 'td-value ' : ' '
                        }`}
                        {...cell.getCellProps([
                          {
                            // className: cell.column.className,
                            style: cell.column.style,
                          },
                          getCellProps(cell),
                        ])}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Styles>
    </div>
  );
};

export default StatementTableOld;
