import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Row, Col } from 'reactstrap';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import TransactionsImport from '../../transactions/import/TransactionsImport';

import PermissionGate from "../../../../PermissionGate";

const ReceivableImport = () => {
  const intl = useIntl();
  return (
    <PermissionGate permissions={'receivables.import'}>
      <Row className="app-user-list">
        <Col md="12" sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="button.import.receivable" />}
            breadCrumbParents={[
              {
                name: intl.formatMessage({ id: 'button.list.receivable' }),
                link: '/admin/receivable/list',
              },
            ]}
            breadCrumbActive={<FormattedMessage id="button.import.receivable" />}
          />
        </Col>
        <Col md="12">
          <TransactionsImport transactionType={1} />
        </Col>
      </Row>
    </PermissionGate>
  );
};

export default ReceivableImport;
