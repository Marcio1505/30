import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import * as XLSX from 'xlsx';
import moment from 'moment';

import ExternalTextLink from '../../../../components/links/ExternalTextLink';
import ExcelImage from '../../../../assets/img/files/excel.png';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';
import { importTransactions } from '../../../../services/apis/transaction.api';

import '../../../../assets/scss/plugins/extensions/dropzone.scss';

import PermissionGate from '../../../../PermissionGate';

const TransactionsImport = ({ transactionType }) => {
  const [files, setFiles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const history = useHistory();

  const readExcel = (file) => {
    // console.log({ file });
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wsname = wb.SheetNames[2];

        const header = [
          'external_id',
          'competency_date',
          'due_date',
          'transaction_value',
          'description',
          'payment_date',
          'payed_value',
          'fiscal_document_text',
          'bank_account_id',
          'category_id',
          'project_id_1',
          'project_id_2',
          'cost_center_id_1',
          'cost_center_id_2',
          'project_percentage_1',
          'project_percentage_2',
          'cost_center_percentage_1',
          'cost_center_percentage_2',
          'to_company_company_name',
          'to_company_document',
          'to_company_document_foreigner',
          'to_company_email',
          'to_company_phone',
          'to_company_postal_code',
          'to_company_city_name',
          'to_company_state_initials',
          'to_company_neighborhood',
          'to_company_country_name',
          'to_company_street',
          'to_company_number',
          'to_company_complement',
          'show_dre',
          'show_dfc',
        ];
        const ws = wb.Sheets[wsname];
        resolve(
          XLSX.utils.sheet_to_json(ws, {
            raw: false,
            header,
            range: 3,
          })
        );
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((allTransactions) => {
      allTransactions.shift();
      // console.log({ allTransactions });
      const allTransactionsFormated = allTransactions.map((transaction) => ({
        type: transactionType,
        external_id: transaction.external_id,
        competency_date: transaction.competency_date
          ? moment(transaction.competency_date, 'DD/MM/YYYY').format(
              'YYYY-MM-DD'
            )
          : null,
        due_date: transaction.due_date
          ? moment(transaction.due_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : null,
        transaction_value: Number(
          parseFloat(
            transaction.transaction_value?.replace(/[^0-9.-]+/g, '') || 0
          ).toFixed(2)
        ),
        description: transaction.description,
        payment_date: transaction.payment_date
          ? moment(transaction.payment_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : null,
        payed_value: transaction.payed_value
          ? Number(
              parseFloat(
                transaction.payed_value?.replace(/[^0-9.-]+/g, '') || null
              ).toFixed(2)
            ) === 0
            ? null
            : Number(
                parseFloat(
                  transaction.payed_value?.replace(/[^0-9.-]+/g, '') || null
                ).toFixed(2)
              )
          : null,
        fiscal_document_text: transaction.fiscal_document_text,
        bank_account_id: parseInt(transaction.bank_account_id, 10),
        category_id: parseInt(transaction.category_id, 10),
        project_1: {
          project_id: parseInt(transaction.project_id_1, 10),
          percentage: parseFloat(transaction.project_percentage_1),
        },
        project_2: {
          project_id: parseInt(transaction.project_id_2, 10),
          percentage: parseFloat(transaction.project_percentage_2),
        },
        cost_center_1: {
          cost_center_id: parseInt(transaction.cost_center_id_1, 10),
          percentage: parseFloat(transaction.cost_center_percentage_1),
        },
        cost_center_2: {
          cost_center_id: parseInt(transaction.cost_center_id_2, 10),
          percentage: parseFloat(transaction.cost_center_percentage_2),
        },
        to_company: {
          company_name: transaction.to_company_company_name,
          document: transaction.to_company_document
            ? transaction.to_company_document?.toString().replace(/\D/g, '')
            : transaction.to_company_document_foreigner,
          email: transaction.to_company_email,
          phone: transaction.to_company_phone?.toString().replace(/\D/g, ''),
          address: {
            postal_code: transaction.to_company_postal_code?.replace(/\D/g, ''),
            city: transaction.to_company_city_name,
            state: transaction.to_company_state_initials,
            neighborhood: transaction.to_company_neighborhood,
            country: transaction.to_company_country_name,
            street: transaction.to_company_street,
            number: transaction.to_company_number,
            complement: transaction.to_company_complement,
          },
        },
        show_dre: transaction.show_dre == 0 ? 0 : 1, // default é ativo
        show_dfc: transaction.show_dfc == 0 ? 0 : 1, // default é ativo
      }));

      console.log({ allTransactionsFormated });

      setTransactions(allTransactionsFormated);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept:
      'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onDrop: (acceptedFiles) => {
      // console.log('opa');
      // console.log({ acceptedFiles });
      const uploadedFiles = acceptedFiles.map((file) => {
        // console.log('teste');
        // console.log(readExcel(file));
        readExcel(file);
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      setButtonDisabled(false);
      setFiles(uploadedFiles);
    },
  });

  const handleImportTransactions = async () => {
    setButtonDisabled(true);
    try {
      await importTransactions({ transactions });
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message:
            transactionType === 1
              ? 'Contas a Receber importadas com sucesso'
              : 'Contas a Pagar importadas com sucesso',
          hasTimeout: true,
        })
      );

      if (transactionType === 1) {
        history.push('/admin/receivable/list');
      } else {
        history.push('/admin/payable/list');
      }
    } catch (response) {
      setButtonDisabled(false);
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

  let permissionImport = null;

  if (transactionType === 1) {
    permissionImport = 'receivables.import';
  } else if (transactionType === 2) {
    permissionImport = 'payables.import';
  }

  return (
    <PermissionGate permissions={permissionImport}>
      <Card>
        <CardHeader>
          <CardTitle />
        </CardHeader>
        <CardBody>
          <>
            <h5 className="mb-2">Instruções</h5>
            <p>
              {' '}
              Abra a planilha modelo pelo link e faça uma cópia ou download.
            </p>
            <p>
              {' '}
              Leia atentamente todas instruções contidas na primeira aba antes
              de iniciar o preenchimento dos dados.{' '}
            </p>
            <p> Preencha os dados conforme instruções e faça o upload </p>
            <ExternalTextLink
              url={
                transactionType === 1
                  ? 'https://docs.google.com/spreadsheets/d/1ghN3C0tA1eV91oeKYySM9oyK_BDto0Zq/'
                  : 'https://docs.google.com/spreadsheets/d/1D-Ss-3l9-SOF6V2VeN9le4U5x-6N5jTG/'
              }
              text={
                transactionType === 1
                  ? 'Link para Planilha Modelo de Contas a Receber'
                  : 'Link para Planilha Modelo de Contas a Pagar'
              }
              type="warning"
            />
            <section className="mt-2">
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p className="mx-1">
                  Arraste e solte o arquivo de importação aqui ou clique para
                  selecioná-lo
                </p>
              </div>
              <aside className="thumb-container">{thumbs}</aside>
            </section>
            <Button.Ripple
              onClick={() => handleImportTransactions()}
              className="my-1"
              color="primary"
              disabled={buttonDisabled}
            >
              <FormattedMessage id="button.import" />
            </Button.Ripple>
          </>
        </CardBody>
      </Card>
    </PermissionGate>
  );
};

export default TransactionsImport;
