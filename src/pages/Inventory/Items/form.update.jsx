import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormUpdatPage from "./form/form.update";

function FormUpdateContainer(props) {
  return <FormUpdatPage {...props} />;
}

function mapStateToProps(state) {
  return {
    productUpdate: state.reducer.product.update,
    switchAutoGenerateSKU: state.reducer.product.switchTypeOfGenerateSKU,
    productDetail: state.reducer.product.detail,
    productLog: state.reducer.product.requestLog,
    productCostLog: state.reducer.product.requestCostLog,
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
    taxs: state.reducer.tax.request,
    taxAdd: state.reducer.tax.add,
    tags: state.reducer.productsTag.request,
    tagAdd: state.reducer.productsTag.add,
    variantAttributes: state.reducer.variantAttribute.request,
    variantAttributeAdd: state.reducer.variantAttribute.add,
    storeLanguage: state.reducer.storeLanguage.request.list,
    locations: state.reducer.location.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formUpdateContainer = Form.create(mapPropsToFields)(FormUpdateContainer);

export default connect(mapStateToProps)(formUpdateContainer);