import React, { useState } from 'react';
import { Button } from 'reactstrap';
import DataTable from 'react-data-table-component';
import classnames from 'classnames';
import { Edit, Trash, ChevronDown, Plus, Check } from 'react-feather';

import BudgetCategoriesSidebar from './BudgetCategoriesSidebar';
import Checkbox from '../../../../components/@vuexy/checkbox/CheckboxesVuexy';

import { formatMoney } from '../../../../utils/formaters';

import '../../../../assets/scss/plugins/extensions/react-paginate.scss';
import '../../../../assets/scss/pages/data-list.scss';

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

const ActionsComponent = ({ row, currentData, deleteRow }) => (
  <div className="data-list-action">
    <Edit
      className="cursor-pointer mr-1"
      size={20}
      onClick={() => currentData(row)}
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
        <span className="align-middle">Adicionar Nova Categoria</span>
      </Button>
    </div>
  </div>
);

const BudgetSubcategoriesTable = ({ formik, categories }) => {
  const [currentData, setCurrentData] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const columns = [
    {
      name: 'Categoria',
      selector: 'name',
      sortable: true,
      minWidth: '200px',
      cell: (row) => (
        <p title={row.name} className="text-truncate text-bold-500 mb-0">
          {row.name}
        </p>
      ),
    },
    {
      name: 'Valor',
      selector: 'pivot.value',
      sortable: true,
      cell: (row) => formatMoney(row.pivot.value),
    },
    {
      name: 'Actions',
      sortable: true,
      cell: (row) => (
        <ActionsComponent
          row={row}
          currentData={handleCurrentData}
          deleteRow={handleDelete}
        />
      ),
    },
  ];

  const handleSidebar = (showSidebar, addNew = false) => {
    setShowSidebar(showSidebar);
    if (addNew === true) setCurrentData(null);
  };

  const addNewCategory = (data) => {
    let lastRowId = 0;
    (formik.values.categories || []).forEach((subcategory) => {
      if (subcategory.rowId > lastRowId) {
        lastRowId = subcategory.rowId;
      }
    });
    const newCategory = {
      rowId: lastRowId + 1,
      id: parseInt(data.id, 10),
      name: data.name,
      pivot: {
        value: data.value,
      },
    };
    const newCategories = [...formik.values.categories, newCategory];
    formik.setFieldValue('categories', newCategories);
  };

  const updateCategory = (data) => {
    let newCategories = formik.values.categories.filter(
      (subcategory) => subcategory.rowId !== data.rowId
    );
    newCategories = [
      ...newCategories,
      {
        rowId: data.rowId,
        id: parseInt(data.id),
        name: data.name,
        pivot: {
          value: data.value,
        },
      },
    ];
    formik.setFieldValue('categories', newCategories);
  };

  const handleDelete = (row) => {
    const newCategories = formik.values.categories.filter(
      (subcategory) => subcategory.rowId !== row.rowId
    );
    formik.setFieldValue('categories', newCategories);
  };

  const handleCurrentData = (_currentData) => {
    setCurrentData(_currentData);
    handleSidebar(true);
  };

  return (
    <div className="data-list">
      <DataTable
        columns={columns}
        data={formik.values.categories}
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
      <BudgetCategoriesSidebar
        show={showSidebar}
        category={currentData || {}}
        handleSidebar={handleSidebar}
        addNewCategory={addNewCategory}
        updateCategory={updateCategory}
        categories={categories}
        categoriesTook={formik.values.categories}
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

export default BudgetSubcategoriesTable;
