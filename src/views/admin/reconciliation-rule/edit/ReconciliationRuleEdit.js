import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, CardBody, Row, Col, Form, Button } from 'reactstrap';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import {
  showReconciliationRule,
  updateReconciliationRule,
  createReconciliationRule,
} from '../../../../services/apis/reconciliation_rule.api';

import ReconciliationRuleForm from './ReconciliationRuleForm';

import '../../../../assets/scss/pages/users.scss';
import Breadcrumbs from '../../../../components/@vuexy/breadCrumbs/BreadCrumb';

import PermissionGate from '../../../../PermissionGate';

const ReconciliationRuleEdit = () => {
  const history = useHistory();
  const intl = useIntl();
  const { reconciliation_rule_id: reconciliationRuleId } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [reconciliationRule, setReconciliationRule] = useState({});

  let permissionForm = 'companies.products.reconciliation-rules.store';
  let permissionButton = 'companies.products.reconciliation-rules.store';

  if (reconciliationRuleId) {
    permissionForm = 'reconciliation-rules.show';
    permissionButton = 'reconciliation-rules.update';
  }

  const onSubmit = async () => {
    console.log('onSubmit');
    console.log({ formik });

    if (reconciliationRuleId) {
      await updateReconciliationRule(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Regra de Conciliação atualizada com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/reconciliation-rule/list');
    } else {
      await createReconciliationRule(mountPayload());
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Regra de Conciliação criada com sucesso',
          hasTimeout: true,
        })
      );
      history.push('/admin/reconciliation-rule/list');
    }
  };

  const conditions = (reconciliationRule.conditions || []).map((condition) => ({
    ...condition,
    rowId: condition.id,
  }));

  const initialValues = {
    bank_accounts_ids: (reconciliationRule.bank_accounts || []).map(
      (bankAccount) => ({
        value: bankAccount.id,
        label: bankAccount.name,
      })
    ),
    name: reconciliationRule.name || '',
    description: reconciliationRule.description || '',
    status: reconciliationRule.name ? reconciliationRule.status : 1,
    ofx_transaction_type: reconciliationRule.ofx_transaction_type || '',
    priority: reconciliationRule.priority || '',
    conditions_criteria: reconciliationRule.conditions_criteria || '',
    conditions,
    action: {
      company_id: reconciliationRule.action?.company_id || null,
      category_id: reconciliationRule.action?.category_id || null,
      bank_account_id: reconciliationRule.action?.bank_account_id || null,
      to_bank_account_id: reconciliationRule.action?.to_bank_account_id || null,
      reconciliation_type: reconciliationRule.action?.reconciliation_type || '',
    },
  };

  const validationSchema = Yup.object().shape({
    bank_accounts_ids: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    // name: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    description: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    status: Yup.string().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
    ofx_transaction_type: Yup.mixed().test(
      'ofx_transaction_type',
      intl.formatMessage({ id: 'errors.required' }),
      (value) =>
        [
          null,
          'TRANSACTION_RECEIVED',
          'TRANSACTION_PAID',
          'TRANSFER_RECEIVED',
          'TRANSFER_PAID',
        ].includes(value)
    ),
    action: Yup.object().shape({
      reconciliation_type: Yup.mixed().test(
        'action.reconciliation_type',
        intl.formatMessage({ id: 'errors.required' }),
        (value) => ['SUGGESTION', 'AUTOMATIC'].includes(value)
      ),
      company_id: Yup.number().nullable(),
      category_id: Yup.number().nullable(),
      bank_account_id: Yup.number().nullable(),
      to_bank_account_id: Yup.number().nullable(),
    }),
    conditions_criteria: Yup.mixed().test(
      'conditions_criteria',
      intl.formatMessage({ id: 'errors.required' }),
      (value) => ['AND', 'OR'].includes(value)
    ),
    priority: Yup.mixed().test(
      'priority',
      intl.formatMessage({ id: 'errors.required' }),
      (value) => [1, 2, 3, 4, 5].includes(value)
    ),
    // due_date_limit_days: Yup.number().when('payment_method_id', {
    //   is: (payment_method_id) =>
    //     payment_method_id === null || payment_method_id === 3,
    //   then: Yup.number()
    //     .required(intl.formatMessage({ id: 'errors.required' }))
    //     .min(1, intl.formatMessage({ id: 'errors.min_value' }, { min: 1 }))
    //     .max(200, intl.formatMessage({ id: 'errors.max_value' }, { max: 200 })),
    //   otherwise: Yup.number(),
    // }),
    // subscription_cycle: Yup.number().when('payment_type_id', {
    //   is: (payment_type_id) => parseInt(payment_type_id) === 3,
    //   then: Yup.number()
    //     .required(intl.formatMessage({ id: 'errors.required' }))
    //     .test(
    //       'subscription_cycle',
    //       intl.formatMessage({ id: 'errors.min' }, { min: 1 }),
    //       (value) => [1, 2, 3, 4, 5, 6].includes(value)
    //     ),
    //   otherwise: Yup.number().nullable(),
    // }),
    // max_installments: Yup.number().when('payment_type_id', {
    //   is: (payment_type_id) => parseInt(payment_type_id) === 2,
    //   then: Yup.number()
    //     .required(intl.formatMessage({ id: 'errors.required' }))
    //     .min(2, intl.formatMessage({ id: 'errors.min_value' }, { min: 2 }))
    //     .max(12, intl.formatMessage({ id: 'errors.max_value' }, { max: 12 })),
    //   otherwise: Yup.number().nullable(),
    // }),
    // months_credit: Yup.number()
    //   .nullable()
    //   .min(1, intl.formatMessage({ id: 'errors.min_value' }, { min: 1 }))
    //   .max(12, intl.formatMessage({ id: 'errors.max_value' }, { max: 12 })),
  });

  const formik = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
    enableReinitialize: true,
  });

  const mountPayload = () => {
    const formatedConditions = formik.values.conditions.map((condition) => ({
      ...condition,
      value:
        condition.field === 'DAY'
          ? parseInt(condition.value, 10)
          : condition.field === 'AMOUNT'
          ? parseFloat(condition.value)
          : condition.value,
    }));

    return {
      reconciliationRule: {
        ...(reconciliationRuleId && { id: reconciliationRuleId }),
        name: formik.values.name,
        description: formik.values.description,
        ofx_transaction_type: formik.values.ofx_transaction_type,
        status: formik.values.status,
        conditions_criteria: formik.values.conditions_criteria,
        priority: formik.values.priority,
        bank_accounts_ids: formik.values.bank_accounts_ids.map(
          (bankAccount) => bankAccount.value
        ),
        conditions: formatedConditions,
        action: {
          company_id: formik.values.action.company_id,
          category_id: formik.values.action.category_id,
          bank_account_id: formik.values.action.bank_account_id,
          to_bank_account_id: formik.values.action.to_bank_account_id,
          reconciliation_type: formik.values.action.reconciliation_type,
        },
      },
    };
  };

  const getReconciliationRule = async () => {
    if (reconciliationRuleId) {
      const { data: dataReconciliationRule } = await showReconciliationRule({
        id: reconciliationRuleId,
      });
      setReconciliationRule(dataReconciliationRule);
    }
  };

  const fetchData = async () => {
    await Promise.all([getReconciliationRule()]);
    setInitialized(true);
  };

  useEffect(() => {
    fetchData();
  }, [reconciliationRuleId]);

  return (
    <>
      <PermissionGate permissions={permissionForm}>
        <Row>
          <Col sm="12">
            <Breadcrumbs
              breadCrumbTitle={
                reconciliationRuleId
                  ? `${reconciliationRuleId}`
                  : intl.formatMessage({
                      id: 'button.create.reconciliation_rule',
                    })
              }
              breadCrumbParents={[
                {
                  name: intl.formatMessage({
                    id: 'button.list.reconciliation_rule',
                  }),
                  link: '/admin/reconciliation-rule/list',
                },
              ]}
              breadCrumbActive={
                reconciliationRuleId
                  ? intl.formatMessage({
                      id: 'button.edit.reconciliation_rule',
                    })
                  : intl.formatMessage({
                      id: 'button.create.reconciliation_rule',
                    })
              }
            />
          </Col>
        </Row>
        {initialized && (
          <Row>
            <Col sm="12">
              <Card>
                <CardBody className="pt-2">
                  <Form onSubmit={formik.handleSubmit}>
                    <ReconciliationRuleForm
                      formik={formik}
                      reconciliationRule={reconciliationRule}
                    />
                    <Row>
                      <Col
                        className="mt-1 d-flex justify-content-end flex-wrap"
                        md={{ size: 6, offset: 3 }}
                        sm="12"
                      >
                        <PermissionGate permissions={permissionButton}>
                          <Button.Ripple className="mt-1" color="primary">
                            <FormattedMessage id="button.save" />
                          </Button.Ripple>
                        </PermissionGate>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </PermissionGate>
    </>
  );
};

export default ReconciliationRuleEdit;
