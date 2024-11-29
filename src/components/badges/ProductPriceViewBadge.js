import React from 'react';
import PropTypes from 'prop-types';

const ProductPriceView = ({ priceView }) => (
  <>
    {(priceView === 0 || !priceView) && (
      <div className="badge badge-pill badge-light-success">
        Valor do produto
      </div>
    )}
    {priceView === 1 && (
      <div className="badge badge-pill badge-light-info">
        Valor pago pelo cliente
      </div>
    )}
  </>
);

ProductPriceView.propTypes = {
  priceView: PropTypes.number,
};

ProductPriceView.defaultProps = {
  priceView: 0,
};

export default ProductPriceView;
