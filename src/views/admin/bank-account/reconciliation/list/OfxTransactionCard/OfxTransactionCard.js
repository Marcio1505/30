import React from 'react';
import { Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';

import BasicTab from '../../../../../../components/tabs/BasicTab';
import OfxSuggestionCard from './OfxSuggestionCard';
import FindOfxTransactionCard from './FindOfxTransactionCard';

import { store } from '../../../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../../../new.redux/actions';

import { reconciledTransactionsTransfers } from '../../../../../../services/apis/ofx_transaction.api';

import {
  formatDateToHumanString,
} from '../../../../../../utils/formaters';


import { history } from '../../../../../../history';

const OfxTransactionCard = ({
  conciliationItem,
  handleIgnoreOfxTransaction,
  handleTypeUpdateOfxTransaction,
  loadOfxreconciliationList,
  handleUnbindReconciledOfxTransaction,
}) => {
  const submitReconciliationFindOfx = async (
    conciliationItem,
    ofxTransactionsSelected
  ) => {
    const totalValueOfxTransaction = conciliationItem.ofx_transactions.reduce(
      (accumulator, ofxtransaction) => accumulator + ofxtransaction?.value,
      0
    );

    const margin = parseFloat(
      (
        conciliationItem.value_reconciled -
        totalValueOfxTransaction //conciliationItem?.ofx_transactions?.[0].value
      ).toFixed(2)
    );

    const conciliationItemTotalValues = ofxTransactionsSelected.reduce(
      (acc, ofxTransactionSelected) => {
        acc += ofxTransactionSelected.ofx_value;
        return acc;
      },
      0
    );


    const hasOfxWithDifferentDate = ofxTransactionsSelected.some(
      (ofxTransactionSelected) =>
        ofxTransactionSelected.date !==
        formatDateToHumanString(conciliationItem?.ofx_transactions?.[0].date)
    );

    if (hasOfxWithDifferentDate) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'error',
          title: 'Erro',
          message:
            'Não é permitido conciliar transações do extrato com datas diferentes.',
          hasTimeout: true,
        })
      );
      return;
    }

    // console.log('margin', margin);
    // console.log('conciliationItemTotalValues', conciliationItemTotalValues)

    if (margin !== conciliationItemTotalValues) {
      let messageAdjust = '';
      parseFloat(conciliationItemTotalValues.toFixed(2)) >
      parseFloat(margin.toFixed(2))
        ? (messageAdjust = 'maior')
        : (messageAdjust = 'menor');
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Aviso',
          message: `Não pode conciliar extratos que o valor seja ${messageAdjust} que o valor da diferença.`,
          hasTimeout: true,
        })
      );
      return;
    }

    const params = `?ofx_transactions_id=[${ofxTransactionsSelected.map(
      (ofxTransactionSelected) => ofxTransactionSelected.id
    )}]&transactions_transfers_id=[${conciliationItem.suggestion.map(
      (transaction) => transaction.id
    )}]`;

    const respreconciledTransactionsTransfers =
      await reconciledTransactionsTransfers({
        id: conciliationItem?.ofx_transactions?.[0].id,
        params,
      });

    if (respreconciledTransactionsTransfers) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Conciliação realizada com sucesso',
          hasTimeout: true,
        })
      );
      loadOfxreconciliationList();
     
    }
  };

  let tabName = 'Pendente';

  switch (conciliationItem?.ofx_transactions?.[0].status) {
    case 2:
    case 3:
      tabName = 'Conciliado';
      break;
    case 4:
    case 5:
      tabName = 'Parcialmente Conciliado';
      break;
    default:
      tabName = 'Pendente';
  }

  const tabs = [
    {
      id: '0',
      name: tabName,
      content: (
        <>
          <OfxSuggestionCard
            conciliationItem={conciliationItem}
            handleIgnoreOfxTransaction={handleIgnoreOfxTransaction}
            handleTypeUpdateOfxTransaction={handleTypeUpdateOfxTransaction}
            handleUnbindReconciledOfxTransaction={handleUnbindReconciledOfxTransaction}
          />
        </>
      ),
    },
  ];

  if (conciliationItem.status === 5) {
    tabs.push({
      id: '1',
      name: 'Pesquisar',
      content: (
        <FindOfxTransactionCard
          conciliationItem={conciliationItem}
          submitReconciliationFindOfx={submitReconciliationFindOfx}
        />
      ),
    });
  }

  return (
    <>
      <Card>
        <CardBody>
          <BasicTab
            tabs={tabs}
            bodyColor={conciliationItem.background_color}
            statusStyle={conciliationItem.status_style}
            title="Extrato"
          />
        </CardBody>
      </Card>
    </>
  );
};

OfxTransactionCard.propTypes = {
  conciliationItem: PropTypes.shape({
    background_color: PropTypes.string,
    id: PropTypes.number,
    date: PropTypes.string,
    description: PropTypes.string,
    value: PropTypes.number,
    status: PropTypes.number,
    text_status: PropTypes.string,
    status_style: PropTypes.string,
    type: PropTypes.number,
    type_text: PropTypes.string,
    bank_account_id: PropTypes.number,
    ofx_transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        date: PropTypes.string,
        description: PropTypes.string,
        value: PropTypes.number,
        status: PropTypes.number,
        text_status: PropTypes.string,
        status_style: PropTypes.string,
        type: PropTypes.number,
        type_text: PropTypes.string,
      })
    ),
    suggestion: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        date: PropTypes.string,
        description: PropTypes.string,
        value: PropTypes.number,
        status: PropTypes.number,
        text_status: PropTypes.string,
        status_style: PropTypes.string,
        type: PropTypes.number,
        type_text: PropTypes.string,
      })
    ),
  }).isRequired,
  handleIgnoreOfxTransaction: PropTypes.func.isRequired,
  handleUnbindReconciledOfxTransaction: PropTypes.func.isRequired,
  handleTypeUpdateOfxTransaction: PropTypes.func.isRequired,
};

export default OfxTransactionCard;
