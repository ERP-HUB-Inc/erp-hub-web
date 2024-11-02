import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormCreatePage from "./components/FormCreate";

function FormCreateContainer(props) {
  return <FormCreatePage {...props} />;
}

function mapStateToProps(state) {
  return {
    productsTypeAdd: state.reducer.productsType.add,
    productsType: state.reducer.productsType.request.list,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formCreateContainer =  Form.create(mapPropsToFields)(FormCreateContainer);

export default connect(mapStateToProps)(formCreateContainer);