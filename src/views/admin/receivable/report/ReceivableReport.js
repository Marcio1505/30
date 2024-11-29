import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'reactstrap';
import TransactionsReport from '../../transactions/report/TransactionsReport';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import PermissionGate from "../../../../PermissionGate";

const ReceivableReport = () => {
  const intl = useIntl();
  return (
    <>
    <PermissionGate permissions={'receivables.report'}>
      <Row>
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle={<FormattedMessage id="receivables" />}
            breadCrumbParents={[
              {
                name: intl.formatMessage({ id: 'button.list.receivable' }),
                link: '/admin/receivable/list',
              },
            ]}
            breadCrumbActive={
              <FormattedMessage id="button.report.receivable" />
            }
          />
        </Col>
      </Row>
      <TransactionsReport transactionType="receivable" />
    </PermissionGate>
    </>
  );
};

export default ReceivableReport;
