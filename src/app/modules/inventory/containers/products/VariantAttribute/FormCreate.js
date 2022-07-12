import React from "react";
import {connect } from "react-redux";
import {Form} from "antd";
import FormCreate from "../../../components/products/VariantAttribute/FormCreate";

function VariantAttributeForm(props) {
  return <FormCreate {...props} />;
}

function mapStateToProps(state) {
  return {
    variantAttributes: state.reducer.variantAttribute.request,
    variantAttributeAdd: state.reducer.variantAttribute.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const variantAttributeForm =  Form.create(mapPropsToFields)(VariantAttributeForm);

export default connect(mapStateToProps)(variantAttributeForm);