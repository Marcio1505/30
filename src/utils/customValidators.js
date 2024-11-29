import React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import {
  isValidCep,
  isValidPhone,
  isValidCnpj,
  isValidCpf,
} from '@brazilian-utils/validators';

import ReduxAPI from '../services/API.redux';

export const validatePostalCode = (value = '') =>
  ReduxAPI({
    headers: {},
  }).get(`https://viacep.com.br/ws/${value}/json`);

export const postal_code = Yup.string().test(
  'postal_code',
  <FormattedMessage id="errors.invalid" />,
  (postal_code) => (postal_code ? isValidCep(postal_code) : true)
);

export const phone = Yup.string().test(
  'phone',
  <FormattedMessage id="errors.invalid" />,
  (phone) => (phone ? isValidPhone(phone) : true)
);

export const cpf = Yup.string().test(
  'cpf',
  <FormattedMessage id="errors.invalid" />,
  (cpf) => (cpf ? isValidCpf(cpf) : true)
);

export const cnpj = Yup.string().test(
  'cnpj',
  <FormattedMessage id="errors.invalid" />,
  (cnpj) => (cnpj ? isValidCnpj(cnpj) : true)
);

export const document = Yup.string().test(
  'document',
  <FormattedMessage id="errors.invalid" />,
  (document) =>
    document ? isValidCpf(document) || isValidCnpj(document) : true
);

export const email = Yup.string().email(
  <FormattedMessage id="errors.invalid" />
);

export default {
  postal_code,
  phone,
  cpf,
  cnpj,
  document,
  email,
};
