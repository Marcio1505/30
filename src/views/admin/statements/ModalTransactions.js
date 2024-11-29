import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

import * as Icon from 'react-feather';
import { fetchTransactionsList } from '../../../services/apis/transaction.api';
import { formatMoney, formatDateToHumanString } from '../../../utils/formaters';
import { addArrayParams } from '../../../utils/queryPramsUtils';

const ModalTransaction = ({
  modalOpen,
  cell,
  type,
  toggleModal,
  transactionType,
  formik,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const mountParams = () => {
    let params = '?is_statement_list=1';

    const array_month_year = cell.column.parent.Header.split('/');
    const moment_date_from = moment(
      `${array_month_year[1]}-${array_month_year[0]}-01`
    );

    const date_from = moment_date_from.format('YYYY-MM-DD');
    const date_to = moment_date_from.endOf('month').format('YYYY-MM-DD');

    if (type === 'DRE') {
      params += `&competency_date_from=${date_from}`;
      params += `&competency_date_to=${date_to}`;
      params += `&show_dre=1`;
    } else if (type === 'DFC') {
      params += `&due_or_payment_date_from=${date_from}`;
      params += `&due_or_payment_date_to=${date_to}`;
      params += `&show_dfc=1`;
    }

    params = addArrayParams(params, [
      ['bank_accounts_ids', formik.values?.bank_accounts_ids.join(',')],
      ['projects_ids', formik.values?.projects_ids.join(',')],
      ['cost_centers_ids', formik.values?.cost_centers_ids.join(',')],
    ]);

    const category_id = cell.row?.original?.category_id;
    if (category_id) {
      params += `&categories_ids[]=${category_id}`;
    }

    return params;
  };

  const loadTransactions = async () => {
    const params = mountParams();
    const { data: dataTransaction } = await fetchTransactionsList({ params });
    setData(dataTransaction);
    setIsLoading(false);
  };

  useEffect(() => {
    if (modalOpen === true) {
      setIsLoading(true);
      loadTransactions();
    }
  }, [modalOpen]);

  let firstColumn = {};
  if (type === 'DRE') {
    firstColumn = {
      name: 'Competência',
      selector: 'competency_date',
      sortable: true,
      cell: (row) => (
        <p className="text-bold-500 mb-0">
          {row.competency_date
            ? formatDateToHumanString(row.competency_date)
            : '-'}
        </p>
      ),
    };
  } else if (type === 'DFC') {
    firstColumn = {
      name: 'Pagamento',
      selector: 'payment_date',
      width: '110px',
      sortable: true,
      cell: (row) => (
        <p className="text-bold-500 mb-0">
          {row.payment_date ? formatDateToHumanString(row.payment_date) : '-'}
        </p>
      ),
    };
  }

  let supplierOrClientColumn = {};
  if (transactionType === 'receivable') {
    supplierOrClientColumn = {
      name: 'Cliente',
      selector: 'client_id',
      minWidth: '200px',
      sortable: true,
      cell: (row) => (
        <p className="text-bold-500 mb-0">{row.client?.company_name}</p>
      ),
    };
  } else if (transactionType === 'payable') {
    supplierOrClientColumn = {
      name: 'Fornecedor',
      selector: 'supplier_id',
      minWidth: '200px',
      sortable: true,
      cell: (row) => (
        <p className="text-bold-500 mb-0">{row.supplier?.company_name}</p>
      ),
    };
  }

  const columns = [
    {
      name: 'Vencimento',
      selector: 'due_date',
      width: '110px',
      sortable: true,
      cell: (row) => (
        <p className="text-bold-500 mb-0">
          {row.due_date ? formatDateToHumanString(row.due_date) : '-'}
        </p>
      ),
    },
    firstColumn,
    {
      name: 'Valor',
      selector: 'transaction_value',
      // minWidth: '120px',
      sortable: true,
      cell: (row) => (
        <p className="text-bold-500 mb-0">
          {formatMoney(row.transaction_value || 0)}
        </p>
      ),
    },
    supplierOrClientColumn,
    {
      name: 'Descrição',
      selector: 'description',
      // minWidth: '200px',
      sortable: true,
      cell: (row) => <p className="text-bold-500 mb-0">{row.description}</p>,
    },
    {
      name: 'Categoria',
      selector: 'category_id',
      // minWidth: '150px',
      sortable: true,
      cell: (row) => <p className="text-bold-500 mb-0">{row.category?.name}</p>,
    },
    {
      name: 'Projetos',
      selector: 'projects',
      // minWidth: '150px',
      sortable: true,
      cell: (row) => (
        <p className="text-bold-500 mb-0">
          {(row.projects || [])
            .map((project) => project.abbreviation)
            .join(', ')}
        </p>
      ),
    },
    {
      name: 'Centros de Custo',
      selector: 'cost_centers',
      // minWidth: '150px',
      sortable: true,
      cell: (row) => (
        <p className="text-bold-500 mb-0">
          {(row.cost_centers || [])
            .map((cost_center) => cost_center.abbreviation)
            .join(', ')}
        </p>
      ),
    },
    {
      name: 'Editar',
      selector: 'category_id',
      width: '80px',
      sortable: false,
      cell: (row) => (
        <p className="text-bold-500 mb-0">
          <Link
            className="ml-1"
            to={{
              pathname:
                parseInt(row.type, 10) === 1
                  ? `/admin/receivable/edit/${row.id}`
                  : `/admin/payable/edit/${row.id}`,
            }}
            target="_blank"
          >
            <Icon.ExternalLink size={20} />
          </Link>
        </p>
      ),
    },
  ];

  //   {
  //     headerName: transactionType === 'payable' ? 'Fornecedor' : transactionType === 'receivable' ? 'Cliente' : '',
  //     field: transactionType === 'payable' ? 'supplier.company_name' : 'client.company_name',
  //     filter: true,
  //     width: 250,
  //     cellRendererFramework: params => {
  //       if (transactionType === 'payable') {
  //         return params.data?.supplier?.company_name;
  //       }
  //       else if (transactionType === 'receivable') {
  //         return params.data?.client?.company_name;
  //       }
  //       return '-'
  //     }
  //   },

  //   {
  //     headerName: "Competência",
  //     field: "competency_date",
  //     width: 150,
  //     cellRendererFramework: params => {
  //       return `${formatDateToHumanString(params.data?.competency_date)}`
  //     },
  //   },

  // ];
  return (
    <>
      {!isLoading && (
        <Modal
          isOpen={modalOpen}
          toggle={toggleModal}
          className="modal-dialog-centered"
          style={{
            maxWidth: '80%',
          }}
        >
          <ModalHeader toggle={toggleModal} className="bg-primary">
            Detalhes
          </ModalHeader>
          <ModalBody className="modal-dialog-centered">
            <DataTable data={data} columns={columns} noHeader />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleModal}>
              Fechar
            </Button>{' '}
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

ModalTransaction.defaultProps = {
  formik: {},
  transactionType: null,
};

ModalTransaction.propTypes = {
  transactionType: PropTypes.string,
  formik: PropTypes.object,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
  currentCompany: state.companies.currentCompany,
  companies: state.companies.companies,
});

export default connect(mapStateToProps)(ModalTransaction);
