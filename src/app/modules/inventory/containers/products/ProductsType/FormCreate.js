import React from "react";
import CreateProductsType from "../../../components/products/ProductsType/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class ProductTypeForm extends React.Component {
  render() {
    return (
      <CreateProductsType {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productsTypeAdd: state.reducer.productsType.add,
    productsType: state.reducer.productsType.request.list,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productTypeForm =  Form.create(mapPropsToFields)(ProductTypeForm);

export default connect(mapStateToProps)(productTypeForm);