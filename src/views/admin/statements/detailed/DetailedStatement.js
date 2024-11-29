import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';
import { FormattedMessage, useIntl } from 'react-intl';
import { FaFileExcel } from 'react-icons/fa';
import moment from 'moment';
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  FormGroup,
  Table,
  Label,
} from 'reactstrap';
import Select from 'react-select';
import animatedComponents from 'react-select/animated';
import { FileText } from 'react-feather';
import ApexMixedChart from '../../../../components/charts/ApexMixedChart';
import themeColors from '../../../../utils/themeColors';
import StatementDescription from '../../bank-account/statement/StatementDescription';

import Loading from '../../../../components/loading/Loading';
import CustomDatePicker from '../../../../components/datepicker/CustomDatePicker';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import { formatMoney } from '../../../../utils/formaters';
import { exportStatementXLS } from '../../../../utils/bankAccounts/exporters';
import '../../../../assets/scss/pages/invoice.scss';

import { fetchBankAccountsList } from '../../../../services/apis/bank_account.api';
import { getDetailedStatement } from '../../../../services/apis/statements.api';

import PermissionGate from '../../../../PermissionGate';
import { addArrayParams } from '../../../../utils/queryPramsUtils';

const DetailedStatement = () => {
  const intl = useIntl();
  const [isReady, setIsReady] = useState(false);
  const [bankAccountOptions, setBankAccountOptions] = useState([]);
  const [filteredStatements, setFilteredStatements] = useState([]);
  const [dates, setDates] = useState([]);
  const [totalPayable, setTotalPayable] = useState([]);
  const [totalReceivable, setTotalReceivable] = useState([]);
  const [totalReceivedTransfers, setTotalReceivedTransfers] = useState([]);
  const [totalSentTransfers, setTotalSentTransfers] = useState([]);
  const [balance, setBalance] = useState([]);

  const getStatement = async () => {
    setIsReady(false);
    let params = `?year_month=${moment(formik.values.date[0]).format(
      'YYYY-MM'
    )}`;

    params = addArrayParams(params, [
      ['bank_accounts_ids', formik.values.bank_accounts_ids.join(',')],
    ]);

    const respGetStatement = await getDetailedStatement({ params });

    const _statements = [];
    const _dates = [];
    const _totalPayable = [];
    const _totalReceivable = [];
    const _totalReceivedTransfers = [];
    const _totalSentTransfers = [];
    const _balance = [];

    Object.entries(respGetStatement.data).forEach((statement) => {
      _dates.push(statement[0]);
      _totalPayable.push(statement[1].total_payable);
      _totalReceivable.push(statement[1].total_receivable);
      _totalReceivedTransfers.push(statement[1].total_received_transfers);
      _totalSentTransfers.push(statement[1].total_sent_transfers);
      _balance.push(statement[1].iuli_balance);
      _statements.push({
        ...statement[1],
        date: statement[0],
      });
    });

    const newFilteredStatements = _statements.filter((statement) =>
      moment(statement.date).isBetween(
        formik.values.date[0],
        formik.values.date[1],
        undefined,
        '[]'
      )
    );

    setFilteredStatements(newFilteredStatements);
    setDates(_dates);
    setTotalPayable(_totalPayable);
    setTotalReceivable(_totalReceivable);
    setTotalReceivedTransfers(_totalReceivedTransfers);
    setTotalSentTransfers(_totalSentTransfers);
    setBalance(_balance);
    setIsReady(true);
  };

  const initialValues = {
    bank_accounts_ids: [],
    date: [
      moment().format('YYYY-MM-01'),
      moment().format(`YYYY-MM-${moment().daysInMonth()}`),
    ],
  };

  const validationSchema = Yup.object().shape({
    bank_accounts_ids: Yup.array().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    date: Yup.array().required(intl.formatMessage({ id: 'errors.required' })),
  });

  const onSubmit = () => {
    getStatement();
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  const getBankAccounts = async () => {
    const respBankAccounts = await fetchBankAccountsList();
    if (respBankAccounts.data) {
      setBankAccountOptions(
        respBankAccounts.data.map((bankAccount) => ({
          value: bankAccount.id,
          label: bankAccount.name,
        }))
      );
    }
  };

  useEffect(() => {
    getBankAccounts();
  }, []);

  const StatementValue = ({ value, className }) => (
    <span className={className}>{formatMoney(value || 0, true)}</span>
  );

  const ExpandableTable = (prop) => (
    <>
      {prop.data.transactions_transfers.length > 0 && (
        <Table responsive striped>
          <thead>
            <tr>
              <th style={{ width: '60%' }}>Movimentação Iuli</th>
              <th style={{ width: '20%' }}>Valor</th>
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
                    value={
                      statement.payed_value ||
                      statement.transfer_value ||
                      statement.transaction_value
                    }
                    className={
                      statement.type === 1 ? 'text-success' : 'text-danger'
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );

  const columns = [
    {
      name: 'Data',
      selector: 'date',
      cell: (row) => <>{moment(row.date).format('DD/MM/YYYY')}</>,
    },
    {
      name: 'Recebimentos',
      selector: 'total_receivable',
      cell: (row) => (
        <StatementValue value={row.total_receivable} className="text-success" />
      ),
    },
    {
      name: 'Pagamentos',
      selector: 'total_payable',
      cell: (row) => (
        <StatementValue value={row.total_payable} className="text-danger" />
      ),
    },
    {
      name: 'Transferências (Entrada)',
      selector: 'total_received_transfers',
      cell: (row) => (
        <StatementValue
          value={row.total_received_transfers}
          className="text-success"
        />
      ),
    },
    {
      name: 'Transferências (Saídas)',
      selector: 'total_sent_transfers',
      cell: (row) => (
        <StatementValue
          value={row.total_sent_transfers}
          className="text-danger"
        />
      ),
    },
    {
      name: 'Saldo Dia',
      selector: 'iuli_statement',
      cell: (row) => (
        <StatementValue
          value={row.iuli_statement}
          className={row.iuli_statement >= 0 ? 'text-success' : 'text-danger'}
        />
      ),
    },
    {
      name: 'Saldo Final',
      selector: 'iuli_balance',
      cell: (row) => (
        <StatementValue
          value={row.iuli_balance}
          className={row.iuli_balance >= 0 ? 'text-success' : 'text-danger'}
        />
      ),
    },
  ];

  return (
    <>
      <PermissionGate permissions="api.bank_account.statement">
        <Row>
          <Col md="10" sm="12">
            <Breadcrumbs
              breadCrumbTitle="Fluxo de Caixa"
              breadCrumbActive="Fluxo de Caixa"
            />
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col sm="12">
                    <div className="form-group float-right">
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
                      {/* <Button
                        color="info"
                        className="ml-2"
                        onClick={() => exportStatementXLS(filteredStatements)}
                      >
                        <FaFileExcel /> Exportar Excel
                      </Button> */}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md="4" lg="3">
                    <FormGroup className="mt-2">
                      <CustomDatePicker
                        handleChangeFilterDate={(dates) =>
                          formik.setFieldValue('date', dates)
                        }
                        filterDate={formik.values.date}
                        onlyMonths
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" lg="3">
                    <Label>Conta Bancária</Label>
                    <Select
                      isMulti
                      options={bankAccountOptions}
                      className="React"
                      classNamePrefix="select"
                      components={animatedComponents}
                      id="bankAccounts"
                      onBlur={formik.handleBlur}
                      defaultValue={formik.initialValues.bank_accounts_ids}
                      closeMenuOnSelect={false}
                      onChange={(selectetBankAccounts) => {
                        formik.setFieldValue(
                          'bank_accounts_ids',
                          (selectetBankAccounts || []).map(
                            (bankAccount) => bankAccount.value
                          )
                        );
                      }}
                    />
                  </Col>
                  <Col md="4" lg="3">
                    <Button
                      color="primary"
                      className="mt-2"
                      onClick={formik.handleSubmit}
                    >
                      <FormattedMessage id="button.load.statement.detailed" />
                    </Button>
                  </Col>
                </Row>
              </CardBody>
              <Card>
                {isReady && (
                  <CardBody>
                    <Row className="match-height mt-2">
                      <Col lg="12" sm="12">
                        <ApexMixedChart
                          title="Fluxo de Caixa"
                          themeColors={[
                            themeColors.success,
                            themeColors.danger,
                            themeColors.success,
                            themeColors.danger,
                            themeColors.primary,
                          ]}
                          series={[
                            {
                              name: 'Recebimentos',
                              type: 'column',
                              data: totalReceivable,
                            },
                            {
                              name: 'Pagamentos',
                              type: 'column',
                              data: totalPayable,
                            },
                            {
                              name: 'Transferências (Entradas)',
                              type: 'area',
                              data: totalReceivedTransfers,
                            },
                            {
                              name: 'Transferências (Saídas)',
                              type: 'area',
                              data: totalSentTransfers,
                            },
                            {
                              name: 'Saldo',
                              type: 'line',
                              data: balance,
                            },
                          ]}
                          labels={dates}
                        />
                      </Col>
                    </Row>
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
                  </CardBody>
                )}
              </Card>
            </Card>
          </Col>
        </Row>
      </PermissionGate>
    </>
  );
};

export default DetailedStatement;
