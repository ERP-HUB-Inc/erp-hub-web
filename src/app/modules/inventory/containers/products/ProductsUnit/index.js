import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import ProductUnitList from "../../../components/products/ProductsUnit";

class ProductsUnit extends React.Component {
  render() {
    return (
      <ProductUnitList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.productsUnit.request,
    add: state.reducer.productsUnit.add,
    update: state.reducer.productsUnit.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productsUnit = Form.create(mapPropsToFields)(ProductsUnit);

export default connect(mapStateToProps)(productsUnit);