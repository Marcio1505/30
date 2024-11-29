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
import { importTransfers } from '../../../../services/apis/transfers.api';

import '../../../../assets/scss/plugins/extensions/dropzone.scss';

import PermissionGate from '../../../../PermissionGate';

const DropzoneBasic = () => {
  const [files, setFiles] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const history = useHistory();

  const readExcel = (file) => {
    //console.log({ file });
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wsname = wb.SheetNames[2];

        const header = [
          'external_id',
          'bank_account_id',
          'to_bank_account_id',
          'competency_date',
          'transfer_value',
          'description',
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

    promise.then((allTransfers) => {
      allTransfers.shift();
      // console.log({ allTransfers });
      const allTransfersFormated = allTransfers.map((transfer) => {
        console.log('import');
        // console.log('transfer.competency_date');
        // console.log(transfer.competency_date);
        // console.log(
        //   moment(transfer.competency_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
        // );
        return {
          external_id: transfer.external_id,
          bank_account_id: parseInt(transfer.bank_account_id, 10),
          to_bank_account_id: parseInt(transfer.to_bank_account_id, 10),
          competency_date: transfer.competency_date
            ? moment(transfer.competency_date, 'DD/MM/YYYY').format(
                'YYYY-MM-DD'
              )
            : null,
          transfer_value: Number(
            parseFloat(
              transfer.transfer_value?.replace(/[^0-9.-]+/g, '') || 0
            ).toFixed(2)
          ),
          description: transfer.description,
        };
      });

      console.log({ allTransfers });

      setTransfers(allTransfersFormated);
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

  const handleImportTransfers = async () => {
    setButtonDisabled(true);
    try {
          await importTransfers({ transfers });
          store.dispatch(
            applicationActions.toggleDialog({
              type: 'success',
              title: 'Sucesso',
              message:'Transferências importadas com sucesso',
              hasTimeout: true,
            })
          );
          history.push('/admin/transfer/list');
          
    
    } catch (response) {
      console.log('error',response);
      const details = response?.data?.errors
        ? response?.data?.errors?.[
            Object.keys(response?.data?.errors)?.[0]
          ]?.[0]
        : '';
      if (response?.status === 422 && details) {
        const message = `Este erro ocorreu devido ao dado inserido na linha ${
          parseInt(
            (Object.keys(response?.data?.errors)?.[0] || '').split('.')?.[1] ||
              0,
            10
          ) + 5
        } da planilha de importação`;
        store.dispatch(applicationActions.hideLoading());
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'error',
            title: 'Ops!',
            message,
            details,
          })
        );
      }
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
  permissionImport = 'transfers.import';
  
  return (
    // <PermissionGate permissions={permissionImport}>
      <Card>
        <CardHeader>
          <CardTitle />
        </CardHeader>
        <CardBody>
          <>
            <h5 className="mb-2">Instruções</h5>
            <p> Abra a planilha modelo pelo link e faça uma cópia ou download.</p>
            <p>
              {' '}
              Leia atentamente todas instruções contidas na primeira aba antes de
              iniciar o preenchimento dos dados.{' '}
            </p>
            <p> Preencha os dados conforme instruções e faça o upload </p>
            <ExternalTextLink
              url={'https://docs.google.com/spreadsheets/d/1Gs4DA8Kvld4FdevltdL2ah1fWJswWWTf/'
              }
              text={'Link para Planilha Modelo de Transferências'
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
              onClick={() => handleImportTransfers()}
              className="my-1"
              color="primary"
              disabled={buttonDisabled}
            >
              <FormattedMessage id="button.import" />
            </Button.Ripple>
          </>
        </CardBody>
      </Card>
    // </PermissionGate>
  );
};

export default DropzoneBasic;
