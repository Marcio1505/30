import React from 'react';
import { Table } from 'reactstrap';
import BasicListTable from '../../../../components/tables/BasicListTable';

const columns = [
  {
    headerName: 'Fornecedor',
    field: 'nome',
    key: 'nome',
  },
  {
    headerName: 'Data da última compra',
    field: 'dataUltimaCompra',
    key: 'dataUltimaCompra',
  },
];

const rowData = [
  { nome: 'Fornecedor A', dataUltimaCompra: '2023-10-01' },
  { nome: 'Fornecedor B', dataUltimaCompra: '2023-09-15' },
  // Adicione mais dados conforme necessário
];
export const TableFornecedores = () => {
  const columns = [
    {
      title: 'Fornecedor',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Data da última compra',
      dataIndex: 'dataUltimaCompra',
      key: 'dataUltimaCompra',
    },
  ];

  return (
    <BasicListTable
      rowData={rowData}
      columnDefs={columns}
      defaultColDef={{ sortable: false, filter: false }}
    />
  );
};
