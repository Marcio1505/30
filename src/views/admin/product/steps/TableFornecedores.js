import React from 'react';
import BasicListTable from '../../../../components/tables/BasicListTable';

// List of suppliers with the last purchase date desde a última compra
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
    width: 300,
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
  },
];

const rowData = [
  { nome: 'Fornecedor A', dataUltimaCompra: '2023-10-01' },
  { nome: 'Fornecedor B', dataUltimaCompra: '2023-09-15' },
  // Adicione mais dados conforme necessário
];
export const TableFornecedores = () => {
  return (
    <BasicListTable
      rowData={rowData}
      columnDefs={columns}
      defaultColDef={{ sortable: false, filter: false }}
    />
  );
};
