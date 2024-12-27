import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import { fetchProductsList } from '../../../../services/apis/product.api';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';
import PermissionGate from '../../../../PermissionGate';

const uploaderOptions = {
  apiKey: 'free', // Substitua pela sua API Key do Upload.io
};

const NoteEntry = ({ currentCompanyId }) => {
  const [modal, setModal] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);

  const toggle = () => setModal(!modal);

  const handleUploadComplete = (files) => {
    setUploadedFiles(files);
    console.log('Arquivos enviados:', files);
  };

  const [rowData, setRowData] = useState([]);

  const loadProducts = async () => {
    const { data: rowData } = await fetchProductsList();
    setRowData(rowData);
  };

  useEffect(() => {
    loadProducts();
  }, [currentCompanyId]);
  const getUploadParams = ({ meta }) => {
    return { url: 'https://httpbin.org/post' };
  };

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };

  return (
    <PermissionGate permissions="companies.products.index">
      <Row className="app-user-list">
        <Col md="8" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="note-entry" />}
            breadCrumbActive={<FormattedMessage id="note-entry.list" />}
          />
        </Col>
      </Row>
      <div className="text-center">
        <Dropzone
          getUploadParams={getUploadParams}
          onChangeStatus={handleChangeStatus}
          onSubmit={handleSubmit}
          accept="image/*,audio/*,video/*"
        />
      </div>
    </PermissionGate>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

NoteEntry.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(NoteEntry);
