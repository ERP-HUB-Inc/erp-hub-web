import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCreate from "../../../components/products/Product/FormCreate";

class ProductForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productAdd: state.reducer.product.add,
    units: state.reducer.productsUnit.request,
    unitAdd: state.reducer.productsUnit.add,
    taxs: state.reducer.tax.request,
    taxAdd: state.reducer.tax.add,
    brands: state.reducer.brand.request,
    brandAdd: state.reducer.brand.add,
    tags: state.reducer.productsTag.request,
    tagAdd: state.reducer.productsTag.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productForm =  Form.create(mapPropsToFields)(ProductForm);

export default connect(mapStateToProps)(productForm);