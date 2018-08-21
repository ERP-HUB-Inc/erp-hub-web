import React from "react";
import { connect } from "react-redux";
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

export default connect(mapStateToProps)(ProductsType);