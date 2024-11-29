import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';

import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Trash2 } from 'react-feather';
import SweetAlert from 'react-bootstrap-sweetalert';

import Breadcrumbs from '../../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import { store } from '../../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../../new.redux/actions';

import {
  restoreOfxIgnored,
  fetchOfxList,
} from '../../../../../services/apis/ofx_transaction.api';

import '../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../../assets/scss/pages/users.scss';

import BasicListTable from '../../../../../components/tables/BasicListTable';

import {
  formatMoney,
  formatDateToHumanString,
} from '../../../../../utils/formaters';

import PermissionGate from '../../../../../PermissionGate';

const ConciliationRulesList = ({ currentCompanyId, filter }) => {
  
  return ('ConciliationRulesList');
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(ConciliationRulesList);
