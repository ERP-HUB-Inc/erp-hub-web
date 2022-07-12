import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import VariantAttributeList from "../../../components/products/VariantAttribute";

function VariantAttribute(props) {
  return <VariantAttributeList {...props} />;
}

function mapStateToProps(state) {
  return {
    variantAttributes: state.reducer.variantAttribute.request,
    variantAttributeAdd: state.reducer.variantAttribute.add,
    variantAttributeUpdate: state.reducer.variantAttribute.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const variantAttribute = Form.create(mapPropsToFields)(VariantAttribute);

export default connect(mapStateToProps)(variantAttribute);