import React, { useEffect, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams, NavLink } from 'react-router-dom';
import { FaFileExcel } from 'react-icons/fa';
import moment from 'moment';
import { Card, CardBody, Row, Col, Button, FormGroup, Table } from 'reactstrap';

import SweetAlert from 'react-bootstrap-sweetalert';
import { ExternalLink, FileText } from 'react-feather';

import StatementStatusBadge from './StatementStatusBadge';
import StatementDescription from './StatementDescription';
import PeriodClosure from './PeriodClosure';

import Loading from '../../../../components/loading/Loading';
import CustomDatePicker from '../../../../components/datepicker/CustomDatePicker';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import { history } from '../../../../history';
import { formatMoney } from '../../../../utils/formaters';
import { exportStatementXLS } from '../../../../utils/bankAccounts/exporters';
import '../../../../assets/scss/pages/invoice.scss';

import {
  showBankAccount,
  getStatementBankAccount,
} from '../../../../services/apis/bank_account.api';

import { unbindReconciledTransaction } from '../../../../services/apis/transaction.api';
import { unbindReconciledTransfer } from '../../../../services/apis/transfers.api';
import {
  createCashPeriodClosure,
  destroyCashPeriodClosure,
} from '../../../../services/apis/cash_period_closure.api';

import PermissionGate from '../../../../PermissionGate';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

