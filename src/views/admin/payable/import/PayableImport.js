import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Row, Col } from 'reactstrap';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import TransactionsImport from '../../transactions/import/TransactionsImport';

import PermissionGate from "../../../../PermissionGate";

const PayableImport = () => {
  const intl = useIntl();
  return (
    <PermissionGate permissions={'payables.import'}>
      <Row className="app-user-list">
        <Col md="12" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="button.import.payable" />}
            breadCrumbParents={[
              {
                name: intl.formatMessage({ id: 'button.list.payable' }),
                link: '/admin/payable/list',
              },
            ]}
            breadCrumbActive={<FormattedMessage id="button.import.payable" />}
          />
        </Col>
        <Col md="12">
          <TransactionsImport transactionType={2} />
        </Col>
      </Row>
    </PermissionGate>
  );
};

export default PayableImport;
