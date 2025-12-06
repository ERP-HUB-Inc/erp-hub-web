import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormCreatePage from "./form/form.create";

function SupplierContainer(props) {
  return <FormCreatePage {...props} />;
}
  
function mapStateToProps(state) {
  return {
    supplierAdd: state.reducer.supplier.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const supplierContainer =  Form.create(mapPropsToFields)(SupplierContainer);

export default connect(mapStateToProps)(supplierContainer);