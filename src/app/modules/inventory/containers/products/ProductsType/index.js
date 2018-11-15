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
    list: state.reducer.productsType.request,
    add: state.reducer.productsType.add,
    update: state.reducer.productsType.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productsType = Form.create(mapPropsToFields)(ProductsType);

export default connect(mapStateToProps)(productsType);