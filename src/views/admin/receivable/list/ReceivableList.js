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
} from '../../../../new.redux/receivables/receivables.actions';

import PermissionGate from '../../../../PermissionGate';

const ReceivableList = ({
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
      <PermissionGate permissions="companies.receivables.index">
        <Row>
          <Col md="8" sm="12">
            <Breadcrumbs
              breadCrumbTitle={<FormattedMessage id="receivables" />}
              breadCrumbActive={
                <FormattedMessage id="button.list.receivable" />
              }
            />
          </Col>
          <PermissionGate permissions="companies.receivables.store">
            <Col
              className="d-flex justify-content-end flex-wrap"
              md="4"
              sm="12"
            >
              <Button.Ripple
                className="my-1"
                color="primary"
                onClick={() => history.push(`/admin/receivable/edit/`)}
              >
                <FormattedMessage id="button.create.receivable" />
              </Button.Ripple>
            </Col>
          </PermissionGate>
        </Row>
        <TransactionsList
          transactionType="RECEIVABLE"
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
  filter_due_or_payment_date:
    state.receivables.filter.filter_due_or_payment_date,
  filter_competency_date: state.receivables.filter.filter_competency_date,
  filter_computed_status: state.receivables.filter.filter_computed_status,
  filter_category_id: state.receivables.filter.filter_category_id,
  sortModel: state.receivables.sortModel,
  pageSize: state.receivables.pageSize,
});

const mapDispatchToProps = {
  setFilterDueOrPaymentDate,
  setFilterCompetencyDate,
  setFilterComputedStatus,
  setFilterCategoryId,
  setSortModel,
  setPageSize,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceivableList);
