import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Trash2 } from 'react-feather';
import SweetAlert from 'react-bootstrap-sweetalert';

import Breadcrumbs from '../../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import { store } from '../../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../../new.redux/actions';

import {
  restoreOfxIgnored,
  fetchOfxList,
} from '../../../../../services/apis/ofx_transaction.api';

import '../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../../assets/scss/pages/users.scss';

import BasicListTable from '../../../../../components/tables/BasicListTable';

import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../../utils/formaters';

import PermissionGate from '../../../../../PermissionGate';

const OfxIgnoredList = ({ currentCompanyId, filter }) => {
  const intl = useIntl();

  const { bank_account_id } = useParams();

  const [rowData, setRowData] = useState([]);

  const [RestoreIgnoredId, setRestoreIgnoredId] = useState(null);
  const [showModalRestoreIgnored, setShowModalRestoreIgnored] = useState(false);

  //const params = `?year_month=10-2022&status=9`;
  const params = `?status=9`;

  const loadOfxList = async () => {
    const { data: rowData } = await fetchOfxList({
      id: bank_account_id,
      params,
    });
    setRowData(rowData);
  };

  useEffect(() => {
    loadOfxList();
  }, [currentCompanyId]);

  const submitRestoreIgnored = async (ignoredItems) => {
    setShowModalRestoreIgnored(false);
    let params;
    if (isEmpty(ignoredItems)) {
      params = `?ofx_transaction_id=[${RestoreIgnoredId}]`;
    } else {
      params = `?ofx_transaction_id=[${ignoredItems.map(
        (ignoredItems) => ignoredItems.id
      )}]`;
    }

    const respRestoreOfxIgnored = await restoreOfxIgnored({
      params,
    });
    if (respRestoreOfxIgnored.status === 200) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Transação restaurada com sucesso',
          hasTimeout: true,
        })
      );
      loadOfxList();
    }
  };

  const handleSummaryData = (gridApi) => {
    let ignoredItems = [];
    const selectedRows = gridApi?.current.getSelectedRows();

    if (selectedRows?.length) {
      ignoredItems = selectedRows;
    } else if (gridApi?.current) {
      ignoredItems = (gridApi.current.rowModel?.rowsToDisplay || []).map(
        (row) => row.data
      );
    }
  };

  const handleRestoreGroup = (ignoredItems) => {
    if (isEmpty(ignoredItems)) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Nenhuma transação foi selecionada',
          message: `Selecione pelo menos uma transação para restaurar`,
          confirmBtnText: 'Ok',
          onConfirm: () => {
            store.dispatch(applicationActions.hideDialog());
          },
        })
      );
      return;
    }
    submitRestoreIgnored(ignoredItems);
  };

  const defaultColDef = {
    sortable: true,
  };

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      width: 110,
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellClass: 'small-cell',
    },
    {
      headerName: 'Tipo',
      field: 'type_text',
      width: 250,
    },
    {
      headerName: 'Data',
      field: 'date',
      width: 150,
      cellRendererFramework: (params) => formatDateToHumanString(params.date),
    },
    {
      headerName: 'Valor',
      field: 'value',
      width: 150,
      cellRendererFramework: (params) => formatMoney(params.value),
    },
    {
      headerName: 'Descrição',
      field: 'description',
      width: 350,
    },
    {
      headerName: 'Restaurar',
      field: 'transactions',
      width: 150,
      cellRendererFramework: (params) => (
        <div className="actions cursor-pointer text-danger">
          <Trash2
            className="mr-75"
            onClick={() => {
              setRestoreIgnoredId(params.data.id);
              setShowModalRestoreIgnored(true);
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    handleSummaryData();
  }, [filter]);

  return (
    // <PermissionGate permissions={'companies.projects.index'}>
    <Row className="app-user-list">
      <Col md="8" sm="12">
        <Breadcrumbs
          breadCrumbTitle={<FormattedMessage id="bank_accounts" />}
          breadCrumbParents={[
            {
              name: <FormattedMessage id="button.import.bank_account" />,
              link: `/admin/bank-account/${bank_account_id}/reconciliation`,
            },
          ]}
          breadCrumbActive={
            <FormattedMessage id="button.ignoredofx.bank_account" />
          }
        />
      </Col>

      <Col sm="12">
        <Card>
          <CardBody>
            <BasicListTable
              hasActions
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              handleSummaryData={handleSummaryData}
              handleRestore={handleRestoreGroup}
            />
          </CardBody>
        </Card>
      </Col>
      <div className={showModalRestoreIgnored ? 'global-dialog' : ''}>
        <SweetAlert
          showCancel
          reverseButtons={false}
          cancelBtnBsStyle="secondary"
          confirmBtnBsStyle="danger"
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          warning
          title="Restaurar Transação!"
          show={showModalRestoreIgnored}
          onConfirm={submitRestoreIgnored}
          onClose={() => setShowModalRestoreIgnored(false)}
          onCancel={() => setShowModalRestoreIgnored(false)}
        >
          <h4 className="sweet-alert-text my-2">
            Confirma a restauração desta transação?
          </h4>
        </SweetAlert>
      </div>
    </Row>
    // </PermissionGate>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(OfxIgnoredList);
