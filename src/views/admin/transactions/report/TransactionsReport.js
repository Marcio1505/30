import React from 'react';
import * as Icon from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { Card, CardBody, Row, Col, Table, Button, Badge } from 'reactstrap';
import { Mail, Phone, FileText } from 'react-feather';

import {
  formatMoney,
  formatCpfCnpj,
  formatDateToHumanString,
} from '../../../../utils/formaters';

import '../../../../assets/scss/pages/invoice.scss';

import PermissionGate from "../../../../PermissionGate";

const TransactionsReport = ({ transactionType }) => {
  const location = useLocation();
  const { transactions = [], company = null, user = null } = location;
  const totalItems = transactions?.length;
  const totalValues = transactions?.reduce(
    (accumulator, transaction) => accumulator + transaction?.transaction_value,
    0
  );

  let permissionReport = '';

  if (transactionType === 'payable')
  {
    permissionReport = 'payables.report';
  }
  else if (transactionType === 'receivable')
  {    
    permissionReport = 'receivables.report';
  }

  return (
    <>
    <PermissionGate permissions={permissionReport}>
      <Row>
        <Col
          className="d-flex flex-column flex-md-row justify-content-end invoice-header mb-1"
          md="12"
        >
          <Button
            className="mb-md-0 mb-1 float-right"
            color="primary"
            onClick={() => window.print()}
          >
            <FileText size="15" />
            <span className="align-middle ml-50">
              <FormattedMessage id="button.print" />
            </span>
          </Button>
        </Col>
        <Col id="transactions-print" className="invoice-wrapper mt-0" sm="12">
          <Card className="invoice-page p-5">
            <CardBody className="pt-0">
              <Row className="pt-0">
                <Col md="12" className="mb-4">
                  {transactionType === 'receivable' && (
                    <h5>Relatório de contas a receber</h5>
                  )}
                  {transactionType === 'payable' && (
                    <h5>Relatório de contas a pagar</h5>
                  )}
                </Col>
                <Col md="6" sm="12">
                  <h5>{company?.company_name}</h5>
                  <h5>{formatCpfCnpj(company?.document)}</h5>
                  {company?.email && (
                    <p>
                      <Mail size={15} className="mr-50" />
                      {company?.email}
                    </p>
                  )}
                  {company?.phone && (
                    <p>
                      <Phone size={15} className="mr-50" />
                      {company?.phone}
                    </p>
                  )}
                </Col>
                <Col md="6" sm="12" className="text-right" />
              </Row>
              <div className="invoice-items-table pt-1">
                <Row>
                  <Col sm="12">
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Vencimento</th>
                          <th>Lançamento</th>
                          <th>
                            <p className="text-right">Valor</p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr>
                            <td className="text-left font-weight-bold">
                              <>
                                {formatDateToHumanString(transaction.due_date)}
                                {Boolean(transaction.payed) && (
                                  <div className="badge badge-pill badge-light-success ml-2">
                                    <Icon.Check size={16} />
                                  </div>
                                )}
                              </>
                            </td>
                            <td className="d-flex d-flex align-items-center">
                              <Badge className="category-badge">
                                {transaction.transaction_subcategory?.name}
                              </Badge>
                              <b>{transaction.description}</b>
                              <span className="ml-1">
                                {transaction.client?.company_name}
                              </span>
                            </td>
                            <td>
                              <p className="text-right font-weight-bold">
                                {transactionType === 'receivable' && (
                                  <>
                                    {formatMoney(
                                      transaction.transaction_value || 0,
                                      true
                                    )}
                                  </>
                                )}
                                {transactionType === 'payable' && (
                                  <>
                                    <span>{`- `}</span>
                                    {formatMoney(
                                      transaction.transaction_value || 0,
                                      true
                                    )}
                                  </>
                                )}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
              <div className="invoice-total-table">
                <Row>
                  <Col sm="12">
                    <Table borderless>
                      <thead>
                        <tr>
                          <th colSpan="9">Total do Período</th>
                          <td colSpan="1" />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th colSpan="9">
                            <p className="text-right">Lançamentos</p>
                          </th>
                          <td colSpan="1">
                            <p className="text-right">{totalItems}</p>
                          </td>
                        </tr>
                        {/* <tr>
                          <th colSpan="9">
                            <p className="text-right">Pagas (R$)</p>
                          </th>
                          <td colSpan="1">
                            <p className="text-right">110</p>
                          </td>
                        </tr> */}
                        {/* <tr>
                          <th colSpan="9">
                            <p className="text-right">A Pagar (R$)</p>
                          </th>
                          <td colSpan="1">
                            <p className="text-right">20000</p>
                          </td>
                        </tr> */}
                        <tr>
                          <th colSpan="9">
                            <p className="text-right">Total</p>
                          </th>
                          <td colSpan="1">
                            {transactionType === 'receivable' && (
                              <p className="text-right text-success">
                                {formatMoney(totalValues, true)}
                              </p>
                            )}
                            {transactionType === 'payable' && (
                              <p className="text-right text-danger">
                                <span>{`- `}</span>
                                {formatMoney(totalValues, true)}
                              </p>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th colSpan="9" />
                          <td colSpan="1" />
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
              <div className="text-center pt-3 invoice-footer">
                <p className="bank-details mb-2 text-right">
                  <span>
                    {`Gerado em `}
                    {moment().format('DD/MM/YYYY')}
                    {` às `}
                    {moment().format('HH:mm')}
                    {`\n por `}
                    {user?.name}
                  </span>
                </p>
                <strong>IULI &copy; {new Date().getFullYear()}</strong>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </PermissionGate>
    </>
  );
};

export default TransactionsReport;
