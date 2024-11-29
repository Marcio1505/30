import moment from 'moment';

const getSalesInitialState = () => ({
  filter: {
    isFilterActive: true,
    filterSaleCompetencyDate: [
      moment().format('YYYY-MM-01'),
      moment().format('YYYY-MM-') + moment().daysInMonth(),
    ],
    filterSaleStatuses: [],
    filterSaleSources: [],
    filterSaleProducts: [],
    filterSaleBankAccounts: [],
    filterSaleCategories: [],
    filterInvoiceDate: [],
    filterInvoiceStatus: 'all',
    filterSalesIds: [],
    filterExternalsIds: [],
  },
  sortModel: [
    {
      colId: 'competency_date',
      sort: 'desc',
    },
  ],
  pageSize: 50,
  currentPage: 0,
});

export default getSalesInitialState;