const BankAccountStatement = ({ currentCompanyId }) => {
  const intl = useIntl();
  const [initialized, setInitialized] = useState(false);
  const [filteredStatements, setFilteredStatements] = useState([]);
  const [bankAccount, setBankAccount] = useState({});
  const [firstCurrentCompanyId, setFirstCurrentCompanyId] = useState(null);
  const [paymentDate, setPaymentDate] = useState([
    moment().format('YYYY-MM-01'),
    moment().format(`YYYY-MM-${moment().daysInMonth()}`),
  ]);

  const BankTitle = () => (
    <>
      Extrato{' '}
      <NavLink to={`/admin/bank-account/edit/${bankAccount.id}`}>
        {bankAccount.name}
      </NavLink>
    </>
  );

  const [
    desvinculedTransactionTransferId,
    setDesvinculedTransactionTransferId,
  ] = useState(null);

  const [
    desvinculedTransactionTransferType,
    setDesvinculedTransactionTransferType,
  ] = useState(null);

  const [showModalDesvinculed, setShowModalDesvinculed] = useState(false);

  const { bank_account_id } = useParams();

  const getBankAccount = async () => {
    const respBankAccount = await showBankAccount({ id: bank_account_id });
    if (respBankAccount.data) {
      setBankAccount(respBankAccount.data);
    }
  };

  const getStatement = async () => {
    const respGetStatement = await getStatementBankAccount({
      params: `?year_month=${moment(paymentDate[0]).format('YYYY-MM')}`,
      id: bank_account_id,
    });

    // if (respGetStatement.status === 200) {
    const _statements = [];
    for (const [key, value] of Object.entries(respGetStatement.data)) {
      _statements.push({
        ...value,
        date: key,
      });
    }

    const newFilteredStatements = _statements.filter((statement) =>
      moment(statement.date).isBetween(
        paymentDate[0],
        paymentDate[1],
        undefined,
        '[]'
      )
    );
    setFilteredStatements(newFilteredStatements);
  };

  const submitDesvinculed = async (transaction) => {
    setDesvinculedTransactionTransferId(transaction.id);
    setDesvinculedTransactionTransferType(transaction.statement_type);

    setShowModalDesvinculed(true);
  };

  const handleStoreCashPeriodClosure = async (date) => {
    await createCashPeriodClosure({
      bankAccountId: bank_account_id,
      date,
    });
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: 'Período encerrado com sucesso',
        hasTimeout: true,
      })
    );
    getInitialValues();
  };

  const handleDestroyCashPeriodClosure = async (cashPeriodId) => {
    const respDestroyCashPeriodClosure = await destroyCashPeriodClosure({
      bankAccountId: bank_account_id,
      cashPeriodId,
    });
    if (respDestroyCashPeriodClosure.status === 204) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Período reaberto com sucesso',
          hasTimeout: true,
        })
      );
      getInitialValues();
    }
  };

  const desvinculedTransaction = async (transactionTransferId) => {
    setShowModalDesvinculed(false);
    if (desvinculedTransactionTransferType === 1) {
      const respUnbindReconciledTransaction = await unbindReconciledTransaction(
        {
          id: transactionTransferId,
        }
      );
      if (respUnbindReconciledTransaction.statusText === 'OK') {
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'success',
            title: 'Sucesso',
            message: 'Transação desvinculada com sucesso',
            hasTimeout: true,
          })
        );
        getInitialValues();
      }
    } else if (desvinculedTransactionTransferType === 2) {
      const respUnbindReconciledTransfer = await unbindReconciledTransfer({
        id: transactionTransferId,
        params: `?bank_account_id=${bank_account_id}`,
      });
      if (respUnbindReconciledTransfer.statusText === 'OK') {
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'success',
            title: 'Sucesso',
            message: 'Transferência desvinculada com sucesso',
            hasTimeout: true,
          })
        );
        getInitialValues();
      }
    }
  };

  const getInitialValues = async () => {
    await Promise.all([getStatement(), getBankAccount()]);
    setInitialized(true);
    setFirstCurrentCompanyId(currentCompanyId);
  };

  useEffect(() => {
    setPaymentDate([
      moment().startOf('month').format('YYYY-MM-DD'),
      moment().endOf('month').format(`YYYY-MM-DD`),
    ]);
  }, []);

  useEffect(() => {
    setInitialized(false);
    getInitialValues();
  }, [paymentDate]);

  useEffect(() => {
    if (firstCurrentCompanyId && currentCompanyId !== firstCurrentCompanyId) {
      history.push(`/admin/bank-account/list`);
    }
  }, [currentCompanyId]);

  const StatementValue = ({ value, className }) => (
    <span className={className}>{formatMoney(value || 0, true)}</span>
  );

  const ExpandableTable = (prop) => {
    const ofxTransactionsNotConciliated = (
      prop.data.ofx_transactions || []
    ).filter((ofx_transaction) => !ofx_transaction.status);
    return (
      <>
        {prop.data.transactions_transfers.length > 0 && (
          <Table responsive striped>
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Movimentação Iuli</th>
                <th style={{ width: '20%' }}>Valor</th>
                <th style={{ width: '20%' }}>Conciliação</th>
              </tr>
            </thead>
            <tbody>
              {prop.data.transactions_transfers.map((statement) => (
                <tr>
                  <td>
                    <StatementDescription statement={statement} />
                  </td>
                  <td>
                    <StatementValue
                      value={statement.payed_value || statement.transfer_value}
                      className={
                        statement.type === 1 ? 'text-success' : 'text-danger'
                      }
                    />
                  </td>
                  <td>
                    <StatementStatusBadge
                      submitDesvinculed={submitDesvinculed}
                      statement={statement}
                      bank_account_id={bank_account_id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {ofxTransactionsNotConciliated.length > 0 && (
          <Table responsive striped>
            <thead>
              <tr>
                <th style={{ width: '60%' }}>
                  Movimentação Banco Não Conciliada
                </th>
                <th style={{ width: '20%' }}>Valor</th>
                <th style={{ width: '20%' }} />
              </tr>
            </thead>
            <tbody>
              {ofxTransactionsNotConciliated.map((ofx_transaction) => {
                let className = 'text-danger';
                if (ofx_transaction.type === 1) {
                  className = 'text-success';
                }
                if (ofx_transaction.type === 3) {
                  className = 'text-info';
                }
                return (
                  <tr>
                    <td className={className}>{ofx_transaction.description}</td>
                    <td>
                      <StatementValue
                        value={ofx_transaction.value}
                        className={className}
                      />
                    </td>
                    <td />
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </>
    );
  };

  const columns = [
    {
      name: 'Data',
      selector: 'date',
      cell: (row) => <>{moment(row.date).format('DD/MM/YYYY')}</>,
    },
    {
      name: 'Movimentação Banco',
      selector: 'ofx_statement',
      cell: (row) => (
        <StatementValue
          value={row.ofx_statement}
          className={row.ofx_statement >= 0 ? 'text-success' : 'text-danger'}
        />
      ),
    },
    {
      name: 'Movimentação Iuli',
      selector: 'iuli_statement',
      cell: (row) => (
        <StatementValue
          value={row.iuli_statement}
          className={row.iuli_statement >= 0 ? 'text-success' : 'text-danger'}
        />
      ),
    },
    {
      name: 'Saldo Banco',
      selector: 'ofx_balance',
      cell: (row) => (
        <StatementValue
          value={row.ofx_balance}
          className={row.ofx_balance >= 0 ? 'text-success' : 'text-danger'}
        />
      ),
    },
    {
      name: 'Saldo Iuli',
      selector: 'iuli_balance',
      cell: (row) => (
        <StatementValue
          value={row.iuli_balance}
          className={row.iuli_balance >= 0 ? 'text-success' : 'text-danger'}
        />
      ),
    },
    {
      cell: (row) => (
        <PermissionGate permissions="bank-accounts.period-closures.index">
          <PeriodClosure
            cashPeriodClosureId={row.cash_period_closure_id}
            date={row.date}
            handleStoreCashPeriodClosure={handleStoreCashPeriodClosure}
            handleDestroyCashPeriodClosure={handleDestroyCashPeriodClosure}
          />
        </PermissionGate>
      ),
    },
  ];

  return (
    <>
      <PermissionGate permissions="api.bank_account.statement">
        <Row>
          <Col md="10" sm="12">
            <Breadcrumbs
              breadCrumbTitle={
                bank_account_id
                  ? `${bank_account_id}`
                  : intl.formatMessage({ id: 'button.create.bank_account' })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({
                    id: 'button.list.bank_account',
                  }),
                  link: '/admin/bank-account/list',
                },
              ]}
              breadCrumbActive={<BankTitle />}
            />
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col sm="4">
                    <FormGroup className="mt-2">
                      <CustomDatePicker
                        handleChangeFilterDate={(dates) =>
                          setPaymentDate(dates)
                        }
                        filterDate={paymentDate}
                        onlyMonths
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="8">
                    <div className="form-group float-right mt-2">
                      <PermissionGate permissions="api.companies.bank_accounts.import-ofx">
                        <Button
                          color="primary"
                          onClick={() =>
                            history.push(
                              `/admin/bank-account/${bank_account_id}/reconciliation`
                            )
                          }
                        >
                          <ExternalLink size="15" />
                          <span className="align-middle ml-50">
                            Conciliações Pendentes
                          </span>
                        </Button>
                      </PermissionGate>
                      <Button
                        color="primary"
                        className="ml-2"
                        onClick={() => window.print()}
                      >
                        <FileText size="15" />
                        <span className="align-middle ml-50">
                          <FormattedMessage id="button.print" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        className="ml-2"
                        onClick={() => exportStatementXLS(filteredStatements)}
                      >
                        <FaFileExcel /> Exportar Excel
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <Card>
                <CardBody>
                  {initialized ? (
                    <div className="invoice-page">
                      <DataTable
                        data={filteredStatements}
                        columns={columns}
                        noHeader
                        expandableRows
                        expandOnRowClicked
                        expandableRowsComponent={<ExpandableTable />}
                      />
                    </div>
                  ) : (
                    <Loading />
                  )}
                </CardBody>
              </Card>
            </Card>
          </Col>
          <div className={showModalDesvinculed ? 'global-dialog' : ''}>
            <SweetAlert
              showCancel
              reverseButtons={false}
              cancelBtnBsStyle="secondary"
              confirmBtnBsStyle="danger"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              warning
              title="Desvincular Conciliação Bancária!"
              show={showModalDesvinculed}
              onConfirm={() =>
                desvinculedTransaction(desvinculedTransactionTransferId)
              }
              onClose={() => setShowModalDesvinculed(false)}
              onCancel={() => setShowModalDesvinculed(false)}
            >
              <h4 className="sweet-alert-text my-2">
                Confirma que deseja desvincular esta conciliação?
              </h4>
            </SweetAlert>
          </div>
        </Row>
      </PermissionGate>
    </>
  );
};

BankAccountStatement.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(BankAccountStatement);
