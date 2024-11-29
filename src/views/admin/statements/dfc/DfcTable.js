import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import * as Icon from 'react-feather';

import StatementTable from '../../../../components/tables/StatementTable';
import ModalTransactions from '../ModalTransactions';

import { formatMoney } from '../../../../utils/formaters';

const DfcTable = ({ formik, dfcData, excelFileName }) => {
  const [dataMonths, setDataMonths] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cell, setCell] = useState(null);

  const toggleModal = (cell) => {
    setModalOpen(!modalOpen);
    setCell(cell);
  };

  const PercentageCell = (props) =>
    props.value ? `${props.value.toLocaleString('pt-BR') || 0}%` : '-';

  const MoneyCell = (props) => `${formatMoney(props.value || 0, true, {})}`;

  useEffect(() => {
    setDataMonths(
      dfcData?.data?.data_headers.map((header) => ({
        Header: header.value,
        columns: [
          {
            Header: 'Valor ($)',
            accessor: `${header.acessor}.value`,
            Cell: MoneyCell,
          },
          {
            Header: '%',
            accessor: `${header.acessor}.percentage`,
            Cell: PercentageCell,
          },
        ],
      }))
    );
  }, [dfcData]);

  const columns = React.useMemo(
    () => [
      {
        id: 'expander',
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? (
              <Icon.ChevronDown size={24} className="fonticon-wrap" />
            ) : (
              <Icon.ChevronRight size={24} className="fonticon-wrap" />
            )}
          </span>
        ),
        Cell: ({ row }) =>
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {row.isExpanded ? (
                <Icon.ChevronDown size={24} className="fonticon-wrap" />
              ) : (
                <Icon.ChevronRight size={24} className="fonticon-wrap" />
              )}
            </span>
          ) : null,
      },
      {
        Header: 'Categoria',
        Cell: ({ row }) => (
          <span
            style={{
              display: 'block',
              textAlign: 'left',
              paddingLeft: `${row.depth * 2}rem`,
            }}
          >
            {row.original.category}
          </span>
        ),
        accessor: 'category',
      },
      ...dataMonths,
    ],
    [dataMonths]
  );

  return (
    <>
      <ModalTransactions
        modalOpen={modalOpen}
        cell={cell}
        transactionType={cell?.row?.original?.category_type}
        toggleModal={toggleModal}
        formik={formik}
        type="DFC"
      />
      <StatementTable
        data={dfcData?.data?.data_body}
        columns={columns}
        toggleModal={toggleModal}
        type="DFC"
        excelFileName={excelFileName}
      />
    </>
  );
};

DfcTable.propTypes = {
  formik: PropTypes.object.isRequired,
  dfcData: PropTypes.object.isRequired,
  excelFileName: PropTypes.string.isRequired,
};

export default DfcTable;
