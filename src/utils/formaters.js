import { formatCpf, formatCnpj } from '@brazilian-utils/formatters';
import IMask from 'imask';
import moment from 'moment';

export { formatCnpj };
export { formatCpf };

export const getOnlyNumbers = (value = '') => String(value).replace(/\D/g, '');

export const formatMobilePhone = (value = '') => {
  const mobileMask = IMask.createMask({ mask: '(00) 00000-0000' });

  return mobileMask.resolve(getOnlyNumbers(value));
};

export const formatCommercialPhone = (value = '') => {
  const phoneMask = IMask.createMask({ mask: '(00) 0000-0000' });

  return phoneMask.resolve(getOnlyNumbers(value));
};

export const formatCpfCnpj = (value = '') => {
  const onlyNumbers = getOnlyNumbers(value);

  if (onlyNumbers.length <= 11) {
    return formatCpf(onlyNumbers);
  }

  return formatCnpj(onlyNumbers);
};

export const formatCep = (value = '') => {
  const cepMask = IMask.createMask({ mask: '00000-000' });
  const onlyNumbers = getOnlyNumbers(value);
  return cepMask.resolve(onlyNumbers);
};

export const getMonetaryValue = (value, onlyShow = false, precision = 2) => {
  let isNegative = false;
  if (value.includes('-') && value !== '-') {
    isNegative = true;
  }
  let _value = '';

  if (typeof value === 'number') {
    _value = String(value.toFixed(precision));
  } else if (onlyShow) {
    _value = value.replace(/[^\d.-]/g, '');
  } else {
    _value = value.replace(/\D/g, '');
  }

  if (value.length < precision) {
    _value = `0.${Array(precision - value.length)
      .fill()
      .map(() => '0')
      .join('')}${_value}`;
  } else {
    _value = `${_value.slice(0, -precision)}.${_value.slice(-precision)}`;
  }

  if (isNegative) {
    return parseFloat(-(_value || 1), 10);
  }
  return parseFloat(_value, 10);
};

export const formatMoney = (
  value,
  onlyShow = false,
  { currency, locale } = { currency: 'BRL', locale: 'pt-br' }
) => {
  if (value === undefined || value === null) {
    return '';
  }
  const _value = typeof value === 'number' ? value.toFixed(2) : value;

  const monetaryValue = onlyShow
    ? parseFloat(_value)
    : getMonetaryValue(_value.replace(/[^\d-]/g, ''));

  if (currency && locale) {
    return monetaryValue.toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return monetaryValue.toLocaleString('pt-br', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatAliquot = (value, onlyShow = false) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  const _value = typeof value === 'number' ? value.toFixed(4) : value;

  const monetaryValue = onlyShow
    ? parseFloat(_value)
    : getMonetaryValue(_value.replace(/\D/g, ''), false, 4);

  return monetaryValue.toLocaleString('pt-br', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

export const getAliquotValue = (value) => getMonetaryValue(value, false, 4);

export const formatDateToString = (dateOriginal) => {
  const date = dateOriginal.getDate();
  const month = dateOriginal.getMonth();
  const year = dateOriginal.getFullYear();

  return `${year}-${month + 1}-${date}`;
};

export const formatDateToHumanString = (dateOriginal) =>
  moment(dateOriginal).format('DD/MM/YYYY');

export const getDateFromFlatpickr = (formikValue) => {
  if (typeof formikValue === 'string') {
    return formikValue;
  }

  return formikValue?.[0] ? formatDateToString(formikValue[0]) : null;
};
