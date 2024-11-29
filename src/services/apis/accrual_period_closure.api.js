import API from '../API.redux';

const accrualPeriodClosureEndpoints = {
  create: {
    url: 'bank-accounts/:bank_account_id/accrual-period-closures',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'bank-accounts/:bank_account_id/accrual-period-closures',
    method: 'DELETE',
  },
};

export const createAccrualPeriodClosure = async ({
  bankAccountId,
  data,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: accrualPeriodClosureEndpoints.create.url.replace(
      ':bank_account_id',
      bankAccountId
    ),
    method: accrualPeriodClosureEndpoints.create.method,
    data,
  });

export const destroyAccrualPeriodClosure = ({
  bankAccountId,
  data,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: accrualPeriodClosureEndpoints.destroy.url.replace(
      ':bank_account_id',
      bankAccountId
    ),
    method: accrualPeriodClosureEndpoints.destroy.method,
    data,
  });
