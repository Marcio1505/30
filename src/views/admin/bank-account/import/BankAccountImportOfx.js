import React from 'react';
import { Row, Col } from 'reactstrap';

import { FormattedMessage } from 'react-intl';
import DropzoneBasic from './DropzoneBasic';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import '../../../../assets/scss/plugins/extensions/dropzone.scss';

const BankAccountImportOfx = () => (
  <Row className="app-user-list">
    <Col md="12" sm="12">
      <Breadcrumbs
        breadCrumbTitle={<FormattedMessage id="bank_accounts" />}
        breadCrumbParents={[
          {
            name: <FormattedMessage id="button.import.bank_account" />,
            link: '/admin/bank-account/list',
          },
        ]}
        breadCrumbActive={<FormattedMessage id="button.importofx.bank_account" />}
      />
    </Col>
    <Col md="12">
      <DropzoneBasic />{' '}
    </Col>
  </Row>
);

export default BankAccountImportOfx;
