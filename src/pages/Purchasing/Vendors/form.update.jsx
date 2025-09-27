import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdatePage from "./form/form.update";

function SupplierFormContainer(props) {
  return <FormUpdatePage {...props} />
}

function mapStateToProps(state) {
  return {
    supplierUpdate: state.reducer.supplier.update,
    initialValues: state.reducer.supplier.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const supplierFormContainer = Form.create(mapPropsToFields)(SupplierFormContainer);

export default connect(mapStateToProps)(supplierFormContainer);