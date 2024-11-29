import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';
import { Button } from 'reactstrap';
import DataTable from 'react-data-table-component';
import classnames from 'classnames';
import { Edit, Trash, ChevronDown, Plus, Check } from 'react-feather';

import ProjectsSidebar from './ProjectsSidebar';
import Checkbox from '../../@vuexy/checkbox/CheckboxesVuexy';

import '../../../assets/scss/plugins/extensions/react-paginate.scss';
import '../../../assets/scss/pages/data-list.scss';

import { fetchProjectsList } from '../../../services/apis/project.api';

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
        <span className="align-middle">Adicionar Novo Projeto</span>
      </Button>
    </div>
  </div>
);

const ViewProjectsTable = ({ formik }) => {
  const [projects, setProjects] = useState([]);
  const [currentData, setCurrentData] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);

  const intl = useIntl();

  const getInitialData = async () => {
    const { data: dataProjects } = await fetchProjectsList();
    setProjects(
      (dataProjects || []).map((project) => ({
        id: project.id,
        value: project.id,
        label: project.name,
        name: project.name,
      }))
    );
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const columns = [
    {
      name: 'Projeto',
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
      cell: (row) => `${row.pivot.percentage}%`,
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

  const addNewProject = (data) => {
    let lastRowId = 0;
    (formik.values.projects || []).forEach((project) => {
      if (project.rowId > lastRowId) {
        lastRowId = project.rowId;
      }
    });
    const newProject = {
      rowId: lastRowId + 1,
      id: parseInt(data.id),
      name: data.name,
      pivot: {
        percentage: data.percentage,
      },
    };
    const newProjects = [...formik.values.projects, newProject];
    formik.setFieldValue('projects', newProjects);
  };

  const updateProject = (data) => {
    let newProjects = formik.values.projects.filter(
      (project) => project.rowId !== data.rowId
    );
    newProjects = [
      ...newProjects,
      {
        rowId: data.rowId,
        id: parseInt(data.id, 10),
        name: data.name,
        pivot: {
          percentage: data.percentage,
        },
      },
    ];
    formik.setFieldValue('projects', newProjects);
  };

  const handleDelete = (row) => {
    const newProjects = formik.values.projects.filter(
      (project) => project.id !== row.id
    );
    formik.setFieldValue('projects', newProjects);
  };

  const handleCurrentData = (_currentData) => {
    setCurrentData(_currentData);
    handleSidebar(true);
  };

  return (
    <div className="data-list">
      <DataTable
        columns={columns}
        data={formik.values.projects}
        noDataComponent={intl.formatMessage({
          id: 'datatable.noData.projects',
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
      <ProjectsSidebar
        show={showSidebar}
        project={currentData || {}}
        handleSidebar={handleSidebar}
        addNewProject={addNewProject}
        updateProject={updateProject}
        projects={projects}
        projectsTook={formik.values.projects}
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

ViewProjectsTable.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default ViewProjectsTable;
