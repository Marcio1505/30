import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardTitle, Button } from 'reactstrap';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import * as XLSX from 'xlsx';
import moment from 'moment';

import ExternalTextLink from '../../../../components/links/ExternalTextLink';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';
import { importSales } from '../../../../services/apis/sale.api';
import ExcelImage from '../../../../assets/img/files/excel.png';

const BasicDropzone = () => {
  const [files, setFiles] = useState([]);
  const [sales, setSales] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const history = useHistory();

  const formatDateFromExcel = (excelDate) =>
    moment.unix(Math.round((excelDate - 25568) * 86400)).format('YYYY-MM-DD');

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wsname = wb.SheetNames[2];

        const header = [
          'transaction_external_id',
          'transaction_key',
          'product_name',
          'product_code',
          'product_price',
          'quantity',
          'total_value',
          'plataform_value',
          'advance_value',
          'streaming_value',
          'commission_value',
          'commission_value_coproduct', // comissão do co-produtor criar campo na tabela sales
          'affiliate_name',
          'affiliate_document',
          'coproduct_name',
          'coproduct_document',
          // 'affiliate_category_id',
          // 'coproduct_category_id',
          'payment_method_id',
          'payment_plataform_id',
          'competency_date',
          'payment_date',
          'status',
          'devolution_date',
          'nfe_status',
          'bank_account_id',
          'project_id',
          'cost_center_id',
          'category_id',
          'client_name',
          'client_document',
          'client_document_foreigner',
          'client_email',
          'client_ddd',
          'client_phone',
          'client_address_postal_code',
          'client_address_city',
          'client_address_state',
          'client_address_neighborhood',
          'client_address_country',
          'client_address_street',
          'client_address_number',
          'client_address_complement',
        ];
        const ws = wb.Sheets[wsname];
        resolve(
          XLSX.utils.sheet_to_json(ws, {
            raw: false,
            header,
            range: 3,
          })
        );
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((allSales) => {
      allSales.shift();

      // console.log('allSales',{ allSales });
      // return;
      const allSalesFormated = allSales.map((sale) => ({
        // ...sale,
        client: {
          document: sale.client_document?.toString().replace(/\D/g, ''),
          document_foreigner: sale.client_document_foreigner,
          email: sale.client_email?.toString(),
          name: sale.client_name?.toString(),
          ddd: sale.client_ddd?.toString().replace(/\D/g, ''),
          phone: sale.client_phone?.toString().replace(/\D/g, ''),
          address: {
            postal_code: sale.client_address_postal_code
              ?.toString()
              .replace(/\D/g, ''),
            street: sale.client_address_street?.toString(),
            number: sale.client_address_number?.toString(),
            complement: sale.client_address_complement?.toString(),
            state: sale.client_address_state?.toString(),
            city: sale.client_address_city?.toString(),
            country: sale.client_address_country?.toString(),
            neighborhood: sale.client_address_neighborhood?.toString(),
          },
        },
        advance_value:
          Number(parseFloat(sale.advance_value || 0).toFixed(2)) === 0
            ? null
            : parseFloat(sale.advance_value || 0).toFixed(2),

        commission_value:
          Number(parseFloat(sale.commission_value || 0).toFixed(2)) === 0
            ? null
            : parseFloat(sale.commission_value || 0).toFixed(2),

        competency_date: sale.competency_date
          ? moment(sale.competency_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : null,

        net_value: parseFloat(
          parseFloat(
            sale.quantity *
              parseFloat(
                sale.product_price?.toString().replace(/[^0-9.-]+/g, '') || 0
              ).toFixed(2) || 0
          ).toFixed(2) -
            parseFloat(
              sale.plataform_value?.toString().replace(/[^0-9.-]+/g, '') || 0
            ).toFixed(2) -
            parseFloat(
              sale.advance_value?.toString().replace(/[^0-9.-]+/g, '') || 0
            ).toFixed(2) -
            parseFloat(
              sale.streaming_value?.toString().replace(/[^0-9.-]+/g, '') || 0
            ).toFixed(2) -
            parseFloat(
              sale.commission_value?.toString().replace(/[^0-9.-]+/g, '') || 0
            ).toFixed(2) ||
            // - parseFloat(sale.commission_value_coproduct?.toString().replace(/[^0-9.-]+/g, '') || 0).toFixed(2)
            0
        ).toFixed(2),

        commission_value_coproduct:
          Number(
            parseFloat(sale.commission_value_coproduct || 0).toFixed(2)
          ) === 0
            ? null
            : parseFloat(sale.commission_value_coproduct || 0).toFixed(2),

        affiliate: {
          document: sale.affiliate_document?.toString().replace(/\D/g, ''),
          company_name: sale.affiliate_name?.toString() || '',
          commission_value:
            Number(parseFloat(sale.commission_value || 0).toFixed(2)) === 0
              ? null
              : parseFloat(sale.commission_value || 0).toFixed(2),
        },

        coproduct: {
          document: sale.coproduct_document?.toString().replace(/\D/g, ''),
          company_name: sale.coproduct_name?.toString(),
          commission_value:
            Number(
              parseFloat(sale.commission_value_coproduct || 0).toFixed(2)
            ) === 0
              ? null
              : parseFloat(sale.commission_value_coproduct || 0).toFixed(2),
        },

        payment_date: sale.payment_date
          ? moment(sale.payment_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : null,

        payment_method_id: parseInt(sale.payment_method_id, 10),
        payment_plataform_id: parseInt(sale.payment_plataform_id, 10),
        plataform_value:
          Number(parseFloat(sale.plataform_value || 0).toFixed(2)) === 0
            ? null
            : parseFloat(sale.plataform_value || 0).toFixed(2),

        product_code: sale.product_code?.toString(),
        product_name: sale.product_name?.toString(),
        product_price: parseFloat(
          sale.product_price?.toString().replace(/[^0-9.-]+/g, '') || 0
        ).toFixed(2),
        quantity: parseInt(sale.quantity, 10),
        status: parseInt(sale.status, 10),

        devolution_date: sale.devolution_date
          ? moment(sale.devolution_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          : null,

        nfe_status: parseInt(sale.nfe_status, 10),
        streaming_value:
          Number(parseFloat(sale.streaming_value || 0).toFixed(2)) === 0
            ? null
            : parseFloat(sale.streaming_value || 0).toFixed(2),

        total_value: parseFloat(
          sale.quantity *
            parseFloat(
              sale.product_price?.toString().replace(/[^0-9.-]+/g, '') || 0
            ).toFixed(2) || 0
        ).toFixed(2),
        final_value: null,
        transaction_external_id: sale.transaction_external_id?.toString(),
        transaction_key: sale.transaction_key?.toString(),
        bank_account_id: parseInt(sale.bank_account_id, 10),
        project_id: parseInt(sale.project_id, 10),
        cost_center_id: parseInt(sale.cost_center_id, 10),

        category_id: parseInt(sale.category_id, 10),
      }));
      // console.log('allSalesFormated',allSalesFormated);
      setSales(allSalesFormated);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept:
      'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onDrop: (acceptedFiles) => {
      const uploadedFiles = acceptedFiles.map((file) => {
        readExcel(file);
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      setButtonDisabled(false);
      setFiles(uploadedFiles);
    },
  });

  const handleImportSales = async () => {
    setButtonDisabled(true);
    try {
      await importSales({ sales });
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Vendas criadas/atualizadas com sucesso',
          hasTimeout: true,
        })
      );
      history.push(`/admin/sale/list`);
    } catch (error) {
      setButtonDisabled(false);
    }
  };

  const thumbs = files.map((file) => (
    <>
      <div className="dz-thumb" key={file.name}>
        <div className="dz-thumb-inner">
          <img src={ExcelImage} className="dz-img" alt={file.name} />
        </div>
      </div>
      <small>{file.name}</small>
    </>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <>
      <h5 className="mb-2">Instruções</h5>
      <p> Abra a planilha modelo pelo link e faça uma cópia ou download.</p>
      <p>
        {' '}
        Leia atentamente todas instruções contidas na primeira aba antes de
        iniciar o preenchimento dos dados.{' '}
      </p>
      <p> Preencha os dados conforme instruções e faça o upload </p>
      <ExternalTextLink
        url="https://docs.google.com/spreadsheets/d/1Igtd2KJO9MS1DexWKZIGzSYZgecZBhw7/"
        text="Link para Planilha Modelo de Vendas"
        type="warning"
      />
      <section className="mt-2">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p className="mx-1">
            Arraste e solte o arquivo aqui ou clique para selecioná-lo
            {/* Drag 'n' drop some files here, or click to select files */}
          </p>
        </div>
        <aside className="thumb-container">{thumbs}</aside>
      </section>
      <Button.Ripple
        onClick={() => handleImportSales()}
        className="my-1"
        color="primary"
        disabled={buttonDisabled}
      >
        <FormattedMessage id="button.import.sale" />
      </Button.Ripple>
    </>
  );
};

const DropzoneBasic = () => (
  <Card>
    <CardHeader>
      <CardTitle />
    </CardHeader>
    <CardBody>
      <BasicDropzone />
    </CardBody>
  </Card>
);

export default DropzoneBasic;
