import React from 'react';
import { Row, Col, Label, FormGroup } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import Slider from 'rc-slider';

import ProductTypeServiceForm from './ProductTypeServiceForm';
import ProductTypeProductForm from './ProductTypeProductForm';
import 'rc-slider/assets/index.css';

const { createSliderWithTooltip } = Slider;
const CustomSlider = createSliderWithTooltip(Slider);

const ProductTypeSplitForm = ({ formik }) => (
  <>
    <Row>
      <Col md="12" sm="12" className="mt-2 mb-2">
        <FormGroup>
          <Label for="percentage_product" className="mb-5">
            <FormattedMessage id="products.percentage_product" /> *
          </Label>
          <CustomSlider
            defaultValue={50}
            trackStyle={{ backgroundColor: '#00cfe8', height: 10 }}
            handleStyle={{
              borderColor: '#00cfe8',
              height: 28,
              width: 28,
              marginLeft: -0,
              marginTop: -9,
              backgroundColor: 'black',
            }}
            railStyle={{ backgroundColor: 'red', height: 10 }}
            min={1}
            max={99}
            value={formik.values.percentage_product}
            onChange={(value) => {
              formik.setFieldValue('percentage_product', value);
              formik.setFieldValue('percentage_service', 100 - value);
            }}
            tipFormatter={(value) => (
              <>
                <span className="text-info">{value}% Produto</span>
                <span> </span>
                <span className="text-danger">{100 - value}% Serviço</span>
              </>
            )}
          />
        </FormGroup>
      </Col>
      <Col className="mt-1" sm="12">
        <ProductTypeServiceForm formik={formik} />
      </Col>
      <Col className="mt-1" sm="12">
        <ProductTypeProductForm formik={formik} />
      </Col>
    </Row>
  </>
);

ProductTypeSplitForm.propTypes = {};

ProductTypeSplitForm.defaultProps = {};

export default ProductTypeSplitForm;
