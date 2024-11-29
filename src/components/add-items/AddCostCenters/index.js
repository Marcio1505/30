import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';
import { Button } from 'reactstrap';
import DataTable from 'react-data-table-component';
import classnames from 'classnames';
import { Edit, Trash, ChevronDown, Plus, Check } from 'react-feather';

import CostCentersSidebar from './CostCentersSidebar';
import Checkbox from '../../@vuexy/checkbox/CheckboxesVuexy';

import '../../../assets/scss/plugins/extensions/react-paginate.scss';
import '../../../assets/scss/pages/data-list.scss';

import { fetchCostCentersList } from '../../../services/apis/cost_center.api';

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
        <span className="align-middle">Adicionar Novo Centro de Custo</span>
      </Button>
    </div>
  </div>
);

const ViewCostCentersTable = ({ formik }) => {
  const [costCenters, setCostCenters] = useState([]);
  const [currentData, setCurrentData] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);

  const intl = useIntl();

  const getInitialData = async () => {
    const { data: dataCostCenters } = await fetchCostCentersList();
    setCostCenters(
      (dataCostCenters || []).map((costCenter) => ({
        id: costCenter.id,
        value: costCenter.id,
        name: costCenter.name,
        label: costCenter.name,
      }))
    );
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const columns = [
    {
      name: 'Centro de Custo',
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
      name: 'Percentual',
      selector: 'pivot.percentage',
      sortable: true,
      cell: (row) => `${row.pivot.percentage} %`,
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

  const addNewCostCenter = (data) => {
    let lastRowId = 0;
    (formik.values.cost_centers || []).forEach((costCenter) => {
      if (costCenter.rowId > lastRowId) {
        lastRowId = costCenter.rowId;
      }
    });
    const newCostCenter = {
      rowId: lastRowId + 1,
      id: parseInt(data.id),
      name: data.name,
      pivot: {
        percentage: data.percentage,
      },
    };
    const newCostCenters = [...formik.values.cost_centers, newCostCenter];
    formik.setFieldValue('cost_centers', newCostCenters);
  };

  const updateCostCenter = (data) => {
    let newCostCenters = formik.values.cost_centers.filter(
      (costCenter) => costCenter.rowId !== data.rowId
    );
    newCostCenters = [
      ...newCostCenters,
      {
        rowId: data.rowId,
        id: parseInt(data.id),
        name: data.name,
        pivot: {
          percentage: data.percentage,
        },
      },
    ];
    formik.setFieldValue('cost_centers', newCostCenters);
  };

  const handleDelete = (row) => {
    const newCostCenters = formik.values.cost_centers.filter(
      (costCenter) => costCenter.id !== row.id
    );
    formik.setFieldValue('cost_centers', newCostCenters);
  };

  const handleCurrentData = (_currentData) => {
    setCurrentData(_currentData);
    handleSidebar(true);
  };

  return (
    <div className="data-list">
      <DataTable
        columns={columns}
        data={formik.values.cost_centers}
        noDataComponent={intl.formatMessage({
          id: 'datatable.noData.cost_centers',
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
      <CostCentersSidebar
        show={showSidebar}
        costCenter={currentData || {}}
        handleSidebar={handleSidebar}
        addNewCostCenter={addNewCostCenter}
        updateCostCenter={updateCostCenter}
        costCenters={costCenters}
        costCentersTook={formik.values.cost_centers}
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

ViewCostCentersTable.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default ViewCostCentersTable;
