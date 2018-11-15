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
    productUpdate: state.reducer.product.update,
    brands: state.reducer.brand.request,
    units: state.reducer.productsUnit.request,
    taxs: state.reducer.tax.request,
    tags: state.reducer.productsTag.request,
    productsType: state.reducer.productsType.request,
    storeLanguage: state.reducer.storeLanguage.request,
    locations: state.reducer.storeLocation.request,
    variantAttributes: state.reducer.variantAttribute.request,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const product = Form.create(mapPropsToFields)(Product);

export default connect(mapStateToProps)(product);