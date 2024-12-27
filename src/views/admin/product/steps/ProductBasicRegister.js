import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardImg } from 'reactstrap';
import {
  TextFieldController,
  SwitchController,
  SelectController,
  SelectSearchController,
} from '../../../../components/inputs/controlled';
import { fetchSelectSuppliers } from '../../../../services/apis/supplier.api';

const productTypes = [
  {
    value: '',
    label: 'Selecione o tipo',
  },
  {
    value: 1,
    label: 'Unidade',
  },
  {
    value: 2,
    label: 'Kg',
  },
];

export const ProductBasicRegister = () => {
  const [dataSuppliersSelect, setDataSuppliersSelect] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataSuppliers } = await fetchSelectSuppliers();

      setDataSuppliersSelect(dataSuppliers);
    };
    fetchData();
  }, []);

  return (
    <Row
      style={{
        display: 'flex',
        alignItems: 'start',
        marginTop: '18px',
        marginBottom: '15px',
      }}
    >
      <Col sm="3">
        <SwitchController name="status" label="Ativar/Desativar" />

        <TextFieldController
          id="name"
          name="name"
          label="Nome *"
          placeholder="Nome do produto"
        />

        <SelectSearchController
          id="supplier"
          isMulti
          isClearable
          isSearchable
          label="Fornecedores *"
          options={[...dataSuppliersSelect]}
        />

        <SelectController
          id="opcoesVenda"
          name="opcoesVenda"
          label="Opções de Venda *"
          options={[
            { value: '', label: 'Selecione a opção de venda' },
            { value: 1, label: 'markup' },
            { value: 2, label: 'preço de venda' },
          ]}
        />

        <TextFieldController
          id="group"
          name="group"
          label="Grupo"
          placeholder=""
        />
      </Col>

      <Col sm="3">
        <SwitchController
          name="contabilizarEstoque"
          label="Contabilizar Estoque"
        />

        <TextFieldController
          id="code"
          name="code"
          label="Código do Produto"
          placeholder="Código do produto"
        />

        <TextFieldController
          id="vencimentoProduto"
          name="vencimentoProduto"
          type="date"
          label="Vencimento do Produto"
        />

        <TextFieldController
          id="description"
          name="description"
          label="Descrição"
          placeholder="Descrição do produto"
        />

        <SwitchController name="vendaSites" label="Venda em Sites" />
      </Col>
      <Col sm="3">
        <SwitchController
          name="indisponivelVenda"
          label="Indisponível para Venda"
        />
        <TextFieldController
          id="referencia"
          name="referencia"
          label="Referência"
        />

        <TextFieldController
          id="price"
          name="price"
          type="number"
          label="Preço de Venda"
        />

        <SelectController
          id="product_type"
          name="product_type"
          label="Tipo *"
          options={productTypes}
        />
      </Col>
      <Col sm="3">
        <Card
          className="my-2"
          outline
          style={{
            width: '14',
            height: 'auto',
            borderRadius: '10px',
            border: '1px solid #c8c8c8',
          }}
        >
          <CardImg
            alt="Card image cap"
            src="https://picsum.photos/900/1200?grayscale"
            width="85%"
          />
        </Card>
      </Col>
    </Row>
  );
};
