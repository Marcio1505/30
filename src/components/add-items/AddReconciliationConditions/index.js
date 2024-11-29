import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';
import { Button } from 'reactstrap';
import DataTable from 'react-data-table-component';
import classnames from 'classnames';
import { Edit, Trash, ChevronDown, Plus, Check } from 'react-feather';

import ReconciliationConditionSidebar from './ReconciliationConditionsSidebar';
import Checkbox from '../../@vuexy/checkbox/CheckboxesVuexy';

import '../../../assets/scss/plugins/extensions/react-paginate.scss';
import '../../../assets/scss/pages/data-list.scss';

import { formatMoney, getMonetaryValue } from '../../../utils/formaters';

const selectedStyle = {
  rows: {
    selectedHighlighStyle: {
      backgroundColor: 'rgba(115,103,240,.05)',
      color: '#7367F0 !important',
      boxShadow: '0 0 1px 0 #7367F0 !important',
      '&:hover': {
        transform: 'translateY(0px) !important',
      },
    },
  },
};

const ActionsComponent = ({ row, handleCurrentData, deleteRow }) => (
  <div className="data-list-action">
    <Edit
      className="cursor-pointer mr-1"
      size={20}
      onClick={() => handleCurrentData(row)}
    />
    <Trash
      className="cursor-pointer"
      size={20}
      onClick={() => {
        deleteRow(row);
      }}
    />
  </div>
);

const CustomHeader = ({ handleSidebar }) => (
  <div className="data-list-header d-flex justify-content-between flex-wrap">
    <div className="actions-left d-flex flex-wrap">
      <Button
        className="add-new-btn"
        color="primary"
        onClick={() => handleSidebar(true, true)}
        outline
      >
        <Plus size={15} />
        <span className="align-middle">Adicionar Nova Condição</span>
      </Button>
    </div>
  </div>
);

const ViewConditionsTable = ({ formik }) => {
  const [currentData, setCurrentData] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);

  const intl = useIntl();

  const getRowFieldLabel = (field) => {
    switch (field) {
      case 'AMOUNT':
        return 'Valor';
      case 'DESCRIPTION':
        return 'Descrição';
      case 'DAY':
        return 'Dia';
      default:
        return field;
    }
  };

  const getRowOperatorLabel = (operator) => {
    switch (operator) {
      case 'EQUAL':
        return 'Igual';
      case 'DIFFERENT':
        return 'Diferente';
      case 'CONTAINS':
        return 'Contém';
      case 'NOT_CONTAINS':
        return 'Não contém';
      case 'GREATER':
        return 'Maior que';
      case 'LESS':
        return 'Menor que';
      case 'GREATER_OR_EQUAL':
        return 'Maior ou igual';
      case 'LESS_OR_EQUAL':
        return 'Menor ou igual';
      default:
        return operator;
    }
  };

  const columns = [
    {
      name: 'Campo',
      selector: 'field',
      sortable: true,
      minWidth: '130px',
      cell: (row) => (
        <p title={row.field} className="text-truncate text-bold-500 mb-0">
          {getRowFieldLabel(row.field)}
        </p>
      ),
    },
    {
      name: 'Operador',
      selector: 'operator',
      sortable: true,
      cell: (row) => (
        <p title={row.operator} className="text-truncate text-bold-500 mb-0">
          {getRowOperatorLabel(row.operator)}
        </p>
      ),
    },
    {
      name: 'Valor',
      selector: 'value',
      sortable: true,
      cell: (row) => (
        <p title={row.value} className="text-truncate text-bold-500 mb-0">
          {row.value}
        </p>
      ),
    },
    {
      name: 'Actions',
      sortable: true,
      maxWidth: '100px',
      cell: (row) => (
        <ActionsComponent
          row={row}
          handleCurrentData={handleCurrentData}
          deleteRow={handleDelete}
        />
      ),
    },
  ];

  const handleSidebar = (showSidebar, addNew = false) => {
    setShowSidebar(showSidebar);
    if (addNew === true) setCurrentData(null);
  };

  const addReconciliationCondition = (data) => {
    let lastRowId = 0;
    (formik.values.conditions || []).forEach((condition) => {
      if (condition.rowId > lastRowId) {
        lastRowId = condition.rowId;
      }
    });
    const newReconciliationCondition = {
      rowId: lastRowId + 1,
      id: parseInt(data.id),
      field: data.field,
      operator: data.operator,
      value: data.value,
    };
    const newReconciliationConditions = [
      ...formik.values.conditions,
      newReconciliationCondition,
    ];

    formik.setFieldValue('conditions', newReconciliationConditions);
  };

  const updateReconciliationCondition = (data) => {
    let newReconciliationConditions = formik.values.conditions.filter(
      (condition) => condition.rowId !== data.rowId
    );
    newReconciliationConditions = [
      ...newReconciliationConditions,
      {
        rowId: data.rowId,
        id: parseInt(data.id, 10),
        field: data.field,
        operator: data.operator,
        value: data.value,
      },
    ];
    formik.setFieldValue('conditions', newReconciliationConditions);
  };

  const handleDelete = (row) => {
    const newReconciliationConditions = formik.values.conditions.filter(
      (condition) => condition.rowId !== row.rowId
    );
    formik.setFieldValue('conditions', newReconciliationConditions);
  };

  const handleCurrentData = (_currentData) => {
    setCurrentData(_currentData);
    handleSidebar(true);
  };

  return (
    <div className="data-list">
      <DataTable
        columns={columns}
        data={formik.values.conditions}
        noDataComponent={intl.formatMessage({
          id: 'datatable.noData.conditions',
        })}
        noHeader
        subHeader
        subHeaderComponent={<CustomHeader handleSidebar={handleSidebar} />}
        responsive
        pointerOnHover
        customStyles={selectedStyle}
        sortIcon={<ChevronDown />}
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={{
          color: 'primary',
          icon: <Check className="vx-icon" size={12} />,
          label: '',
          size: 'sm',
        }}
      />
      <ReconciliationConditionSidebar
        show={showSidebar}
        reconciliationCondition={currentData || {}}
        handleSidebar={handleSidebar}
        addReconciliationCondition={addReconciliationCondition}
        updateReconciliationCondition={updateReconciliationCondition}
      />
      <div
        className={classnames('data-list-overlay', {
          show: showSidebar,
        })}
        onClick={() => handleSidebar(false, true)}
      />
    </div>
  );
};

ViewConditionsTable.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default ViewConditionsTable;
