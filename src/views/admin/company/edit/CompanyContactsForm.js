import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form } from 'reactstrap';
import { User } from 'react-feather';
import { useIntl } from 'react-intl';
import { get } from 'lodash';

import 'flatpickr/dist/themes/light.css';
import '../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

import TextField from '../../../../components/inputs/TextField';

import {
  formatCommercialPhone,
  formatMobilePhone,
  getOnlyNumbers,
} from '../../../../utils/formaters';

const CompanyContactsForm = ({ formik }) => {
  const intl = useIntl();

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row className="mt-1">
        <Col className="mt-1" sm="12">
          <h3 className="mt-1 text-primary">
            <span className="align-middle">Contatos</span>
          </h3>
        </Col>
        <Col className="mt-1" md="6" sm="12">
          <h5 className="mb-1">
            <User className="mr-50" size={16} />
            <span className="align-middle">Contato Principal</span>
          </h5>
          <TextField
            id="contacts[1].name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.contacts[1].name}
            placeholder={intl.formatMessage({ id: 'contacts.name' })}
            label={intl.formatMessage({ id: 'contacts.name' })}
            error={
              get(formik.touched, 'contacts[1].name') &&
              get(formik.errors, 'contacts[1].name')
            }
          />
          <TextField
            id="contacts[1].email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.contacts[1].email}
            placeholder={intl.formatMessage({ id: 'contacts.email' })}
            label={intl.formatMessage({ id: 'contacts.email' })}
            error={
              get(formik.touched, 'contacts[1].email') &&
              get(formik.errors, 'contacts[1].email')
            }
          />
          <TextField
            id="contacts[1].phone"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue(
                'contacts[1].phone',
                getOnlyNumbers(e.target.value)
              )
            }
            value={formatCommercialPhone(formik.values.contacts[1].phone)}
            placeholder={intl.formatMessage({ id: 'contacts.phone' })}
            label={intl.formatMessage({ id: 'contacts.phone' })}
            error={
              get(formik.touched, 'contacts[1].phone') &&
              get(formik.errors, 'contacts[1].phone')
            }
          />
          <TextField
            id="contacts[1].whatsapp"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue(
                'contacts[1].whatsapp',
                getOnlyNumbers(e.target.value)
              )
            }
            value={formatMobilePhone(formik.values.contacts[1].whatsapp)}
            placeholder={intl.formatMessage({ id: 'contacts.whatsapp' })}
            label={intl.formatMessage({ id: 'contacts.whatsapp' })}
            error={
              get(formik.touched, 'contacts[1].whatsapp') &&
              get(formik.errors, 'contacts[1].whatsapp')
            }
          />
        </Col>
        <Col className="mt-1" md="6" sm="12">
          <h5 className="mb-1">
            <User className="mr-50" size={16} />
            <span className="align-middle">Contato Financeiro</span>
          </h5>
          <TextField
            id="contacts[0].name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.contacts[0].name}
            placeholder={intl.formatMessage({ id: 'contacts.name' })}
            label={intl.formatMessage({ id: 'contacts.name' })}
            error={
              get(formik.touched, 'contacts[0].name') &&
              get(formik.errors, 'contacts[0].name')
            }
          />
          <TextField
            id="contacts[0].email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.contacts[0].email}
            placeholder={intl.formatMessage({ id: 'contacts.email' })}
            label={intl.formatMessage({ id: 'contacts.email' })}
            error={
              get(formik.touched, 'contacts[0].email') &&
              get(formik.errors, 'contacts[0].email')
            }
          />
          <TextField
            id="contacts[0].phone"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue(
                'contacts[0].phone',
                getOnlyNumbers(e.target.value)
              )
            }
            value={formatCommercialPhone(formik.values.contacts[0].phone)}
            placeholder={intl.formatMessage({ id: 'contacts.phone' })}
            label={intl.formatMessage({ id: 'contacts.phone' })}
            error={
              get(formik.touched, 'contacts[0].phone') &&
              get(formik.errors, 'contacts[0].phone')
            }
          />
          <TextField
            id="contacts[0].whatsapp"
            onBlur={formik.handleBlur}
            onChange={(e) =>
              formik.setFieldValue(
                'contacts[0].whatsapp',
                getOnlyNumbers(e.target.value)
              )
            }
            value={formatMobilePhone(formik.values.contacts[0].whatsapp)}
            placeholder={intl.formatMessage({ id: 'contacts.whatsapp' })}
            label={intl.formatMessage({ id: 'contacts.whatsapp' })}
            error={
              get(formik.touched, 'contacts[0].whatsapp') &&
              get(formik.errors, 'contacts[0].whatsapp')
            }
          />
        </Col>
      </Row>
    </Form>
  );
};

CompanyContactsForm.propTypes = {
  formik: PropTypes.object.isRequired,
};

CompanyContactsForm.defaultProps = {};

export default CompanyContactsForm;
