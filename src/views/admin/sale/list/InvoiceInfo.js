import React, { useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import * as Icon from 'react-feather';
import { PopoverHeader, PopoverBody, Popover } from 'reactstrap';

const InvoiceInfo = ({ invoice }) => {
  const [popoverInvoiceStatusOpen, setPopoverInvoiceStatusOpen] =
    useState(false);

  const togglePopoverInvoiceStatus = () =>
    setPopoverInvoiceStatusOpen(!popoverInvoiceStatusOpen);

  const popoverInvoiceStatusRef = useRef();

  return (
    <span>
      {Boolean(invoice?.status_text === 'PROCESSING') && (
        <span>
          <div
            className="badge badge-pill badge-light-warning mr-2"
            ref={popoverInvoiceStatusRef}
            onMouseEnter={() => setPopoverInvoiceStatusOpen(true)}
            onMouseLeave={() => setPopoverInvoiceStatusOpen(false)}
          >
            <Icon.Clock size={16} />
          </div>
          <Popover
            placement="top"
            isOpen={popoverInvoiceStatusOpen}
            target={popoverInvoiceStatusRef}
            toggle={togglePopoverInvoiceStatus}
          >
            {invoice.operation_text === 'Devolucao' ? (
              <>
                <PopoverHeader>Devolução Solicitada</PopoverHeader>
                <PopoverBody>
                  Foi solicitada uma NF de devolução referente a NF de venda
                  emitida.
                </PopoverBody>
              </>
            ) : (
              <>
                <PopoverHeader>NF em processamento</PopoverHeader>
                <PopoverBody>
                  Foi solicitada uma NF pra essa venda. Aguardando o retorno da
                  prefeitura/Sefaz.
                </PopoverBody>
              </>
            )}
          </Popover>
        </span>
      )}
      {Boolean(invoice?.status_text === 'PROCESSING_CANCELATION') && (
        <span>
          <div
            className="badge badge-pill badge-light-danger mr-2"
            ref={popoverInvoiceStatusRef}
            onMouseEnter={() => setPopoverInvoiceStatusOpen(true)}
            onMouseLeave={() => setPopoverInvoiceStatusOpen(false)}
          >
            <Icon.Clock size={16} />
          </div>
          <Popover
            placement="top"
            isOpen={popoverInvoiceStatusOpen}
            target={popoverInvoiceStatusRef}
            toggle={togglePopoverInvoiceStatus}
          >
            <PopoverHeader>NF em cancelamento</PopoverHeader>
            <PopoverBody>
              Foi solicitado o cancelamento da NF. Aguardando o retorno da
              prefeitura/Sefaz.
            </PopoverBody>
          </Popover>
        </span>
      )}
      {Boolean(invoice?.status_text === 'AUTHORIZED') && (
        <>
          <div
            className={`badge badge-pill mr-1 ${
              invoice.operation_text === 'Devolucao'
                ? 'badge-light-warning'
                : 'badge-light-success'
            }`}
            ref={popoverInvoiceStatusRef}
            onMouseEnter={() => setPopoverInvoiceStatusOpen(true)}
            onMouseLeave={() => setPopoverInvoiceStatusOpen(false)}
          >
            <Icon.Check size={16} />
          </div>
          <Popover
            placement="top"
            isOpen={popoverInvoiceStatusOpen}
            target={popoverInvoiceStatusRef}
            toggle={togglePopoverInvoiceStatus}
          >
            <PopoverHeader>NF autorizada</PopoverHeader>
            <PopoverBody>NF autorizada e emitida com sucesso</PopoverBody>
          </Popover>
          {invoice?.link_pdf && (
            <a
              href={invoice?.link_pdf}
              rel="noreferrer"
              className={
                invoice.operation_text === 'Devolucao'
                  ? 'text-warning'
                  : 'text-success'
              }
            >
              <Icon.Printer size={32} className="mr-1" />
            </a>
          )}
          {invoice?.link_xml && (
            <a
              href={invoice?.link_xml}
              rel="noreferrer"
              className={
                invoice.operation_text === 'Devolucao'
                  ? 'text-warning'
                  : 'text-success'
              }
            >
              <Icon.File size={32} className="mr-2" />
            </a>
          )}
        </>
      )}
      {Boolean(invoice?.status_text === 'AUTHORIZED_WAITING_PDF') && (
        <>
          <div
            className="badge badge-pill badge-light-warning mr-2"
            ref={popoverInvoiceStatusRef}
            onMouseEnter={() => setPopoverInvoiceStatusOpen(true)}
            onMouseLeave={() => setPopoverInvoiceStatusOpen(false)}
          >
            <Icon.Check size={16} />
          </div>
          <Popover
            placement="top"
            isOpen={popoverInvoiceStatusOpen}
            target={popoverInvoiceStatusRef}
            toggle={togglePopoverInvoiceStatus}
          >
            <PopoverHeader>NF Emitida - Aguardando PDF</PopoverHeader>
            <PopoverBody>
              A NF foi emitida. Aguardando geração do PDF
            </PopoverBody>
          </Popover>
        </>
      )}
      {Boolean(invoice?.status_text === 'DENIED') && (
        <>
          <div
            className="badge badge-pill badge-light-danger mr-2"
            ref={popoverInvoiceStatusRef}
            onMouseEnter={() => setPopoverInvoiceStatusOpen(true)}
            onMouseLeave={() => setPopoverInvoiceStatusOpen(false)}
          >
            <Icon.X size={16} />
          </div>
          <Popover
            placement="top"
            isOpen={popoverInvoiceStatusOpen}
            target={popoverInvoiceStatusRef}
            toggle={togglePopoverInvoiceStatus}
          >
            <PopoverHeader>Falha ao emitir NF</PopoverHeader>
            <PopoverBody>
              {invoice?.status_description || 'Falha inesperada ao emitir NF'}
            </PopoverBody>
          </Popover>
        </>
      )}
      {Boolean(invoice?.status_text === 'IN_CANCELATION_PROCCESS') && (
        <>
          <div
            className="badge badge-pill badge-light-warning mr-1"
            ref={popoverInvoiceStatusRef}
            onMouseEnter={() => setPopoverInvoiceStatusOpen(true)}
            onMouseLeave={() => setPopoverInvoiceStatusOpen(false)}
          >
            <Icon.Check size={16} />
          </div>
          <Popover
            placement="top"
            isOpen={popoverInvoiceStatusOpen}
            target={popoverInvoiceStatusRef}
            toggle={togglePopoverInvoiceStatus}
          >
            <PopoverHeader>Solicitado Cancelamento</PopoverHeader>
            <PopoverBody>
              Foi solicitado o cancelamento desta NF. Aguardando retorno da
              prefeitura/Sefaz
            </PopoverBody>
          </Popover>
          {invoice?.link_pdf && (
            <a href={invoice?.link_pdf} rel="noreferrer">
              <Icon.Printer size={32} className="mr-1 text-warning" />
            </a>
          )}
          {invoice?.link_xml && (
            <a href={invoice?.link_xml} rel="noreferrer">
              <Icon.File size={32} className="mr-2 text-warning" />
            </a>
          )}
        </>
      )}
      {Boolean(invoice?.status_text === 'CANCELED') && (
        <>
          <div
            className="badge badge-pill badge-light-danger mr-1"
            ref={popoverInvoiceStatusRef}
            onMouseEnter={() => setPopoverInvoiceStatusOpen(true)}
            onMouseLeave={() => setPopoverInvoiceStatusOpen(false)}
          >
            <Icon.Delete size={16} />
          </div>
          <Popover
            placement="top"
            isOpen={popoverInvoiceStatusOpen}
            target={popoverInvoiceStatusRef}
            toggle={togglePopoverInvoiceStatus}
          >
            <PopoverHeader>NF cancelada</PopoverHeader>
            <PopoverBody>Essa NF foi cancelada</PopoverBody>
          </Popover>
          {invoice?.link_pdf && (
            <a href={invoice?.link_pdf} rel="noreferrer">
              <Icon.Printer size={32} className="mr-1 text-danger" />
            </a>
          )}
          {invoice?.link_xml && (
            <a href={invoice?.link_xml} rel="noreferrer">
              <Icon.File size={32} className="mr-2 text-danger" />
            </a>
          )}
        </>
      )}
      {Boolean(invoice?.status_text === 'CANCELED_WAITING_PDF') && (
        <>
          <div
            className="badge badge-pill badge-light-warning mr-1"
            ref={popoverInvoiceStatusRef}
            onMouseEnter={() => setPopoverInvoiceStatusOpen(true)}
            onMouseLeave={() => setPopoverInvoiceStatusOpen(false)}
          >
            <Icon.Delete size={16} />
          </div>
          <Popover
            placement="top"
            isOpen={popoverInvoiceStatusOpen}
            target={popoverInvoiceStatusRef}
            toggle={togglePopoverInvoiceStatus}
          >
            <PopoverHeader>NF cancelada - Aguardando PDF</PopoverHeader>
            <PopoverBody>
              A NF foi cancelada. Aguardando atualização do PDF
            </PopoverBody>
          </Popover>
          {invoice?.link_pdf && (
            <a href={invoice?.link_pdf} rel="noreferrer">
              <Icon.Printer size={32} className="mr-1 text-danger" />
            </a>
          )}
          {invoice?.link_xml && (
            <a href={invoice?.link_xml} rel="noreferrer">
              <Icon.File size={32} className="mr-2 text-danger" />
            </a>
          )}
        </>
      )}
      {Boolean(invoice?.status_text === 'CANCELATION_DENIED') && (
        <>
          <div
            className="badge badge-pill badge-light-success mr-1"
            ref={popoverInvoiceStatusRef}
            onMouseEnter={() => setPopoverInvoiceStatusOpen(true)}
            onMouseLeave={() => setPopoverInvoiceStatusOpen(false)}
          >
            <Icon.Check size={16} />
          </div>
          {invoice?.link_pdf && (
            <a href={invoice?.link_pdf} rel="noreferrer">
              <Icon.Printer size={32} className="mr-1 text-success" />
            </a>
          )}
          {invoice?.link_xml && (
            <a href={invoice?.link_xml} rel="noreferrer">
              <Icon.File size={32} className="mr-2 text-success" />
            </a>
          )}
          <span>
            <div
              className="badge badge-pill badge-light-danger mr-2"
              ref={popoverInvoiceStatusRef}
              onMouseEnter={() => setPopoverInvoiceStatusOpen(true)}
              onMouseLeave={() => setPopoverInvoiceStatusOpen(false)}
            >
              <Icon.X size={16} />
            </div>
            <Popover
              placement="top"
              isOpen={popoverInvoiceStatusOpen}
              target={popoverInvoiceStatusRef}
              toggle={togglePopoverInvoiceStatus}
            >
              <PopoverHeader>Cancelamento Negado</PopoverHeader>
              <PopoverBody>
                Foi solicitado o cancelamento da NF. Mas não foi possível
                efetuá-lo. {invoice.status_description}
              </PopoverBody>
            </Popover>
          </span>
        </>
      )}
    </span>
  );
};

InvoiceInfo.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default InvoiceInfo;
