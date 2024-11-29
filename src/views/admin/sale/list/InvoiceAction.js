import React, { useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { Button, PopoverHeader, PopoverBody, Popover } from 'reactstrap';
import { AlertTriangle } from 'react-feather';
import * as Icon from 'react-feather';
import moment from 'moment';

import PermissionGate from '../../../../PermissionGate';

const InvoiceAction = ({
  sale,
  invoiceType,
  invoiceStatus,
  invoices,
  currentCompany,
  handleCreateInvoice,
  handleUpdateInvoice,
  handleCancelInvoice,
  handleCreateReturnInvoice,
}) => {
  const [popoverAlertOpen, setPopoverAlertOpen] = useState(false);
  const [popoverSaleNfeStatusOpen, setPopoverSaleNfeStatusOpen] =
    useState(false);

  const popoverAlertRef = useRef();
  const togglePopoverAlert = () => setPopoverAlertOpen(!popoverAlertOpen);

  const popoverSaleNfeStatusRef = useRef();
  const togglePopoverSaleNfeStatus = () =>
    setPopoverSaleNfeStatusOpen(!popoverSaleNfeStatusOpen);

  const showAllertInfo =
    (invoiceStatus.can_create_new_invoice ||
      invoiceStatus.can_update_invoice) &&
    (!sale?.client_address_completed ||
      !sale?.client_has_data_to_create_invoice);

  let createOrUpdateText = 'Emitir NF';
  if (invoiceType === 'service') {
    createOrUpdateText += 'S';
  }
  if (
    sale.client?.address?.[0]?.country_id &&
    sale.client?.address?.[0]?.country_id !== 1
  ) {
    if (sale.products?.[0].product_type === 1) {
      createOrUpdateText += ' EX';
    } else {
      createOrUpdateText += ' EX';
    }
    if (currentCompany.exterior_hotmart_invoice) {
      createOrUpdateText += ' (Hotmart)';
    }
  }

  return (
    <div className="d-flex">
      <div className="actions cursor-pointer">
        <>
          {[90, 99].includes(sale.nfe_status) && (
            <span>
              <div
                className={`badge badge-pill badge-light-${
                  sale.nfe_status === 99 ? 'info' : 'primary'
                } mr-2`}
                ref={popoverSaleNfeStatusRef}
                onMouseEnter={() => setPopoverSaleNfeStatusOpen(true)}
                onMouseLeave={() => setPopoverSaleNfeStatusOpen(false)}
              >
                <Icon.Clock size={16} />
              </div>
              <Popover
                placement="top"
                isOpen={popoverSaleNfeStatusOpen}
                target={popoverSaleNfeStatusRef}
                toggle={togglePopoverSaleNfeStatus}
              >
                <PopoverHeader>Na fila para emissão</PopoverHeader>
                <PopoverBody>
                  Foi solicitada uma NF para essa venda. E agora ela está na
                  fila para emissão. Em breve será solicitada a NF a
                  prefeitura/Sefaz
                </PopoverBody>
              </Popover>
            </span>
          )}
          {sale.nfe_status === 70 && (
            <span>
              <div
                className="badge badge-pill badge-light-info mr-2"
                ref={popoverSaleNfeStatusRef}
                onMouseEnter={() => setPopoverSaleNfeStatusOpen(true)}
                onMouseLeave={() => setPopoverSaleNfeStatusOpen(false)}
              >
                <Icon.Calendar size={16} />
              </div>
              <Popover
                placement="top"
                isOpen={popoverSaleNfeStatusOpen}
                target={popoverSaleNfeStatusRef}
                toggle={togglePopoverSaleNfeStatus}
              >
                <PopoverHeader>Emissão agendada</PopoverHeader>
                <PopoverBody>
                  A NF para essa venda foi agendada para ser emitida em{' '}
                  {moment(sale.invoice_scheduled_date).format('DD/MM/YYYY')}
                </PopoverBody>
              </Popover>
            </span>
          )}
          {sale.nfe_status === 80 && (
            <span>
              <div
                className="badge badge-pill badge-light-danger mr-2"
                ref={popoverSaleNfeStatusRef}
                onMouseEnter={() => setPopoverSaleNfeStatusOpen(true)}
                onMouseLeave={() => setPopoverSaleNfeStatusOpen(false)}
              >
                <Icon.Calendar size={16} />
              </div>
              <Popover
                placement="top"
                isOpen={popoverSaleNfeStatusOpen}
                target={popoverSaleNfeStatusRef}
                toggle={togglePopoverSaleNfeStatus}
              >
                <PopoverHeader>Cancelamento/Devolução agendado</PopoverHeader>
                <PopoverBody>
                  O cancelamento ou devolução da NF para essa venda foi agendado
                  para{' '}
                  {moment(sale.invoice_scheduled_date).format('DD/MM/YYYY')}
                </PopoverBody>
              </Popover>
            </span>
          )}
          {invoiceStatus.can_update_invoice && (
            <PermissionGate permissions="sales.invoices.store">
              <Button
                color="warning"
                onClick={() =>
                  handleUpdateInvoice(sale, invoices[0], invoiceType)
                }
                disabled={!sale?.client_has_data_to_create_invoice}
              >
                {createOrUpdateText}
              </Button>
            </PermissionGate>
          )}
          {invoiceStatus.can_create_new_invoice && (
            <PermissionGate permissions="sales.invoices.store">
              <Button
                color="primary"
                onClick={() => handleCreateInvoice(sale, invoiceType)}
                disabled={!sale?.client_has_data_to_create_invoice}
              >
                {createOrUpdateText}
              </Button>
            </PermissionGate>
          )}
          {showAllertInfo && (
            <>
              <span
                className={`${
                  !sale?.client_has_data_to_create_invoice
                    ? 'text-danger'
                    : 'text-warning'
                } mx-2`}
                ref={popoverAlertRef}
                onMouseEnter={() => setPopoverAlertOpen(true)}
                onMouseLeave={() => setPopoverAlertOpen(false)}
              >
                <AlertTriangle size={25} />
              </span>
              <Popover
                placement="top"
                isOpen={popoverAlertOpen}
                target={popoverAlertRef}
                toggle={togglePopoverAlert}
              >
                <PopoverHeader>
                  {!sale?.client_has_data_to_create_invoice
                    ? 'Cliente com dados incompletos'
                    : 'Cliente com endereço incompleto'}
                </PopoverHeader>
                <PopoverBody>
                  {!sale?.client_has_data_to_create_invoice
                    ? 'Não é possível emitir NF para este cliente. Preencha as informações de CPF/CNPJ.'
                    : 'Será emitida NF usando o endereço da empresa como o endereço do cliente.'}
                </PopoverBody>
              </Popover>
            </>
          )}
          {invoiceStatus.can_be_canceled && (
            <PermissionGate permissions="sales.invoices.store">
              <Button
                color="danger"
                onClick={() =>
                  handleCancelInvoice(sale, invoices[invoices.length - 1])
                }
                className="mr-2"
              >
                {invoiceType === 'product' ? `Cancelar NF` : `Cancelar NFS`}
              </Button>
            </PermissionGate>
          )}
          {invoiceStatus.can_be_returned && (
            <PermissionGate permissions="sales.invoices.store">
              <Button
                color="danger"
                onClick={() =>
                  handleCreateReturnInvoice(sale, invoices[invoices.length - 1])
                }
                className="mr-2"
              >
                Emitir NF Devolução
              </Button>
            </PermissionGate>
          )}
        </>
      </div>
    </div>
  );
};

InvoiceAction.propTypes = {
  sale: PropTypes.object.isRequired,
  invoiceType: PropTypes.oneOf(['product', 'service']).isRequired,
  invoiceStatus: PropTypes.object.isRequired,
  invoices: PropTypes.array.isRequired,
  currentCompany: PropTypes.object.isRequired,
  handleCreateInvoice: PropTypes.func.isRequired,
  handleUpdateInvoice: PropTypes.func.isRequired,
  handleCancelInvoice: PropTypes.func.isRequired,
  handleCreateReturnInvoice: PropTypes.func.isRequired,
};

export default InvoiceAction;
