import moment from 'moment';

const getInvoiceDownloadsInitialState = () => ({
  filter: {
    filter_invoice_date: [],
    filter_competency_date: [
      moment().format('YYYY-MM-01'),
      moment().format('YYYY-MM-') + moment().daysInMonth(),
    ],
    filter_invoice_status: '',
    filter_invoice_type: '',
    filter_invoice_operation: '',
  },
  sortModel: [
    {
      colId: 'competency_date',
      sort: 'desc',
    },
  ],
  pageSize: 200,
});

export default getInvoiceDownloadsInitialState;
