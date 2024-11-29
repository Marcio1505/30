import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, CardTitle } from 'reactstrap';
import { useDropzone } from 'react-dropzone';

import FileThub from './FileThumb';
import '../../../assets/scss/plugins/extensions/dropzone.scss';

export default function FileDropzone({
  formik,
  setIsUploadingFile,
  getSignedUrl,
  putFile,
  isBankAccountApi,
  isAccept,
  fieldFile,
  bank_account_id,
  handleDeleteFile,
}) {
  fieldFile = fieldFile ?? 'files';
  const fieldFormikFile = formik.values[fieldFile] || []; 
  
  const { getRootProps, getInputProps,  } = useDropzone({
    maxFiles: 2,
    multiple: !Boolean(isBankAccountApi),
    onDrop: async (acceptedFiles) => {      
      setIsUploadingFile(true);
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const uploadFiles = async (_newFiles) => {
        const newUploadedFiles = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const file of _newFiles) {
          if (file.size > 1000000) {
            alert('File size is too large');
            return;
          }

          const signedUrlData = await getSignedUrl({
            file_type: file.type,
          });

          const putFileResponse = await putFile({
            signedUrl: signedUrlData.url,
            file,
          });

          if (putFileResponse.status === 200) {
            newUploadedFiles.push({
              name: file.name,
              preview: file.preview,
              file_name: file.name,
              // file_name: signedUrlData.file_name,
              file_type: signedUrlData.file_type,
              file_path: signedUrlData.file_path,
            });
          }
        }
        return newUploadedFiles;
      };

      const newUploadedFiles = await uploadFiles(newFiles);

      if (newUploadedFiles?.length > 0) {
        formik.setFieldValue(
          fieldFile, //'files',
          //formik.values.files.concat(newUploadedFiles)
          fieldFormikFile.concat(newUploadedFiles)
        );
      }
      setIsUploadingFile(false);
    },
    accept: isAccept ?? '.png, .jpg, .jpeg, .pdf, .xml, .xls, .xlsx',
  });

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      //formik.values.files.forEach((file) => URL.revokeObjectURL(file.preview));
      fieldFormikFile.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    //[formik.values.files]
    [fieldFormikFile]
  );

  return (
    <>
    {!Boolean(isBankAccountApi) ? (
    <Card>      
      <CardHeader className="px-0 mx-0">
        <CardTitle>
          Adicionar Documentos
        </CardTitle>
      </CardHeader>
      
      <CardBody className="px-0 mx-0">
        <section>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p className="mx-1">
              Arraste arquivos para cá ou clique para selecionar arquivos
            </p>
          </div>
          <aside className="thumb-container">
            {formik.values.files.map((file, fileIndex) => {
              const currentFile = formik.values.files[fileIndex];
              return (
                <FileThub
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${fileIndex}-${file.name}`}
                  file={currentFile}
                  fileIndex={fileIndex}
                  formik={formik}
                />
              );
            })}
          </aside>
        </section>
      </CardBody>
    </Card>
    )
    :
    (    
    <Card>            
      <CardBody className="px-0 mx-0">   
        <section>
          {!Boolean(fieldFormikFile.length) && (         
            <>
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p className="mx-1">
                  Arraste o arquivo para cá ou clique para selecionar o arquivo
                </p>
              </div>
            </>
          )}
          <aside className="thumb-container">
            {fieldFormikFile.map((file, fileIndex) => {
              const currentFile = fieldFormikFile[fileIndex];
              return (
                <FileThub
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${fileIndex}-${file.name}`}
                  file={currentFile}
                  fileIndex={fileIndex}
                  formik={formik}
                  isBankAccountApi={isBankAccountApi}
                  fieldFile={fieldFile}
                  handleDeleteFile={handleDeleteFile}
                />
              );
            })}
          </aside>
        </section>
      </CardBody>
    </Card>
    )}
    </>
  );
}

FileDropzone.propTypes = {
  formik: PropTypes.object.isRequired,
  setIsUploadingFile: PropTypes.func.isRequired,
  getSignedUrl: PropTypes.func.isRequired,
  putFile: PropTypes.func.isRequired,
};
