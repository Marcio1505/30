import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardTitle, Button } from 'reactstrap';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import * as XLSX from 'xlsx';
import moment from 'moment';

import ExternalTextLink from '../../../../components/links/ExternalTextLink';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import { importOfxBankAccount } from '../../../../services/apis/bank_account.api';
import ExcelImage from '../../../../assets/img/files/excel.png';

const BasicDropzone = () => {
  const [files, setFiles] = useState([]);
  const [ofxFile, setOfxFile] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const history = useHistory();
  const { bank_account_id } = useParams();

  const readOfxFile = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = (e) => {
        const ofxdata = e.target.result;
        resolve(ofxdata);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((_ofxFile) => {
      setOfxFile(_ofxFile);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.ofx',
    onDrop: (acceptedFiles) => {
      const uploadedFiles = acceptedFiles.map((file) => {
        readOfxFile(file);
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      setButtonDisabled(false);
      setFiles(uploadedFiles);
    },
  });

  const handleimportOfxBankAccount = async () => {
    await importOfxBankAccount({ bank_account_id, ofxFile });
    store.dispatch(
      applicationActions.toggleDialog({
        type: 'success',
        title: 'Sucesso',
        message: 'Arquivo OFX importado com sucesso',
        hasTimeout: true,
      })
    );
    history.push(`/admin/bank-account/list`);
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

  // console.log(bank_account_id);
  // useEffect(() => {
  //   console.log({ bankAccounts });
  // }, [bankAccounts]);

  return (
    <>
      <h5 className="mb-2">Instruções</h5>
      <p>
        {' '}
        Exporte o arquivo OFX no seu banco para iniciar a conciliação bancária.
      </p>

      <section className="mt-2">
        <div {...getRootProps({ className: 'dropzone' })}>
          {' '}
          {/* Allan ver com flavio para s[o permitir 1 arquivo por vez */}
          <input {...getInputProps()} />
          <p className="mx-1">
            Arraste e solte o arquivo aqui ou clique para selecioná-lo
            {/* Drag 'n' drop some files here, or click to select files */}
          </p>
        </div>
        <aside className="thumb-container">{thumbs}</aside>
      </section>
      <Button.Ripple
        onClick={() => handleimportOfxBankAccount()}
        className="my-1"
        color="primary"
        disabled={buttonDisabled}
      >
        <FormattedMessage id="button.importofx.bank_account" />
      </Button.Ripple>
    </>
  );
};

const DropzoneBasic = () => (
  <Card>
    <CardHeader>
      <CardTitle />
    </CardHeader>
    <CardBody>
      <BasicDropzone />
    </CardBody>
  </Card>
);

export default DropzoneBasic;
