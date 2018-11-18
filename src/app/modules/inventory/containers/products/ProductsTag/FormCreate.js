import React from "react";
import CreateProductsUnit from "../../../components/products/ProductsTag/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class ProductUnitForm extends React.Component {
  render() {
    return (
      <CreateProductsUnit {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productsTagAdd: state.reducer.productsTag.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productsTagForm =  Form.create(mapPropsToFields)(ProductUnitForm);

export default connect(mapStateToProps)(productsTagForm);