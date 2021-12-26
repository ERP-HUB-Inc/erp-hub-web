import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCreate from "../../../components/products/Product/FormCreate";

class ProductForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productAdd: state.reducer.product.add,
    switchAutoGenerateSKU: state.reducer.product.switchTypeOfGenerateSKU,
    productVariantArchive: state.reducer.product.archiveVariant,
    productVariantCheckStatus: state.reducer.productVariant.checkStatus,
    productAttributeCheckStatus: state.reducer.productVariant.checkStatusAttribute,
    productAttributeValueCheckStatus: state.reducer.productVariant.checkStatusAttributeValue,
    productSearch: state.reducer.product.search,
    brands: state.reducer.brand.request,
    brandAdd: state.reducer.brand.add,
    productsType: state.reducer.productsType.request,
    productsTypeAdd: state.reducer.productsType.add,
    units: state.reducer.productsUnit.request,
    unitAdd: state.reducer.productsUnit.add,
    taxAdd: state.reducer.tax.add,
    taxs: state.reducer.tax.request,
    tags: state.reducer.productsTag.request,
    tagAdd: state.reducer.productsTag.add,
    variantAttributes: state.reducer.variantAttribute.request,
    variantAttributeAdd: state.reducer.variantAttribute.add,
    storeLanguage: state.reducer.storeLanguage.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productForm =  Form.create(mapPropsToFields)(ProductForm);

export default connect(mapStateToProps)(productForm);