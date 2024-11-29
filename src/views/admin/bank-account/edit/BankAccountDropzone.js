import React from 'react';
import PropTypes from 'prop-types';

import FileDropzone from '../../files/FileDropzone';

import {
  getSignedUrl,
  putBankAccount,
} from '../../../../services/apis/bank_account.api';

export default function BankAccountDropzone({ formik, setIsUploadingFile, fieldFile, bank_account_id, handleDeleteFile, isAccept }) {
  return (
    <FileDropzone
      formik={formik}
      setIsUploadingFile={setIsUploadingFile}
      getSignedUrl={getSignedUrl}
      putFile={putBankAccount}
      isBankAccountApi={true}
      isAccept={isAccept}
      fieldFile={fieldFile}
      bank_account_id={bank_account_id}
      handleDeleteFile={handleDeleteFile}
    />
  );
}

BankAccountDropzone.propTypes = {
  formik: PropTypes.object.isRequired,
  setIsUploadingFile: PropTypes.func.isRequired,
};
