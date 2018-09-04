import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import ProductsTypeList from "../../../components/products/ProductsType";

class ProductsType extends React.Component {
  render() {
    return (
      <ProductsTypeList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productsType: state.reducer.productsType.request,
    productsTypeAdd: state.reducer.productsType.add,
    productsTypeArchive: state.reducer.productsType.archive,
    productsTypeUpdate: state.reducer.productsType.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productsType = Form.create(mapPropsToFields)(ProductsType);

export default connect(mapStateToProps)(productsType);