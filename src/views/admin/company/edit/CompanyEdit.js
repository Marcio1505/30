import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import CompanyForm from './CompanyForm';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';
import {
  updateCompany,
  createCompany,
  showCompany,
} from '../../../../services/apis/company.api';
import { uploadFile } from '../../../../services/apis/file.api';
import {
  updateCompanies,
  updateCurrentCompany,
} from '../../../../redux/actions/companies/index';

import PermissionGate from '../../../../PermissionGate';

const CompanyEdit = ({
  companies,
  currentCompanyId,
  updateCompanies,
  updateCurrentCompany,
}) => {
  const history = useHistory();
  const { company_id } = useParams();
  const [company, setCompany] = useState({});
  const [initialized, setInitialized] = useState(false);
  const firstUpdate = useRef(true);

  let permission = 'public';
  if (company_id) {
    permission = 'companies.update';
  }

  const fetchData = async () => {
    let dataCompany = {};
    if (company_id) {
      const res = await showCompany({ id: company_id });
      dataCompany = res.data;
    }

    setCompany(dataCompany);
    setInitialized(true);
  };

  useEffect(() => {
    if (!firstUpdate.current) {
      if (currentCompanyId !== company_id) {
        history.push(`/admin/company/edit/${currentCompanyId}`);
      }
    } else {
      firstUpdate.current = false;
    }
  }, [currentCompanyId]);

  useEffect(() => {
    fetchData();
  }, [company_id]);

  const formSubmit = async (payload) => {
    if (company_id) {
      const certificatePassword = payload.company.certificate_password;
      delete payload.company.certificate_name;
      delete payload.company.certificate_password;
      delete payload.company.certificate_valid;
      const { data: updatedCompany } = await updateCompany(payload);
      if (payload.arquivo) {
        await uploadFile({
          ...payload,
          company: {
            ...payload.company,
            certificate_password: certificatePassword,
          },
        });
      }
      const new_companies = companies.map((company) => {
        if (company.id === parseInt(company_id)) {
          return updatedCompany;
        }
        return company;
      });
      updateCompanies(new_companies);
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Empresa atualizada com sucesso',
          hasTimeout: true,
        })
      );
      history.push(`/admin`);
    } else {
      const { data } = await createCompany(payload);
      updateCompanies([...companies, data]);
      updateCurrentCompany(data.id);
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Empresa criada com sucesso',
          hasTimeout: true,
        })
      );
      // history.push(`/admin/company/edit/${data.id}`);
    }
  };

  return (
    <>
      {initialized && (
        <PermissionGate permissions={permission}>
          <CompanyForm
            companyType="company"
            company={company}
            companyId={company_id}
            formSubmit={formSubmit}
          />
        </PermissionGate>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  companies: state.companies.companies,
  currentCompanyId: state.companies.currentCompanyId,
});

CompanyEdit.propTypes = {
  companies: PropTypes.array.isRequired,
  currentCompanyId: PropTypes.number.isRequired,
  updateCompanies: PropTypes.func.isRequired,
  updateCurrentCompany: PropTypes.func.isRequired,
};

CompanyEdit.defaultProps = {};

export default connect(mapStateToProps, {
  updateCompanies,
  updateCurrentCompany,
})(CompanyEdit);
