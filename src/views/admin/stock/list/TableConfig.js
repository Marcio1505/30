import React from 'react';
import { formatMoney } from '../../../../utils/formaters';

export const columnDefs = [
  {
    headerName: 'ID',
    field: 'id',
    width: 80,
  },
  {
    headerName: 'Cód. Externo',
    field: 'external_code',
  },
  {
    headerName: 'Produto',
    field: 'product_name',
    width: 130,
  },
  {
    headerName: 'Unidade',
    field: 'unit',
    width: 150,
  },
  {
    headerName: 'Valor Unitário',
    field: 'unit_price',
    cellRendererFramework: (params) =>
      formatMoney(params.data.unit_price, true) || '-',
    width: 150,
  },
  {
    headerName: 'Média das 3',
    field: 'average_price',
    cellRendererFramework: (params) =>
      formatMoney(params.data.average_price, true) || '-',
  },
  {
    headerName: 'CTP',
    field: 'ctp',
    width: 100,
  },
  {
    headerName: 'Total em Estoque',
    field: 'total_stock',
  },
  {
    headerName: 'Saldo em Estoque',
    field: 'stock_balance',
  },
  {
    headerName: 'Ações',
    field: 'actions',
    width: 100,
    cellRendererFramework: ({ data }) => <div className="d-flex"></div>,
  },
];
