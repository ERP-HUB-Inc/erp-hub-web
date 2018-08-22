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
    productsUnit: state.reducer.productsUnit.request,
    productsUnitAdd: state.reducer.productsUnit.add,
    productsUnitArchive: state.reducer.productsUnit.archive,
    productsUnitUpdate: state.reducer.productsUnit.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productsUnit = Form.create(mapPropsToFields)(ProductsUnit);

export default connect(mapStateToProps)(productsUnit);