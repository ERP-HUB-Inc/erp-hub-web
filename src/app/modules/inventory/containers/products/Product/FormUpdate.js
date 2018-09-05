import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormUpdate from "../../../components/products/Product/FormUpdate";

class ProductForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productUpdate: state.reducer.product.update,
    productDetail: state.reducer.product.detail,
    productVariantArchive: state.reducer.product.archiveVariant,
    productSearch: state.reducer.product.search,
    brands: state.reducer.brand.request,
    brandAdd: state.reducer.brand.add,
    productsType: state.reducer.productsType.request,
    productsTypeAdd: state.reducer.productsType.add,
    units: state.reducer.productsUnit.request,
    unitAdd: state.reducer.productsUnit.add,
    taxs: state.reducer.tax.request,
    taxAdd: state.reducer.tax.add,
    tags: state.reducer.productsTag.request,
    tagAdd: state.reducer.productsTag.add,
    variantAttributes: state.reducer.variantAttribute.request,
    variantAttributeAdd: state.reducer.variantAttribute.add,
    storeLanguage: state.reducer.storeLanguage.request.list,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productForm = Form.create(mapPropsToFields)(ProductForm);

export default connect(mapStateToProps)(productForm);