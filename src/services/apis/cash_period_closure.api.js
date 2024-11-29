import API from '../API.redux';

const cashPeriodClosureEndpoints = {
  create: {
    url: 'bank-accounts/:bank_account_id/cash-period-closures',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },

  destroy: {
    url: 'cash-period-closures/:cash_period_closure_id',
    method: 'DELETE',
  },
};

export const createCashPeriodClosure = async ({
  bankAccountId,
  date,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: cashPeriodClosureEndpoints.create.url.replace(
      ':bank_account_id',
      bankAccountId
    ),
    method: cashPeriodClosureEndpoints.create.method,
    data: {
      date,
    },
  });

export const destroyCashPeriodClosure = ({
  cashPeriodId,
  apiOptions = {},
} = {}) =>
  API(apiOptions)({
    url: cashPeriodClosureEndpoints.destroy.url.replace(
      ':cash_period_closure_id',
      cashPeriodId
    ),
    method: cashPeriodClosureEndpoints.destroy.method,
  });
