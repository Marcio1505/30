import moment from 'moment';

const getPayablesInitialState = () => ({
  filter: {
    filter_due_or_payment_date: [
      moment().format('YYYY-MM-DD'),
      moment().subtract(7, 'days').format('YYYY-MM-DD'),
    ],
    filter_competency_date: '',
    filter_computed_status: 'all',
    filter_category_id: 'all',
    filter_categories_ids: [],
    filter_bank_accounts_ids: null,
    filter_cost_centers: [],
    filter_projects: [],
    filter_transactions_ids: [],
    filter_externals_ids: [],
    filter_sources: [],
  },
  sortModel: [
    {
      colId: 'competency_date',
      sort: 'desc',
    },
  ],
  pageSize: 200,
});

export default getPayablesInitialState;
