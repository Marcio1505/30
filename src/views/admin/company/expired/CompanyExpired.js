import React from 'react';
import { Link } from 'react-router-dom';
import AlertIcon from '../../../../components/alerts/AlertIcon';

const CompanyExpired = () => (
  <AlertIcon type="danger">
    O acesso para essa empresa foi expirado. Consulte os
    {` `}
    <Link
      to={{ pathname: 'https://assine.iuli.com.br/planos' }}
      target="_blank"
    >
      planos disponíveis
    </Link>
    {` `}e faça a renovação do seu plano.
  </AlertIcon>
);

export default CompanyExpired;
