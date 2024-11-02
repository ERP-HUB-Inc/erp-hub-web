import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import OptionPage from "./components";

function OptionContainer(props) {
  return <OptionPage {...props} />;
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

const optionContainer = Form.create(mapPropsToFields)(OptionContainer);

export default connect(mapStateToProps)(optionContainer);