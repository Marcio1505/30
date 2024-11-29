import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Row, Col, CustomInput } from 'reactstrap';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Eye } from 'react-feather';

import SweetAlert from 'react-bootstrap-sweetalert';

import { applicationActions } from '../../../../../../new.redux/actions';
import { store } from '../../../../../../redux/storeConfig/store';

import 'flatpickr/dist/themes/light.css';
import '../../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../../../components/inputs/TextField';

import ListFiles from '../../../../files/ListFiles';
import BankAccountDropzone from '../../BankAccountDropzone';

const BankAccountApiInter = ({ formik, bank_account_id }) => {
  const intl = useIntl();
  
  const [interDataVisible, setInterDataVisible] = useState(false);
  const [isUploadingCertDigital, setIsUploadingCertDigital] = useState(null);
  const [isUploadingSslKey, setIsUploadingSslKey] = useState(null);

  const [fielFileToDelete, setFielFileToDelete] = useState(false);
  const [showModalDeleteReceipt, setShowModalDeleteReceipt] = useState(false);
  
  const handleDeleteReceipt = (fieldFile) => {
      setFielFileToDelete(fieldFile);
      setShowModalDeleteReceipt(true);
    };
  
    const submitDeleteFile = async () => {
      setShowModalDeleteReceipt(false);
      formik.setFieldValue(fielFileToDelete, null);
     
        store.dispatch(
          applicationActions.toggleDialog({
            type: 'success',
            title: 'Sucesso',
            message: 'Arquivo removido, mas para gravar clique no botão Salvar.',
            hasTimeout: true,
          })
        );
      //}
    };

    
  return (
    <Row className="mt-1">
          
      <Col className="mt-1" sm="12">
        <h3 className="mb-1 text-primary">
          <span className="align-middle">
            {intl.formatMessage({
              id: 'bank-account.credential.label',
            })}
          </span>
        </h3>
      </Col>
      <Col md="12" sm="12">
        <TextField
          type={interDataVisible ? 'text' : 'password'}
          id="api_client_id"
          onBlur={formik.handleBlur}
          onChange={(e) =>
            formik.setFieldValue(
              'api_client_id',
              e.target.value
            )
          }
          value={formik.values.api_client_id}
          placeholder={intl.formatMessage({
            id: 'bank-account.api_client_id',
          })}
          label={intl.formatMessage({
            id: 'bank-account.api_client_id',
          })}
          rightIcon={
            <Eye
              onClick={() => setInterDataVisible(!interDataVisible)}
            />
          }
        />
      </Col>
      <Col md="12" sm="12">
        <TextField
          type={interDataVisible ? 'text' : 'password'}
          id="api_client_secret"
          onBlur={formik.handleBlur}
          onChange={(e) =>
            formik.setFieldValue(
              'api_client_secret',
              e.target.value
            )
          }
          value={formik.values.api_client_secret}
          placeholder={intl.formatMessage({
            id: 'bank-account.api_client_secret',
          })}
          label={intl.formatMessage({
            id: 'bank-account.api_client_secret',
          })}
          rightIcon={
            <Eye
              onClick={() => setInterDataVisible(!interDataVisible)}
            />
          }
        />
      </Col>
      <Col className="mt-1" sm="12">
        <h3 className="mb-1 text-primary">
          <span className="align-middle">Anexar Certificados</span>
        </h3>
      </Col>
    
      <Col md="6" sm="12">
        <span className="switch-label">
          {intl.formatMessage({
            id: 'bank-account.api_file_cert_digital',
          })}
        </span>
        {Boolean(formik.values.api_file_cert_digital) ? (              
          <ListFiles
                  allFiles={formik.values.api_file_cert_digital}
                  handleDeleteFile={handleDeleteReceipt}
                  isBankAccountApi={true}   
                  fieldFile={'api_file_cert_digital'}
                  canDeleteFiles={true}
                  permissionToDeleteFiles={'bank-accounts.destroy'}
                  />
          )
        :
        (
          <BankAccountDropzone
            formik={formik}
            setIsUploadingFile={setIsUploadingCertDigital}
            fieldFile={'arr_api_file_cert_digital'}
            bank_account_id={bank_account_id}
            handleDeleteFile={handleDeleteReceipt}
            isAccept={'.crt'}
          />
        )}
      </Col>
           
      <Col md="6" sm="12">
        <span className="switch-label">          
          {intl.formatMessage({
            id: 'bank-account.api_file_ssl_key',
          })}
        </span>
        {Boolean(formik.values.api_file_ssl_key) ? (              
          <ListFiles
                  allFiles={formik.values.api_file_ssl_key}
                  handleDeleteFile={handleDeleteReceipt}
                  isBankAccountApi={true}   
                  fieldFile={'api_file_ssl_key'}
                  canDeleteFiles={true}
                  permissionToDeleteFiles={'bank-accounts.destroy'}
                  />
          )
        :
        (
          <BankAccountDropzone
            formik={formik}
            setIsUploadingFile={setIsUploadingSslKey}
            fieldFile={'arr_api_file_ssl_key'}
            bank_account_id={bank_account_id}
            handleDeleteFile={handleDeleteReceipt}
            isAccept={'.key'}
          />
        )}
      </Col>
      <div className={showModalDeleteReceipt ? 'global-dialog' : ''}>
          <SweetAlert
            showCancel
            reverseButtons={false}
            cancelBtnBsStyle="secondary"
            confirmBtnBsStyle="danger"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            warning
            title="O arquivo será excluído!"
            show={showModalDeleteReceipt}
            onConfirm={submitDeleteFile}
            onClose={() => setShowModalDeleteReceipt(false)}
            onCancel={() => setShowModalDeleteReceipt(false)}
          >
            <h4 className="sweet-alert-text my-2">
              Confirma que deseja remover este arquivo?
            </h4>
          </SweetAlert>
        </div>
    </Row>
  );
};

BankAccountApiInter.propTypes = {
  formik: propTypes.object.isRequired,
};

BankAccountApiInter.defaultProps = {};

export default BankAccountApiInter;
