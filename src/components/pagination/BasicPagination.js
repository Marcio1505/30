import React from 'react';
import { Card, CardBody } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';

const BasicPagination = ({ currentPage, totalPages, onPageChange }) => (
  <Card>
    <CardBody>
      <ReactPaginate
        previousLabel="previous"
        nextLabel="next"
        breakLabel="..."
        breakClassName="break-me"
        forcePage={currentPage}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={onPageChange}
        containerClassName="vx-pagination basic-pagination pagination-center mt-3"
        activeClassName="active"
      />
    </CardBody>
  </Card>
);

BasicPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default BasicPagination;
