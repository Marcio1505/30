import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import { Row, Col } from 'reactstrap';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  updateSupplier,
  createSupplier,
  showSupplier,
} from '../../../../services/apis/supplier.api';

import CompanyForm from '../../company/edit/CompanyForm';

import PermissionGate from "../../../../PermissionGate";

const SupplierEdit = ({ currentCompanyId }) => {
  const history = useHistory();
  const { company_id } = useParams();
  const [company, setCompany] = useState({});
  const [initialized, setInitialized] = useState(false);

  let permissionForm = '';
  if(company_id)
  {
    permissionForm = 'suppliers.show';
  }
  else
  {
    permissionForm = 'companies.suppliers.store';
  }

  useEffect(() => {
    const fetchData = async () => {
      let dataCompany = {};
      if (company_id) {
        // let { data: dataCompany } = await showSupplier({ id: company_id });
        const res = await showSupplier({ id: company_id });
        dataCompany = res.data;
      }

      setCompany(dataCompany);
      setInitialized(true);
    };
    fetchData();
  }, [company_id]);

  useEffect(() => {
    if (company.company_id && currentCompanyId !== company.company_id) {
      history.push(`/admin/supplier/list`);
    }
  }, [currentCompanyId]);

  const formSubmit = async (payload) => {
    if (company_id) {
      await updateSupplier(payload);
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Fornecedor atualizado com sucesso',
          hasTimeout: true,
        })
      );
      history.push(`/admin/supplier/list`);
    } else {
      const { data } = await createSupplier(payload);
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Fornecedor criado com sucesso',
          hasTimeout: true,
        })
      );
      history.push(`/admin/supplier/list`);
    }
  };

  return (
    <>
      {initialized && (
        <>
        <PermissionGate permissions={permissionForm}>
          <Row>
            <Col sm="12">
              <Breadcrumbs
                breadCrumbTitle={
                  company_id ? `${company.company_name}` : 'Novo fornecedor'
                }
                breadCrumbParents={[
                  {
                    name: 'Listar Fornecedores',
                    link: '/admin/supplier/list',
                  },
                ]}
                breadCrumbActive={
                  company_id ? 'Editar Fornecedor' : 'Adicionar fornecedor'
                }
              />
            </Col>
          </Row>
          <CompanyForm
            companyType="supplier"
            company={company}
            companyId={company_id}
            formSubmit={formSubmit}
          />          
        </PermissionGate>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(SupplierEdit);
