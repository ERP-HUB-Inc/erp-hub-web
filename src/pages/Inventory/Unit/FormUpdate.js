import React from "react";
import { connect } from "@redux/index";
import { Form } from "antd";
import FormUpdatePage from "./components/FormUpdate";

function FormUpdateContainer(props) {
  return <FormUpdatePage {...props} />;
}

function mapStateToProps(state) {
  return {
    productsUnitUpdate: state.reducer.productsUnit.update,
    initialValues: state.reducer.productsUnit.update.data,
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