import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

const fetchProductsListexpiration = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { id: 1, name: 'Produto A', dataExpiration: '2023-11-01' },
          { id: 2, name: 'Produto B', dataExpiration: '2023-11-15' },
        ],
      });
    }, 1000);
  });
};

function ProdutsExpiration({ currentCompanyId }) {
  const [produtsExpiration, setProdutsExpiration] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadProducts = async () => {
    const { data: rowData } = await fetchProductsListexpiration();

    setProdutsExpiration(rowData);
    if (rowData.length > 0) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentCompanyId]);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>Alerta de Vencimento de Produto</ModalHeader>
      <ModalBody className="d-flex flex-column align-items-center">
        <div>
          <p>
            O(s) Produto(s) Abaixo tem Vencimento Programado para os Próximos 30
            dias:
          </p>
          {produtsExpiration.map((item) => (
            <p
              key={item?.id}
            >{`${item?.name} ${item?.id} - Vencimento em ${item?.dataExpiration}`}</p>
          ))}{' '}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          ver mais
        </Button>
      </ModalFooter>
    </Modal>
  );
}

ProdutsExpiration.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

export default ProdutsExpiration;
