import React from 'react';
import PropTypes from 'prop-types';

import FileDropzone from '../../files/FileDropzone';

import {
  getSignedUrl,
  putReceipt,
} from '../../../../services/apis/transaction_receipt.api';

export default function TransactionDropzone({ formik, setIsUploadingFile }) {
  return (
    <FileDropzone
      formik={formik}
      setIsUploadingFile={setIsUploadingFile}
      getSignedUrl={getSignedUrl}
      putFile={putReceipt}
    />
  );
}

TransactionDropzone.propTypes = {
  formik: PropTypes.object.isRequired,
  setIsUploadingFile: PropTypes.func.isRequired,
};
