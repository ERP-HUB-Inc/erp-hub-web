import React from "react";
import { connect } from "@redux";
import { Form } from "antd";
import FormCreatePage from "./form/form.create";

function FormCreateContainer(props) {
  return <FormCreatePage {...props} />;
}

function mapStateToProps(state) {
  return {
    brandAdd: state.reducer.brand.add,
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