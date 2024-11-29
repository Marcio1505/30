import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Button } from 'reactstrap';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';
import TransactionsList from '../../transactions/list/TransactionsList';
import {
  setFilterDueOrPaymentDate,
  setFilterCompetencyDate,
  setFilterComputedStatus,
  setFilterCategoryId,
  setSortModel,
  setPageSize,
} from '../../../../new.redux/payables/payables.actions';

import PermissionGate from '../../../../PermissionGate';

const PayableList = ({
  filter_due_or_payment_date,
  filter_competency_date,
  filter_computed_status,
  filter_category_id,
  sortModel,
  pageSize,
  setFilterDueOrPaymentDate,
  setFilterCompetencyDate,
  setFilterComputedStatus,
  setFilterCategoryId,
  setSortModel,
  setPageSize,
}) => {
  const history = useHistory();
  return (
    <>
      <PermissionGate permissions="companies.payables.index">
        <Row>
          <Col md="8" sm="12">
            <Breadcrumbs
              breadCrumbTitle={<FormattedMessage id="payables" />}
              breadCrumbActive={<FormattedMessage id="button.list.payable" />}
            />
          </Col>
          <PermissionGate permissions="companies.payables.store">
            <Col
              className="d-flex justify-content-end flex-wrap"
              md="4"
              sm="12"
            >
              <Button.Ripple
                className="my-1"
                color="primary"
                onClick={() => history.push(`/admin/payable/edit/`)}
              >
                <FormattedMessage id="button.create.payable" />
              </Button.Ripple>
            </Col>
          </PermissionGate>
        </Row>
        <TransactionsList
          transactionType="PAYABLE"
          filter_due_or_payment_date={filter_due_or_payment_date}
          filter_competency_date={filter_competency_date}
          filter_computed_status={filter_computed_status}
          filter_category_id={filter_category_id}
          sortModel={sortModel}
          pageSize={pageSize}
          setFilterDueOrPaymentDate={setFilterDueOrPaymentDate}
          setFilterCompetencyDate={setFilterCompetencyDate}
          setFilterComputedStatus={setFilterComputedStatus}
          setFilterCategoryId={setFilterCategoryId}
          setSortModel={setSortModel}
          setPageSize={setPageSize}
        />
      </PermissionGate>
    </>
  );
};

const mapStateToProps = (state) => ({
  filter_due_or_payment_date: state.payables.filter.filter_due_or_payment_date,
  filter_competency_date: state.payables.filter.filter_competency_date,
  filter_computed_status: state.payables.filter.filter_computed_status,
  filter_category_id: state.payables.filter.filter_category_id,
  sortModel: state.payables.sortModel,
  pageSize: state.payables.pageSize,
});

const mapDispatchToProps = {
  setFilterDueOrPaymentDate,
  setFilterCompetencyDate,
  setFilterComputedStatus,
  setFilterCategoryId,
  setSortModel,
  setPageSize,
};

export default connect(mapStateToProps, mapDispatchToProps)(PayableList);
