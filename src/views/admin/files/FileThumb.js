import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import { X } from 'react-feather';

export default function FileThumb({ file, fileIndex, formik, isBankAccountApi, fieldFile, handleDeleteFile }) {
  const fyleTypeOptions = [
    { value: 'INVOICE-PDF', label: 'NF-PDF' },
    { value: 'INVOICE-XML', label: 'NF-XML' },
    { value: 'BANK-SLIP', label: 'Boleto' },
    { value: 'RECEIPT', label: 'Comprovante' },
    { value: 'OTHERS', label: 'Outros' },
  ];

  let fileId = fieldFile;
  if(!Boolean(isBankAccountApi)){
    fileId = file.id;
  }

  return (
    <Row>
      <Col md="12" sm="12">
      {Boolean(isBankAccountApi) && (
        <button
          type="button"
          className="btn btn-link text-danger p-0 float-right"
          onClick={() => handleDeleteFile(fileId)}
        >
          <X />
        </button>
      )}
        <div className="dz-thumb" key={file.name}>
          <div className="dz-thumb-inner">
            <img src={file.preview} className="dz-img" alt={file.name} />
          </div>
        </div>
      </Col>
      {!Boolean(isBankAccountApi) && (
      <Col md="12" sm="12">
        <FormGroup>
          <Label for="file_type">
            <FormattedMessage id="transactions.file_type" /> *
          </Label>
          <Select
            options={fyleTypeOptions}
            className="React mr-2"
            classNamePrefix="select"
            id="file_type"
            name="file_type"
            onBlur={formik.handleBlur}
            value={fyleTypeOptions.find(
              (fyleTypeOption) => fyleTypeOption.value === file.file_type
            )}
            defaultValue={fyleTypeOptions.filter(
              (fyleTypeOption) => fyleTypeOption.value === file.file_type
            )}
            onChange={(opt) => {
              const newFiles = formik.values.files.map((_file, i) => {
                if (i === fileIndex) {
                  return {
                    ..._file,
                    file_type: opt.value,
                  };
                }
                return _file;
              });
              formik.setFieldValue('files', newFiles);
            }}
          />
          {formik.errors.files && formik.touched.files ? (
            <div className="invalid-tooltip mt-25">{formik.errors.files}</div>
          ) : null}
        </FormGroup>
      </Col>
      )}
    </Row>
  );
}

FileThumb.propTypes = {
  file: PropTypes.object.isRequired,
  fileIndex: PropTypes.number.isRequired,
  formik: PropTypes.object.isRequired,
};
