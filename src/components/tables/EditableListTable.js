import React, { Component } from 'react';
import {
  Button,
  Progress,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import classnames from 'classnames';
import ReactPaginate from 'react-paginate';
import {
  Edit,
  Trash,
  ChevronDown,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'react-feather';
import { connect } from 'react-redux';
import { history } from '../../history';
import {
  getData,
  getInitialData,
  deleteData,
  updateData,
  addData,
  filterData,
} from '../../redux/actions/data-list';
import Sidebar from './DataListSidebar';
import Chip from '../@vuexy/chips/ChipComponent';
import Checkbox from '../@vuexy/checkbox/CheckboxesVuexy';

import '../../assets/scss/plugins/extensions/react-paginate.scss';
import '../../assets/scss/pages/data-list.scss';

const chipColors = {
  'on hold': 'warning',
  delivered: 'success',
  pending: 'primary',
  canceled: 'danger',
};

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

const ActionsComponent = (props) => (
  <div className="data-list-action">
    <Edit
      className="cursor-pointer mr-1"
      size={20}
      onClick={() => props.currentData(props.row)}
    />
    <Trash
      className="cursor-pointer"
      size={20}
      onClick={() => {
        props.deleteRow(props.row);
      }}
    />
  </div>
);

const CustomHeader = (props) => (
  <div className="data-list-header d-flex justify-content-between flex-wrap">
    <div className="actions-left d-flex flex-wrap">
      <Button
        className="add-new-btn"
        color="primary"
        onClick={() => props.handleSidebar(true, true)}
        outline
      >
        <Plus size={15} />
        <span className="align-middle">Add New</span>
      </Button>
    </div>
  </div>
);

class EditableListTable extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.dataList.data.length !== state.data.length) {
      console.log('props.dataList');
      console.log(props.dataList);
      return {
        data: props.dataList.data,
        allData: props.dataList.allData,
        totalPages: props.dataList.totalPages,
        totalRecords: props.dataList.totalRecords,
        sortIndex: props.dataList.sortIndex,
      };
    }

    // Return null if the state hasn't changed
    return null;
  }

  state = {
    data: [],
    totalPages: 0,
    currentPage: 0,
    columns: [
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        minWidth: '300px',
        cell: (row) => (
          <p title={row.name} className="text-truncate text-bold-500 mb-0">
            {row.name}
          </p>
        ),
      },
      {
        name: 'Category',
        selector: 'category',
        sortable: true,
      },
      {
        name: 'Popularity',
        selector: 'popularity',
        sortable: true,
        cell: (row) => (
          <Progress
            className="w-100 mb-0"
            color={row.popularity.color}
            value={row.popularity.popValue}
          />
        ),
      },
      {
        name: 'Order Status',
        selector: 'order_status',
        sortable: true,
        cell: (row) => (
          <Chip
            className="m-0"
            color={chipColors[row.order_status]}
            text={row.order_status}
          />
        ),
      },
      {
        name: 'Price',
        selector: 'price',
        sortable: true,
        cell: (row) => `$${row.price}`,
      },
      {
        name: 'Actions',
        sortable: true,
        cell: (row) => (
          <ActionsComponent
            row={row}
            getData={this.props.getData}
            parsedFilter={this.props.parsedFilter}
            currentData={this.handleCurrentData}
            deleteRow={this.handleDelete}
          />
        ),
      },
    ],
    allData: [],
    value: '',
    rowsPerPage: 0,
    sidebar: false,
    currentData: null,
    selected: [],
    totalRecords: 0,
    sortIndex: [],
    addNew: '',
  };

  thumbView = this.props.thumbView;

  componentDidMount() {
    this.props.getData(this.props.parsedFilter);
    this.props.getInitialData();
    // console.log('teste')
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.thumbView) {
      this.thumbView = false;
      const columns = [
        {
          name: 'Image',
          selector: 'img',
          minWidth: '220px',
          cell: (row) => <img src={row.img} height="100" alt={row.name} />,
        },
        {
          name: 'Name',
          selector: 'name',
          sortable: true,
          minWidth: '250px',
          cell: (row) => (
            <p title={row.name} className="text-truncate text-bold-500 mb-0">
              {row.name}
            </p>
          ),
        },
        {
          name: 'Category',
          selector: 'category',
          sortable: true,
        },
        {
          name: 'Popularity',
          selector: 'popularity',
          sortable: true,
          cell: (row) => (
            <Progress
              className="w-100 mb-0"
              color={row.popularity.color}
              value={row.popularity.popValue}
            />
          ),
        },
        {
          name: 'Order Status',
          selector: 'order_status',
          sortable: true,
          cell: (row) => (
            <Chip
              className="m-0"
              color={chipColors[row.order_status]}
              text={row.order_status}
            />
          ),
        },
        {
          name: 'Price',
          selector: 'price',
          sortable: true,
          cell: (row) => `$${row.price}`,
        },
        {
          name: 'Actions',
          sortable: true,
          cell: (row) => (
            <ActionsComponent
              row={row}
              getData={this.props.getData}
              parsedFilter={this.props.parsedFilter}
              currentData={this.handleCurrentData}
              deleteRow={this.handleDelete}
            />
          ),
        },
      ];
      this.setState({ columns });
    }
  }

  handleSidebar = (boolean, addNew = false) => {
    this.setState({ sidebar: boolean });
    if (addNew === true) this.setState({ currentData: null, addNew: true });
  };

  handleDelete = (row) => {
    this.props.deleteData(row);
    this.props.getData(this.props.parsedFilter);
    if (this.state.data.length - 1 === 0) {
      const urlPrefix = this.props.thumbView
        ? '/data-list/thumb-view/'
        : '/data-list/list-view/';
      history.push(
        `${urlPrefix}list-view?page=${parseInt(
          this.props.parsedFilter.page - 1
        )}&perPage=${this.props.parsedFilter.perPage}`
      );
      this.props.getData({
        page: this.props.parsedFilter.page - 1,
        perPage: this.props.parsedFilter.perPage,
      });
    }
  };

  handleCurrentData = (obj) => {
    this.setState({ currentData: obj });
    this.handleSidebar(true);
  };

  render() {
    const {
      columns,
      data,
      allData,
      totalPages,
      value,
      rowsPerPage,
      currentData,
      sidebar,
      totalRecords,
      sortIndex,
    } = this.state;
    // console.log({allData})
    // console.log({data})
    // console.log(this.state)
    return (
      <div
        className={`data-list ${
          this.props.thumbView ? 'thumb-view' : 'list-view'
        }`}
      >
        <DataTable
          columns={columns}
          // data={value.length ? allData : data}
          data={allData}
          noHeader
          subHeader
          selectableRows
          responsive
          pointerOnHover
          selectableRowsHighlight
          onSelectedRowsChange={(data) =>
            this.setState({ selected: data.selectedRows })
          }
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              handleSidebar={this.handleSidebar}
              rowsPerPage={10}
              total={totalRecords}
              index={sortIndex}
            />
          }
          sortIcon={<ChevronDown />}
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={{
            color: 'primary',
            icon: <Check className="vx-icon" size={12} />,
            label: '',
            size: 'sm',
          }}
        />
        <Sidebar
          show={sidebar}
          data={currentData}
          updateData={this.props.updateData}
          addData={this.props.addData}
          handleSidebar={this.handleSidebar}
          thumbView={this.props.thumbView}
          getData={this.props.getData}
          addNew={this.state.addNew}
        />
        <div
          className={classnames('data-list-overlay', {
            show: sidebar,
          })}
          onClick={() => this.handleSidebar(false, true)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dataList: state.dataList,
});

export default connect(mapStateToProps, {
  getData,
  deleteData,
  updateData,
  addData,
  getInitialData,
  filterData,
})(EditableListTable);
