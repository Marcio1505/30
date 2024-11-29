import React from 'react';

const ProductType = ({ product_type }) => (
  <>
    {product_type === 1 && (
      <div className="badge badge-pill badge-light-success">Produto</div>
    )}
    {product_type === 2 && (
      <div className="badge badge-pill badge-light-info">Serviço</div>
    )}
    {product_type === 3 && (
      <div className="badge badge-pill badge-light-warning">Split</div>
    )}
  </>
);

export default ProductType;
