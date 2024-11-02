import React from "react";
import { connect } from "@redux/index";
import { Form } from "antd";
import FormCreatePage from "./components/FormCreate";

function FormCreateContainer(props) {
  return <FormCreatePage {...props} />;
}

function mapStateToProps(state) {
  return {
    productsUnitAdd: state.reducer.productsUnit.add,
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