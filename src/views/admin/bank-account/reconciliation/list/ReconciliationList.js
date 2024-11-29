import React, { useState, useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Button, Row, Col, FormGroup, Card, CardBody } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { useParams } from 'react-router-dom';

import SweetAlert from 'react-bootstrap-sweetalert';
import { ArrowRight } from 'react-feather';

import moment from 'moment';
import { useSearchParams } from 'react-router-dom-v5-compat';
import Breadcrumbs from '../../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import CustomDatePicker from '../../../../../components/datepicker/CustomDatePicker';

import OfxTransactionCard from './OfxTransactionCard/OfxTransactionCard';
import TransactionOrTransferCard from './TransactionOrTransferCard/TransactionOrTransferCard';
import SuggestionCard from './TransactionOrTransferCard/SuggestionCard';
import NewTransactionTransferCard from './TransactionOrTransferCard/NewTransactionTransferCard';
import FindTransactionTransferCard from './TransactionOrTransferCard/FindTransactionTransferCard';

import { history } from '../../../../../history';

import { store } from '../../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../../new.redux/actions';

import {
  ofxTypeUpdate,
  ofxIgnored,
  ofxUnbindReconciled,
  reconciledTransactionsTransfers,
  fetchOfxreconciliationList,
} from '../../../../../services/apis/ofx_transaction.api';
import { unbindReconciledTransaction } from '../../../../../services/apis/transaction.api';
import { unbindReconciledTransfer } from '../../../../../services/apis/transfers.api';

import '../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../../assets/scss/pages/users.scss';

import PermissionGate from '../../../../../PermissionGate';

