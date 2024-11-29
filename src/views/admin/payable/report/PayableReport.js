import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'reactstrap';
import TransactionsReport from '../../transactions/report/TransactionsReport';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import PermissionGate from "../../../../PermissionGate";

const PayableReport = () => {
  const intl = useIntl();
  return (
    <>
    <PermissionGate permissions={'payables.report'}>
      <Row>
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="payables" />}
            breadCrumbParents={[
              {
                name: intl.formatMessage({ id: 'button.list.payable' }),
                link: '/admin/payable/list',
              },
            ]}
            breadCrumbActive={<FormattedMessage id="button.print" />}
          />
        </Col>
      </Row>
      <TransactionsReport transactionType="payable" />
      </PermissionGate>
    </>
  );
};

export default PayableReport;
