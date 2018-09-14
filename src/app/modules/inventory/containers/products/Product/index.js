import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import ProductList from "../../../components/products/Product";

class Product extends React.Component {
  render() {
    return (
      <ProductList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    products: state.reducer.product.request,
    productAdd: state.reducer.product.add,
    productClone: state.reducer.product.clone,
    productArchive: state.reducer.product.archive,
    productUpdate: state.reducer.product.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const product = Form.create(mapPropsToFields)(Product);

export default connect(mapStateToProps)(product);