const ReconciliationList = ({ currentCompanyId }) => {
  const intl = useIntl();

  const { bank_account_id } = useParams();

  const [conciliations, setConciliations] = useState([]);
  const [competencyDate, setCompetencyDate] = useState([]);

  const [ofxTransactionReconcile, setOfxTransactionReconcile] = useState([]);
  const [formikTransactionReconcile, setFormikTransactionReconcile] = useState(
    []
  );

  const [searchParams] = useSearchParams();
  const reconciled = searchParams.get('reconcilled');

  const [showModalIgnored, setShowModalIgnored] = useState(false);
  const [showModalUnbindReconciled, setShowModalUnbindReconciled] = useState(false);
  const [ignoredOfxTransaction, setIgnoredOfxTransaction] = useState(null);
  const [unbindReconciledOfxTransaction, setUnbindReconciledOfxTransaction] = useState(null);

  const [showModalTypeUpdate, setShowModalTypeUpdate] = useState(false);
  const [typeUpdateOfxTransaction, setTypeUpdateOfxTransaction] =
    useState(null);

  const [showModalReconcile, setShowModalReconcile] = useState(false);
  const [messageModalReconciled, setMessageModalReconciled] = useState(null);

  const [transactionOrTransferToUnbind, setTransactionOrTransferToUnbind] =
    useState(null);

  const [showModalDesvinculed, setShowUnbind] = useState(false);

  const bankTitle = conciliations.length
    ? `${conciliations?.[0]?.bank_name} Ag: ${conciliations?.[0]?.bank_branch} Conta: ${conciliations?.[0]?.bank_account}`
    : '';

  const loadOfxreconciliationList = async () => {
    let params = `?status_not_in=[9,2,3]`;
    if (reconciled) {
      params = `?status_not_in=[9,0,1,4,5,6]`;
    }
    const year_month = moment(competencyDate[0]).format('MM-YYYY');
    params += `&year_month=${year_month}`;
    // params += `&year_month=02-2022`;

    const { data: rowData } = await fetchOfxreconciliationList({
      id: bank_account_id,
      params,
    });

    const newDataConciliations = rowData.map((conciliationItem) => {
      const tabs = [];
      if (
        conciliationItem?.status === 0 ||
        conciliationItem?.status === 1 ||
        conciliationItem?.status === 4
      ) {
        if (
          conciliationItem?.type === 1 ||
          conciliationItem?.type === 2 ||
          conciliationItem?.type === 3 ||
          conciliationItem?.type === 4
        ) {
          tabs.unshift({
            id: '2',
            name: 'Pesquisar',
            content: (
              <FindTransactionTransferCard
                conciliationItem={conciliationItem}
                submitreconciliationFind={submitreconciliationFind}
              />
            ),
          });
          tabs.unshift({
            id: '1',
            name: 'Novo',
            content: (
              <NewTransactionTransferCard conciliationItem={conciliationItem} />
            ),
          });
        }
      }
      if (conciliationItem?.suggestion?.length) {
        tabs.unshift({
          id: '0',
          name:
            // conciliationItem?.status === 0 ||
            conciliationItem?.status === 1
              ? 'Sugestão'
              : conciliationItem?.status === 6
              ? 'Conciliação Incompleta'
              : conciliationItem?.status === 5
              ? 'Parcialmente Conciliado'
              : conciliationItem?.status === 4
              ? 'Parcialmente Conciliado'
              : conciliationItem?.status === 2
              ? 'Conciliado'
              : conciliationItem?.status === 3
              ? 'Conciliado'
              : 'Pendente',
          content: (
            <SuggestionCard
              conciliationItem={conciliationItem}
              submitreconciliation={submitreconciliation}
              submitUnbind={submitUnbind}
            />
          ),
        });
      }
      return {
        ...conciliationItem,
        tabs,
      };
    });
    setConciliations(newDataConciliations);
  };

  const handleIgnoreOfxTransaction = (ofxTransactionId) => {
    setIgnoredOfxTransaction(ofxTransactionId);
    setShowModalIgnored(true);
  };

  const handleUnbindReconciledOfxTransaction = (ofxTransactionId) => {
    setUnbindReconciledOfxTransaction(ofxTransactionId);
    setShowModalUnbindReconciled(true);
  };

  const handleTypeUpdateOfxTransaction = (ofxTransactionId) => {
    setTypeUpdateOfxTransaction(ofxTransactionId);
    setShowModalTypeUpdate(true);
  };

  const submitTypeUpdate = async () => {
    setShowModalTypeUpdate(false);

    const respofxTypeUpdate = await ofxTypeUpdate({
      id: typeUpdateOfxTransaction,
    });
    if (respofxTypeUpdate.statusText == 'OK') {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Tipo da transação alterado com sucesso',
          hasTimeout: true,
        })
      );
      loadOfxreconciliationList();
    }
  };

  const submitIgnored = async () => {
    setShowModalIgnored(false);

    const respofxIgnored = await ofxIgnored({
      id: ignoredOfxTransaction,
    });

    if (respofxIgnored.id) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Transação ignorada com sucesso',
          hasTimeout: true,
        })
      );
      loadOfxreconciliationList();
    }
  };

  const submitUnbindReconciled = async () => {
    setShowModalUnbindReconciled(false);

    const respOfxUnbindReconciled = await ofxUnbindReconciled({
      id: unbindReconciledOfxTransaction,
    });

    if (respOfxUnbindReconciled.id) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Todas as conciliação foram removidas com sucesso',
          hasTimeout: true,
        })
      );
      loadOfxreconciliationList();
    }
  };
  
  const submitreconciliation = async (ofxTransaction) => {
    const transactions = Object.keys(ofxTransaction.suggestion).map(
      (key) => ofxTransaction.suggestion[key]
    );
    submitreconciliationFind(ofxTransaction, transactions);
  };

  const submitreconciliationFind = async (
    ofxTransaction,
    transactionsFormik
  ) => {
    setOfxTransactionReconcile(ofxTransaction);
    setFormikTransactionReconcile(transactionsFormik);

    const conciliationItemTotalValues = transactionsFormik.reduce(
      (acc, transactionFormik) => {
        acc += transactionFormik.transfer_value;
        return acc;
      },
      0
    );

    const ofxValue =
      ofxTransaction?.ofx_transactions?.[0].value -
      ofxTransaction?.value_reconciled;

    if (parseFloat(ofxValue.toFixed(2)) < conciliationItemTotalValues) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Aviso',
          message:
            'Não pode conciliar Transferências que somadas resulte num valor maior que o valor do Extrato bancário.',
          hasTimeout: true,
        })
      );
      return;
    }

    let messagePopupReconciled = '';

    if (ofxTransaction.type === 1) {
      messagePopupReconciled =
        transactionsFormik.length === 1
          ? 'Essa transação será marcada como recebida e a data do recebimento será alterada para a data do extrato bancário. Confirma que deseja conciliar essa transação?'
          : 'Essas transações serão marcadas como recebidas e as respectivas datas de recebimento serão alteradas para a data do extrato bancário. Confirma que deseja conciliar essas transações?';
    } else if (ofxTransaction.type === 2) {
      messagePopupReconciled =
        transactionsFormik.length === 1
          ? 'Essa transação será marcada como paga e a data do pagamento será alterada para a data do extrato bancário. Confirma que deseja conciliar essa transação?'
          : 'Essas transações serão marcadas como pagas e as respectivas datas de pagamento serão alteradas para a data do extrato bancário. Confirma que deseja conciliar essas transações?';
    } else if (ofxTransaction.type === 3 || ofxTransaction.type === 4) {
      messagePopupReconciled =
        transactionsFormik.length === 1
          ? 'A data da transferência será alterada para a data do extrato bancário. Confirma que deseja conciliar essa transferência?'
          : 'A data das transferências serão alteradas para a data do extrato bancário. Confirma que deseja conciliar essas transferências? ';
    }

    setMessageModalReconciled(messagePopupReconciled);
    setShowModalReconcile(true);
  };

  const submitReconcile = async (ofxTransaction, transactionsFormik) => {
    setShowModalReconcile(false);

    const transactions_transfers_id = [];

    transactionsFormik.map((transaction_transfer) => {
      transactions_transfers_id.push(transaction_transfer.id);
    });

    const params = `?transactions_transfers_id=[${transactions_transfers_id.map(
      (transaction_transfer_id) => transaction_transfer_id
    )}]`;

    const respreconciledTransactionsTransfers =
      await reconciledTransactionsTransfers({
        id: ofxTransaction.ofx_transactions[0].id,
        params,
      });
    if (respreconciledTransactionsTransfers.statusText === 'OK') {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Conciliada realizada com sucesso',
          hasTimeout: true,
        })
      );
      loadOfxreconciliationList();
    }
  };

  const submitUnbind = async (transactionOrTransfer) => {
    setTransactionOrTransferToUnbind(transactionOrTransfer);
    setShowUnbind(true);
  };

  const unbindTransactionOrTransfer = async () => {
    setShowUnbind(false);

    if (
      transactionOrTransferToUnbind.type === 1 ||
      transactionOrTransferToUnbind.type === 2
    ) {
      const respUnbindReconciledTransaction = await unbindReconciledTransaction(
        {
          id: transactionOrTransferToUnbind.id,
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
        loadOfxreconciliationList();
      }
    } else if (
      transactionOrTransferToUnbind.type === 3 ||
      transactionOrTransferToUnbind.type === 4
    ) {
      const respUnbindReconciledTransfer = await unbindReconciledTransfer({
        id: transactionOrTransferToUnbind.id,
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
        loadOfxreconciliationList();
      }
    }
  };

  useEffect(() => {
    loadOfxreconciliationList();
  }, [competencyDate, reconciled]);

  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      history.push('/admin/bank-account/list');
    } else {
      didMount.current = true;
    }
  }, [currentCompanyId]);
  

  return (
    <>
      <PermissionGate permissions="api.companies.bank_accounts.import-ofx">
        <Row className="">
          <Col sm="12">
            <Breadcrumbs
              breadCrumbTitle={
                <FormattedMessage id="button.import.bank_account" />
              }
              breadCrumbParents={[
                {
                  name: <FormattedMessage id="button.list.bank_account" />,
                  link: '/admin/bank-account/list',
                },
              ]}
              breadCrumbActive={bankTitle}
            />
          </Col>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col sm="12">
                    <Row>
                      <Col
                        className="d-flex justify-content-start flex-wrap"
                        md="6"
                        sm="12"
                      >
                        <FormGroup>
                          <CustomDatePicker
                            handleChangeFilterDate={(dates) =>
                              setCompetencyDate(dates)
                            }
                            filterDate={competencyDate}
                            onlyMonths
                          />
                        </FormGroup>
                      </Col>
                      <Col
                        className="d-flex justify-content-end flex-wrap"
                        md="3"
                        sm="12"
                      >
                        <Button.Ripple
                          className="my-1"
                          color="primary"
                          onClick={() => {
                            history.push(
                              reconciled
                                ? `/admin/bank-account/${bank_account_id}/reconciliation/`
                                : `/admin/bank-account/${bank_account_id}/reconciliation/?reconcilled=1`
                            );
                          }}
                        >
                          {reconciled ? 'Não Conciliados' : 'Conciliados'}
                        </Button.Ripple>
                      </Col>
                      <Col
                        className="d-flex justify-content-end flex-wrap"
                        md="3"
                        sm="12"
                      >
                        <Button.Ripple
                          className="my-1"
                          color="primary"
                          onClick={() =>
                            history.push(
                              `/admin/bank-account/${bank_account_id}/reconciliation/ofx-transactions/ignored`
                            )
                          }
                        >
                          <FormattedMessage id="button.ignoredofx.bank_account" />
                        </Button.Ripple>
                      </Col>
                    </Row>

                    {/* Habilitar o comentado abaixo e remover a row acima quando concluir o sprint de regras */}
                    {/* <Row>
                      <Col
                        className="d-flex justify-content-start flex-wrap"
                        md="4"
                        sm="12"
                      >
                        <FormGroup>
                          <CustomDatePicker
                            handleChangeFilterDate={(dates) =>
                              setCompetencyDate(dates)
                            }
                            filterDate={competencyDate}
                            onlyMonths
                          />
                        </FormGroup>
                      </Col>
                      <Col
                        className="d-flex justify-content-end flex-wrap"
                        md="2"
                        sm="12"
                      >
                        <Button.Ripple
                          className="my-1"
                          color="primary"
                          onClick={() => {
                            history.push(
                              reconciled
                                ? `/admin/bank-account/${bank_account_id}/reconciliation/`
                                : `/admin/bank-account/${bank_account_id}/reconciliation/?reconcilled=1`
                            );
                          }}
                        >
                          {reconciled ? 'Não Conciliados' : 'Conciliados'}
                        </Button.Ripple>
                      </Col>
                      <Col
                        className="d-flex justify-content-end flex-wrap"
                        md="3"
                        sm="12"
                      >
                        <Button.Ripple
                          className="my-1"
                          color="primary"
                          onClick={() =>
                            history.push(
                              `/admin/bank-account/${bank_account_id}/reconciliation/ofx-transactions/ignored`
                            )
                          }
                        >
                          <FormattedMessage id="button.ignoredofx.bank_account" />
                        </Button.Ripple>
                      </Col>




                      <Col
                        className="d-flex justify-content-end flex-wrap"
                        md="3"
                        sm="12"
                      >
                        <Button.Ripple
                          className="my-1"
                          color="primary"
                          onClick={() =>
                            history.push(
                              `/admin/bank-account/${bank_account_id}/reconciliation/ofx-transactions/rules`
                            )
                          }
                        >
                          Regras
                          {/* <FormattedMessage id="button.ignoredofx.bank_account" /> 
                        </Button.Ripple>
                      </Col>

                    </Row> */}

                  </Col>
                </Row>
              </CardBody>

              {Boolean(conciliations.length) && (
                <>
                <CardBody style={{
                  backgroundColor: '#ebebeb',
                }}>
                  <Row style={{
                        textAlign: 'center' ,
                      }}>
                    <Col sm="12">
                      <h3 class="mb-0 p-0 pt-0">
                        <FormattedMessage id=
                          {reconciled ? "reconciled.transaction" : "reconciled.not.transaction"}     
                        /> 
                      </h3>            
                    </Col>
                  </Row>
                  <Row style={{
                        textAlign: 'center' ,
                      }}>
                    <Col  md="5">
                      <h4 class="mb-0 p-0 pt-0">
                        <FormattedMessage id="reconciled.transactions.bank" />    
                      </h4>            
                    </Col>
                    <Col md="2">
                    </Col>
                    <Col md="5">
                      <h4 class="mb-0 p-0 pt-0">
                        <FormattedMessage id="reconciled.transactions.iuli" />
                      </h4>
                    </Col>

                  </Row>
                </CardBody>

                <CardBody
                  style={{
                    backgroundColor: '#f2f2f2',
                  }}
                >
                  <Row>
                    <Col sm="12">
                      {conciliations.map(
                        (conciliationItem) =>
                          conciliationItem.id ===
                            conciliationItem.ofx_transactions[0].id && (
                            <Card key={conciliationItem.ofx_transactions[0].id}>
                              <Row
                                style={{
                                  backgroundColor: '#f2f2f2',
                                }}
                              >
                                <Col md="5">
                                  <OfxTransactionCard
                                    conciliationItem={conciliationItem}                                    
                                    handleIgnoreOfxTransaction={
                                      handleIgnoreOfxTransaction
                                    }
                                    handleTypeUpdateOfxTransaction={
                                      handleTypeUpdateOfxTransaction
                                    }
                                    loadOfxreconciliationList={loadOfxreconciliationList}
                                    handleUnbindReconciledOfxTransaction={
                                      handleUnbindReconciledOfxTransaction
                                    }
                                  />
                                </Col>
                                <Col md="2" className="text-center mt-5">
                                  <ArrowRight size={48} />
                                </Col>
                                <Col md="5">
                                  <TransactionOrTransferCard
                                    ofxTransaction={conciliationItem}
                                    handleIgnoreOfxTransaction={
                                      handleIgnoreOfxTransaction
                                    }
                                    handleUnbindReconciledOfxTransaction={
                                      handleUnbindReconciledOfxTransaction
                                    }
                                  />
                                </Col>
                              </Row>
                            </Card>
                          )
                      )}
                    </Col>
                  </Row>
                  <div className={showModalIgnored ? 'global-dialog' : ''}>
                    <SweetAlert
                      showCancel
                      reverseButtons={false}
                      cancelBtnBsStyle="secondary"
                      confirmBtnBsStyle="danger"
                      confirmBtnText="Confirmar"
                      cancelBtnText="Cancelar"
                      warning
                      title="Ignorar Transação!"
                      show={showModalIgnored}
                      onConfirm={submitIgnored}
                      onClose={() => setShowModalIgnored(false)}
                      onCancel={() => setShowModalIgnored(false)}
                    >
                      <h4 className="sweet-alert-text my-2">
                        Confirma que deseja ignorar esta transação?
                      </h4>
                    </SweetAlert>
                  </div>
                  <div className={showModalUnbindReconciled ? 'global-dialog' : ''}>
                    <SweetAlert
                      showCancel
                      reverseButtons={false}
                      cancelBtnBsStyle="secondary"
                      confirmBtnBsStyle="danger"
                      confirmBtnText="Confirmar"
                      cancelBtnText="Cancelar"
                      warning
                      title="Desconciliar"
                      show={showModalUnbindReconciled}
                      onConfirm={submitUnbindReconciled}
                      onClose={() => setShowModalUnbindReconciled(false)}
                      onCancel={() => setShowModalUnbindReconciled(false)}
                    >
                      <h4 className="sweet-alert-text my-2">
                        Confirma que deseja desconciliar todas as transações conciliadas com esse item do extrato bancário?
                      </h4>
                    </SweetAlert>
                  </div>
                  <div className={showModalTypeUpdate ? 'global-dialog' : ''}>
                    <SweetAlert
                      showCancel
                      reverseButtons={false}
                      cancelBtnBsStyle="secondary"
                      confirmBtnBsStyle="danger"
                      confirmBtnText="Confirmar"
                      cancelBtnText="Cancelar"
                      warning
                      title="Alterar o tipo da Transação!"
                      show={showModalTypeUpdate}
                      onConfirm={submitTypeUpdate}
                      onClose={() => setShowModalTypeUpdate(false)}
                      onCancel={() => setShowModalTypeUpdate(false)}
                    >
                      <h4 className="sweet-alert-text my-2">
                        Confirma que deseja alterar o tipo desta transação?
                      </h4>
                    </SweetAlert>
                  </div>
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
                      onConfirm={unbindTransactionOrTransfer}
                      onClose={() => setShowUnbind(false)}
                      onCancel={() => setShowUnbind(false)}
                    >
                      <h4 className="sweet-alert-text my-2">
                        Confirma que deseja desvincular esta conciliação?
                      </h4>
                    </SweetAlert>
                  </div>

                  <div className={showModalReconcile ? 'global-dialog' : ''}>
                    <SweetAlert
                      showCancel
                      reverseButtons={false}
                      cancelBtnBsStyle="secondary"
                      confirmBtnBsStyle="danger"
                      confirmBtnText="Confirmar"
                      cancelBtnText="Cancelar"
                      warning
                      title="Conciliação Bancária!"
                      show={showModalReconcile}
                      onConfirm={() =>
                        submitReconcile(
                          ofxTransactionReconcile,
                          formikTransactionReconcile
                        )
                      }
                      onClose={() => setShowModalReconcile(false)}
                      onCancel={() => setShowModalReconcile(false)}
                    >
                      <h4 className="sweet-alert-text my-2">
                        {messageModalReconciled}
                      </h4>
                    </SweetAlert>
                  </div>
                </CardBody>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </PermissionGate>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

ReconciliationList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(ReconciliationList);
