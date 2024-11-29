import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardTitle, Button } from 'reactstrap';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import * as XLSX from 'xlsx';
import moment from 'moment';

import ExternalTextLink from '../../../../../components/links/ExternalTextLink';

import { store } from '../../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../../new.redux/actions';
import { importOfxBankAccount } from '../../../../../services/apis/bank_account.api';
import ExcelImage from '../../../../../assets/img/files/excel.png';

const BasicDropzonePlataformHotmart = () => {
  const [files, setFiles] = useState([]);
  const [statements, setStatements] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const history = useHistory();
  const { bank_account_id } = useParams();

  const formatDateFromExcel = (excelDate) =>
    moment.unix(Math.round((excelDate - 25568) * 86400)).format('YYYY-MM-DD');

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wsname = wb.SheetNames[0];

        const header = [
          'competency_date', // Data do lançamento
          'payed_date', // Data da efetivação
          'status_plataform', // Status
          'external_id', // Transação
          'anticipation_id', // Identificador de antecipação
          'status_transaction', // Status da transação
          'description', // Descrição
          'installments', // Parcela
          'value', // Valor
          'product_name', // Nome do produto
          'balance', // Saldo
        ];
        const ws = wb.Sheets[wsname];
        resolve(
          XLSX.utils.sheet_to_json(ws, {
            raw: false,
            header,
            range: 0,
          })
        );
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((allStatements) => {
      allStatements.shift();

      // console.log('allStatements',{ allStatements });
      // return;

      const allStatementsFormated = allStatements.map((statement) => ({
        // ...statement,
        competency_date: statement.competency_date
          ? moment(statement.competency_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : null,
        payed_date: statement.payed_date
          ? moment(statement.payed_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : null,
        status_plataform: statement.status_plataform?.toString(),
        external_id: statement.external_id?.toString(),
        anticipation_id: statement.anticipation_id?.toString(),
        status_transaction: statement.status_transaction?.toString(),
        description: statement.description?.toString(),
        installments: statement.installments?.toString(),
        value:
          Number(parseFloat(statement.value || 0).toFixed(2)) === 0
            ? null
            : parseFloat(statement.value || 0).toFixed(2),
        product_name: statement.product_name?.toString(),
        balance:
          Number(parseFloat(statement.balance || 0).toFixed(2)) === 0
            ? null
            : parseFloat(statement.balance || 0).toFixed(2),
      }));

      // console.log('allStatementsFormated',allStatementsFormated);
      // return;
      setStatements(allStatementsFormated);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept:
      'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onDrop: (acceptedFiles) => {
      const uploadedFiles = acceptedFiles.map((file) => {
        readExcel(file);
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      setButtonDisabled(false);
      setFiles(uploadedFiles);
    },
  });

  const handleImportStatements = async () => {
    const respImportOfxBankAccount = await importOfxBankAccount({
      bank_account_id,
      ofxFile: statements,
    });

    if (respImportOfxBankAccount?.data >= 1) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Arquivo de Extrato da Hotmart importado com sucesso.',
          hasTimeout: true,
        })
      );
      history.push(`/admin/bank-account/${bank_account_id}/reconciliation`);
    } else {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'warning',
          title: 'Aviso',
          message:
            'Não existe nenhuma nova transação neste Extrato da Hotmart.', // allan: validar depois
          hasTimeout: true,
        })
      );
    }
  };

  const thumbs = files.map((file) => (
    <>
      <div className="dz-thumb" key={file.name}>
        <div className="dz-thumb-inner">
          <img src={ExcelImage} className="dz-img" alt={file.name} />
        </div>
      </div>
      <small>{file.name}</small>
    </>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <>
      <h5 className="mb-2">Instruções</h5>
      <p>
        {' '}
        Exporte o arquivo do Extrato da Hotmart para iniciar a conciliação
        bancária.
      </p>

      <section className="mt-2">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p className="mx-1">
            Arraste e solte o arquivo aqui ou clique para selecioná-lo
            {/* Drag 'n' drop some files here, or click to select files */}
          </p>
        </div>
        <aside className="thumb-container">{thumbs}</aside>
      </section>
      <Button.Ripple
        onClick={() => handleImportStatements()}
        className="my-1"
        color="primary"
        disabled={buttonDisabled}
      >
        <FormattedMessage id="button.import.statement.plataform" />
      </Button.Ripple>
    </>
  );
};

const DropzoneBasicPlataform = (bankAccount) => (
  <Card>
    <CardHeader>
      <CardTitle />
    </CardHeader>
    <CardBody>
      {bankAccount.bankAccount.is_hotmart && (
        <>
          <BasicDropzonePlataformHotmart />
        </>
      )}
    </CardBody>
  </Card>
);

export default DropzoneBasicPlataform;
