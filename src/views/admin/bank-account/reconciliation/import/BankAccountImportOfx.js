import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import DropzoneBasic from './DropzoneBasic';
import DropzoneBasicPlataform from './DropzoneBasicPlataform';
import Breadcrumbs from '../../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import '../../../../../assets/scss/plugins/extensions/dropzone.scss';

import { showBankAccount } from '../../../../../services/apis/bank_account.api';

import PermissionGate from '../../../../../PermissionGate';

const BankAccountImportOfx = () => {
  let dataBankAccount = {};
  const { bank_account_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [bankAccount, setBankAccount] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await showBankAccount({ id: bank_account_id });
      dataBankAccount = res.data;
      setBankAccount(dataBankAccount);
      setInitialized(true);
    };
    fetchData();
  }, [bank_account_id]);

  let topLabel = null;
  topLabel = bankAccount.is_platform
    ? 'button.import.statement.plataform'
    : 'button.importofx.bank_account';

  return (
    <>
      {initialized && (
        <PermissionGate permissions="api.companies.bank_accounts.import-ofx">
          <Row className="app-user-list">
            <Col md="12" sm="12">
              <Breadcrumbs
                breadCrumbTitle={<FormattedMessage id="bank_accounts" />}
                breadCrumbParents={[
                  {
                    name: <FormattedMessage id="button.list.bank_account" />,
                    link: '/admin/bank-account/list',
                  },
                ]}
                breadCrumbActive={<FormattedMessage id={topLabel} />}
              />
            </Col>
            <Col md="12">
              {bankAccount.is_platform ? (
                <>
                  <DropzoneBasicPlataform bankAccount={bankAccount} />
                </>
              ) : (
                <>
                  <DropzoneBasic />{' '}
                </>
              )}
            </Col>
          </Row>
        </PermissionGate>
      )}
    </>
  );
};

export default BankAccountImportOfx;
