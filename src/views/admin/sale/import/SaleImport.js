import React from 'react';
import { Row, Col } from 'reactstrap';
// import ExtensionsHeader from "../extensionsHeader"
import { FormattedMessage } from 'react-intl';
import DropzoneBasic from './DropzoneBasic';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import '../../../../assets/scss/plugins/extensions/dropzone.scss';

const SaleImport = () => (
  <Row className="app-user-list">
    <Col md="12" sm="12">
      <Breadcrumbs
        breadCrumbTitle={<FormattedMessage id="sales" />}
        breadCrumbParents={[
          {
            name: <FormattedMessage id="button.list.sale" />,
            link: '/admin/sale/list',
          },
        ]}
        breadCrumbActive={<FormattedMessage id="sales.import" />}
      />
    </Col>
    <Col md="12">
      <DropzoneBasic />{' '}
    </Col>
  </Row>
);

export default SaleImport;
