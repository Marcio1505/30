import moment from 'moment';

const getPurchasesInitialState = () => ({
  filter: {
    filter_due_or_payment_date: [
      moment().format('YYYY-MM-01'),
      moment().format('YYYY-MM-') + moment().daysInMonth(),
    ],
    filter_competency_date: [
      moment().format('YYYY-MM-01'),
      moment().format('YYYY-MM-') + moment().daysInMonth(),
    ],
    filter_status: 'all',
    filter_created_by_id: 'all',
  },
  sortModel: [
    {
      colId: 'competency_date',
      sort: 'desc',
    },
  ],
  pageSize: 200,
});

export default getPurchasesInitialState;
