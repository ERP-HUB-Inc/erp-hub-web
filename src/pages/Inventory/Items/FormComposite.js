import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCompositePage from "./form/FormCompositePage";

function FormCompositeContainer(props) {
  return <FormCompositePage {...props} />;
}

function mapStateToProps(state) {
  return {
    units: state.reducer.productsUnit.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formCompositeContainer =  Form.create(mapPropsToFields)(FormCompositeContainer);

export default connect(mapStateToProps)(formCompositeContainer);