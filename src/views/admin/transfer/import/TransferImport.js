import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Row, Col } from 'reactstrap';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import DropzoneBasic from '../../transfer/import/DropzoneBasic';

import PermissionGate from "../../../../PermissionGate";

const TransferImport = () => {
  const intl = useIntl();
  return (
    // <PermissionGate permissions={'transfers.import'}>
      <Row className="app-user-list">
        <Col md="12" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="button.import.transfer" />}
            breadCrumbParents={[
              {
                name: intl.formatMessage({ id: 'button.list.transfer' }),
                link: '/admin/transfer/list',
              },
            ]}
            breadCrumbActive={<FormattedMessage id="button.import.transfer" />}
          />
        </Col>
        <Col md="12">
          <DropzoneBasic transactionType={1} />
        </Col>
      </Row>
    // </PermissionGate>
  );
};

export default TransferImport;
