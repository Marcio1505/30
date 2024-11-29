import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SelectLabelFindConciliation = ({ item }) => {
  let item_type = null;
  switch (item.type) {
    case 1:
      item_type = 'Cliente';
      break;
    case 2:
      item_type = 'Fornecedor';
      break;
    case 3:
      item_type = 'Banco Origem';
      break;
    case 4:
      item_type = 'Banco Destino';
      break;
    default:
      item_type = null;
  }
  return (
    <>
      <hr className="mt-0 pt-0" />
      <div>
        Data de Vencimento:
        <h6>{item.date}</h6>
      </div>
      <div>
        Valor:
        <h6>{item.label}</h6>
      </div>
      <div>
        Descrição:
        <h6>{item.description}</h6>
      </div>
      <div>
        {item_type}
        <h6>{item.name}</h6>
      </div>
      <div>
        {item.link ? (
          <small>
            <Link
              style={{ color: '#0000ff' }}
              to={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Id: {item.id}
            </Link>
          </small>
        ) : (
          <small>Id: {item.id}</small>
        )}
      </div>
    </>
  );
};

SelectLabelFindConciliation.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.number,
    date: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }).isRequired,
};

export default SelectLabelFindConciliation;
