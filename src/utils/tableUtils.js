import moment from 'moment';

const getPageSizeLabel = (currentPage, pageSize, numberOfTotalRecords) =>
  `${currentPage * pageSize + 1} -${' '}
      ${
        numberOfTotalRecords > pageSize + currentPage * pageSize
          ? pageSize + currentPage * pageSize
          : numberOfTotalRecords
      }${' '}
      de ${numberOfTotalRecords}`;

const getStatementExcelFileName = (
  currentCompany,
  currentUser,
  statementType
) =>
  `${statementType}-${currentCompany?.company_name.replace(/ /g, '_')}_${
    currentCompany?.document
  }-${moment().format('DD_MM_YYYY_HH_mm_ss')}-${currentUser?.name.replace(
    / /g,
    '_'
  )}_${currentUser?.document}`;

export { getPageSizeLabel, getStatementExcelFileName };
