import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'react-feather';

import PermissionGate from '../../../PermissionGate';
import ExcelImage from '../../../assets/img/files/excel.png';
import PdfImage from '../../../assets/img/files/pdf.png';
import XmlImage from '../../../assets/img/files/xml.png';

const File = ({
  file,
  handleDeleteFile,
  isBankAccountApi,
  fieldFile,
  canDeleteFile,
  permissionToDeleteFile,
}) => {
  let fileType = null;
  let fileName = null;
  let filePath = null;
  let fileId = null;

  if (!isBankAccountApi) {
    fileType = file.file_name.split('.')[1];
    fileName = file.file_name;
    fileId = file.id;
  } else {
    fileType = file.split('.')[1];
    fileName = file.split('/')[4];
    filePath = `https://iuli-financial-local.s3.amazonaws.com/${file}`;
    fileId = fieldFile;
  }

  let thumb = (
    <div
      className="preview"
      style={{
        width: '100px',
        height: '90px',
        backgroundImage: `url(${file.file_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
  switch (fileType) {
    // accept: '.png, .jpg, .jpeg, .pdf, .xml, .xls, .xlsx',
    case 'pdf':
      thumb = <img src={PdfImage} className="dz-img" alt={fileName} />;
      break;
    case 'xml':
      thumb = <img src={XmlImage} className="dz-img" alt={fileName} />;
      break;
    case 'xls':
    case 'xlsx':
      thumb = <img src={ExcelImage} className="dz-img" alt={fileName} />;
      break;
    case 'jpeg':
      if (isBankAccountApi) {
        thumb = <img src={filePath} className="dz-img" alt={fileName} />;
      }
      break;
    default:
      break;
  }
  return (
    <div className="mr-2">
      {canDeleteFile && (
        <PermissionGate permissions={permissionToDeleteFile}>
          <button
            type="button"
            className="btn btn-link text-danger p-0 float-right"
            onClick={() => handleDeleteFile(fileId)}
          >
            <X />
          </button>
        </PermissionGate>
      )}
      <div className="dz-thumb d-block">
        <a href={file.file_url} target="_blank" rel="noreferrer">
          <div className="dz-thumb-inner">{thumb}</div>
        </a>
      </div>
      <small
        className="d-block"
        style={{
          width: '100px',
        }}
      >
        {!isBankAccountApi && fileName}
      </small>
    </div>
  );
};

File.propTypes = {
  file: PropTypes.object.isRequired,
  handleDeleteFile: PropTypes.func.isRequired,
  canDeleteFile: PropTypes.bool.isRequired,
  permissionToDeleteFile: PropTypes.string.isRequired,
};

export default function ListFiles({
  allFiles,
  handleDeleteFile,
  isBankAccountApi,
  fieldFile,
  canDeleteFiles,
  permissionToDeleteFiles,
}) {
  const invoicePdfFiles = [];
  const invoiceXmlFiles = [];
  const bankSlipFiles = [];
  const receiptFiles = [];
  const otherFiles = [];

  if (!isBankAccountApi) {
    allFiles.forEach((file) => {
      switch (file.file_type) {
        case 'INVOICE-PDF':
          invoicePdfFiles.push(file);
          break;
        case 'INVOICE-XML':
          invoiceXmlFiles.push(file);
          break;
        case 'BANK-SLIP':
          bankSlipFiles.push(file);
          break;
        case 'RECEIPT':
          receiptFiles.push(file);
          break;
        case 'OTHERS':
          otherFiles.push(file);
          break;
        default:
          break;
      }
    });
  }

  return (
    <>
      {!isBankAccountApi ? (
        <>
          {Boolean(invoicePdfFiles.length) && (
            <div className="my-2">
              <h5>NF PDF</h5>
              <div className="d-flex">
                {invoicePdfFiles.map((invoice_pdf) => (
                  <File
                    key={invoice_pdf.id}
                    file={invoice_pdf}
                    handleDeleteFile={handleDeleteFile}
                    canDeleteFile={canDeleteFiles}
                    permissionToDeleteFile={permissionToDeleteFiles}
                  />
                ))}
              </div>
            </div>
          )}
          {Boolean(invoiceXmlFiles.length) && (
            <div className="my-2">
              <h5>NF XML</h5>
              <div className="d-flex">
                {invoiceXmlFiles.map((invoice_xml) => (
                  <File
                    key={invoice_xml.id}
                    file={invoice_xml}
                    handleDeleteFile={handleDeleteFile}
                    canDeleteFile={canDeleteFiles}
                    permissionToDeleteFile={permissionToDeleteFiles}
                  />
                ))}
              </div>
            </div>
          )}
          {Boolean(bankSlipFiles.length) && (
            <div className="my-2">
              <h5>Boletos</h5>
              <div className="d-flex">
                {bankSlipFiles.map((bank_slip) => (
                  <File
                    key={bank_slip.id}
                    file={bank_slip}
                    handleDeleteFile={handleDeleteFile}
                    canDeleteFile={canDeleteFiles}
                    permissionToDeleteFile={permissionToDeleteFiles}
                  />
                ))}
              </div>
            </div>
          )}
          {Boolean(receiptFiles.length) && (
            <div className="my-2">
              <h5>Recibos</h5>
              <div className="d-flex">
                {receiptFiles.map((receipt) => (
                  <File
                    key={receipt.id}
                    file={receipt}
                    handleDeleteFile={handleDeleteFile}
                    canDeleteFile={canDeleteFiles}
                    permissionToDeleteFile={permissionToDeleteFiles}
                  />
                ))}
              </div>
            </div>
          )}
          {Boolean(otherFiles.length) && (
            <div className="my-2">
              <h5>Outros</h5>
              <div className="d-flex">
                {otherFiles.map((others) => (
                  <File
                    key={others.id}
                    file={others}
                    handleDeleteFile={handleDeleteFile}
                    canDeleteFile={canDeleteFiles}
                    permissionToDeleteFile={permissionToDeleteFiles}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {Boolean(allFiles) && (
            <div className="my-2">
              <div className="d-flex">
                <File
                  key={allFiles}
                  file={allFiles}
                  handleDeleteFile={handleDeleteFile}
                  isBankAccountApi={isBankAccountApi}
                  fieldFile={fieldFile}
                  canDeleteFile={canDeleteFiles}
                  permissionToDeleteFile={permissionToDeleteFiles}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

ListFiles.propTypes = {
  allFiles: PropTypes.array.isRequired,
  handleDeleteFile: PropTypes.func.isRequired,
  canDeleteFiles: PropTypes.bool.isRequired,
  permissionToDeleteFiles: PropTypes.string.isRequired,
};
