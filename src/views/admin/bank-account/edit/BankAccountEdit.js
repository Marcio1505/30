import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Card, CardBody, Row, Col } from 'reactstrap';
import BankAccountForm from './BankAccountForm';
import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import { showBankAccount } from '../../../../services/apis/bank_account.api';
import { fetchBanksList } from '../../../../services/apis/banks.api';

import PermissionGate from '../../../../PermissionGate';

const BankAccountEdit = ({ currentCompanyId }) => {
  const history = useHistory();
  const intl = useIntl();
  const { bank_account_id } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [bankAccount, setBankAccount] = useState({});
  const [banks, setBanks] = useState({});

  let permission = 'bank-accounts.store';
  if (bank_account_id) {
    permission = 'bank-accounts.show';
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataBanks } = await fetchBanksList();
      let dataBankAccount = {};

      if (bank_account_id) {
        // let { data: dataBankAccount } = await showBankAccount({ id: bank_account_id });
        const res = await showBankAccount({ id: bank_account_id });
        dataBankAccount = res.data;
      }

      const arrayDataIuli = [
        {
          value: 1001,
          label: '1001 - Banco IULI',
          name: 'Banco IULI',
        },
      ];

      const arrayDataFormatedBanks = dataBanks.map((bank) => ({
        value: bank.id,
        label: `${bank.code} - ${bank.name}`,
        name: bank.name,
      }));

      setBanks(arrayDataIuli.concat(arrayDataFormatedBanks));
      setBankAccount(dataBankAccount);
      setInitialized(true);
    };
    fetchData();
  }, [bank_account_id]);

  useEffect(() => {
    if (
      bankAccount?.company_id &&
      currentCompanyId !== bankAccount.company_id
    ) {
      history.push(`/admin/bank-account/list`);
    }
  }, [currentCompanyId]);

  return (
    <>
      {initialized && (
        <PermissionGate permissions={permission}>
          <Row>
            <Col sm="12">
              <Breadcrumbs
                breadCrumbTitle={
                  bank_account_id
                    ? `#${bank_account_id} - ${bankAccount.name}`
                    : intl.formatMessage({ id: 'button.create.bank_account' })
                }
                breadCrumbParents={[
                  {
                    name: intl.formatMessage({
                      id: 'button.list.bank_account',
                    }),
                    link: '/admin/bank-account/list',
                  },
                ]}
                breadCrumbActive={
                  bank_account_id
                    ? intl.formatMessage({ id: 'button.edit.bank_account' })
                    : intl.formatMessage({ id: 'button.create.bank_account' })
                }
              />
            </Col>
            <Col sm="12">
              <Card>
                <CardBody className="pt-2">
                  <BankAccountForm bankAccount={bankAccount} banks={banks} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </PermissionGate>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(BankAccountEdit);
