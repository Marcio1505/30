import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { useFormik } from 'formik';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import moment from 'moment';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';
import '../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss';
import '../../../../assets/scss/pages/users.scss';

import {
  getSaleStatusOptions,
  getSaleSourceOptions,
} from '../../../../utils/sales';

import { setFilters } from '../../../../new.redux/sales/sales.actions';

const ModalFilterSale = ({
  showModalFilterSale,
  setShowModalFilterSale,
  filter,
  onFilterSubmit,
  bankAccounts,
  products,
  categories,
  setFilters,
}) => {
  const saleStatusOptions = getSaleStatusOptions();
  const saleSourceOptions = getSaleSourceOptions();
  const bankAccountOptions = bankAccounts;
  const productOptions = products;
  const categoryOptions = categories;

  const {
    filterSaleCompetencyDate,
    filterSaleStatuses,
    filterSaleProducts,
    filterSaleBankAccounts,
    filterSaleCategories,
    filterSaleSources,
    filterInvoiceDate,
    filterInvoiceStatus,
    filterSalesIds,
    filterExternalsIds,
  } = filter;

  const animatedComponents = makeAnimated();

  const setNewStates = () => {
    setFilters({
      filters: {
        filterSaleCompetencyDate: formik.values.competencyDate,
        filterSaleStatuses: formik.values.statuses,
        filterSaleProducts: formik.values.products,
        filterSaleBankAccounts: formik.values.bankAccounts,
        filterSaleCategories: formik.values.categories,
        filterSaleSources: formik.values.sources,
        filterInvoiceDate: formik.values.invoiceDate,
        filterInvoiceStatus: formik.values.invoiceStatus,
        filterSalesIds: formik.values.salesIds,
        filterExternalsIds: formik.values.externalsIds,
        currentPage: 0,
      },
    });
  };

  const onSubmit = async () => {
    await setNewStates();
  };

  const initialValues = {
    competencyDate: filterSaleCompetencyDate || [],
    statuses: filterSaleStatuses || '',
    sources: filterSaleSources || [],
    products: filterSaleProducts || [],
    bankAccounts: filterSaleBankAccounts || [],
    categories: filterSaleCategories || [],
    invoiceDate: filterInvoiceDate || [],
    invoiceStatus: filterInvoiceStatus || '',
    salesIds: filterSalesIds || '',
    externalsIds: filterExternalsIds || '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    formik.setValues({
      ...initialValues,
    });
  }, [showModalFilterSale]);

  useEffect(() => {
    if (showModalFilterSale) {
      onFilterSubmit();
    }
  }, [filter]);

  const nfeStatusOptions = [
    { value: '', label: 'Todos' },
    { value: 'NOT_REQUESTED', label: 'Não solicitado' },
    { value: 'PROCESSING', label: 'Processando' },
    { value: 'WAITING_PDF', label: 'Autorizada - Aguardando PDF' },
    { value: 'AUTHORIZED', label: 'Autorizada' },
    { value: 'DENIED', label: 'Negada' },
    { value: 'CANCELED', label: 'Cancelada' },
    { value: 'CANCELATION_DENIED', label: 'Cancelamento Negado' },
    { value: 'RETURNED', label: 'Devolvida' },
  ];

  return (
    <Modal
      size="lg"
      isOpen={showModalFilterSale}
      toggle={() => setShowModalFilterSale(!showModalFilterSale)}
      className="modal-dialog-centered"
    >
      <form onSubmit={formik.handleSubmit}>
        <ModalHeader
          toggle={() => setShowModalFilterSale(!showModalFilterSale)}
        >
          Filtro de vendas
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <FormGroup className="mb-0">
                <Label for="filterSaleCompetencyDate">Data Venda</Label>
                <InputGroup>
                  <Flatpickr
                    id="filterSaleCompetencyDate"
                    className="form-control"
                    options={{
                      mode: 'range',
                      dateFormat: 'Y-m-d',
                      altFormat: 'd/m/Y',
                      altInput: true,
                    }}
                    value={formik.values.competencyDate}
                    onChange={(date) => {
                      if (date.length === 2) {
                        formik.setFieldValue('competencyDate', [
                          moment(date[0]).format('YYYY-MM-DD'),
                          moment(date[1]).format('YYYY-MM-DD'),
                        ]);
                      }
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        formik.setFieldValue('competencyDate', []);
                      }}
                    >
                      X
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Status Venda</Label>
              <Select
                isMulti
                options={saleStatusOptions}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="statuses"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.statuses}
                closeMenuOnSelect={false}
                onChange={(selectetSaleStatuses) => {
                  formik.setFieldValue('statuses', selectetSaleStatuses || []);
                }}
              />
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Fonte Venda</Label>
              <Select
                isMulti
                options={saleSourceOptions}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="sources"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.sources}
                closeMenuOnSelect={false}
                onChange={(selectetSaleSources) => {
                  formik.setFieldValue('sources', selectetSaleSources || []);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Conta Bancária</Label>
              <Select
                isMulti
                options={bankAccountOptions}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="bankAccounts"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.bankAccounts}
                closeMenuOnSelect={false}
                onChange={(selectetBankAccounts) => {
                  formik.setFieldValue(
                    'bankAccounts',
                    selectetBankAccounts || []
                  );
                }}
              />
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Produto</Label>
              <Select
                isMulti
                options={productOptions}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="products"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.products}
                closeMenuOnSelect={false}
                onChange={(selectetProducts) => {
                  formik.setFieldValue('products', selectetProducts || []);
                }}
              />
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Categoria</Label>
              <Select
                isMulti
                options={categoryOptions}
                className="React"
                classNamePrefix="select"
                components={animatedComponents}
                id="categories"
                onBlur={formik.handleBlur}
                defaultValue={formik.initialValues.categories}
                closeMenuOnSelect={false}
                onChange={(selectetCategories) => {
                  formik.setFieldValue('categories', selectetCategories || []);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <FormGroup className="mb-0">
                <Label for="filterInvoiceDate">Data Solicitação NF</Label>
                <InputGroup>
                  <Flatpickr
                    id="filterInvoiceDate"
                    className="form-control"
                    options={{
                      mode: 'range',
                      dateFormat: 'Y-m-d',
                      altFormat: 'd/m/Y',
                      altInput: true,
                    }}
                    value={formik.values.invoiceDate}
                    onChange={(date) => {
                      if (date.length === 2) {
                        formik.setFieldValue('invoiceDate', [
                          moment(date[0]).format('YYYY-MM-DD'),
                          moment(date[1]).format('YYYY-MM-DD'),
                        ]);
                      }
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={() => {
                        formik.setFieldValue('invoiceDate', []);
                      }}
                    >
                      X
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <Label>Status NF</Label>
              <Select
                components={animatedComponents}
                options={nfeStatusOptions}
                value={nfeStatusOptions.filter(
                  (option) => option.value === formik.values.invoiceStatus
                )}
                onChange={(selected) => {
                  formik.setFieldValue('invoiceStatus', selected.value);
                }}
                className="React"
                classNamePrefix="select"
              />
            </Col>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <FormGroup className="mb-0">
                <Label for="branch">IDs (separados por vírgulas)</Label>
                <Input
                  type="text"
                  id="salesIds"
                  onBlur={formik.handleBlur}
                  value={formik.values.salesIds}
                  onChange={formik.handleChange}
                  placeholder="1,2,3,4"
                />
                {formik.errors.salesIds && formik.touched.salesIds ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.salesIds}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg="4" md="6" sm="12" className="mt-2">
              <FormGroup className="mb-0">
                <Label for="branch">
                  IDs Externos (separados por vírgulas)
                </Label>
                <Input
                  type="text"
                  id="externalsIds"
                  onBlur={formik.handleBlur}
                  value={formik.values.externalsIds}
                  onChange={formik.handleChange}
                  placeholder="ex: HP0012345678, pay_47a6b5iwkdhlny4p_fee"
                />
                {formik.errors.externalsIds && formik.touched.externalsIds ? (
                  <div className="invalid-tooltip mt-25">
                    {formik.errors.externalsIds}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setShowModalFilterSale(!showModalFilterSale)}
          >
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Filtrar
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

ModalFilterSale.propTypes = {
  onFilterSubmit: PropTypes.func.isRequired,
  showModalFilterSale: PropTypes.bool.isRequired,
  setShowModalFilterSale: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  bankAccounts: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  setFilters: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  filter: state.sales.filter,
});

const mapDispatchToProps = {
  setFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalFilterSale);
