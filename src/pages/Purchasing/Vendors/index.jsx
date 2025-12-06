import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import SupplierPage from "./form";

function SupplierContainer(props) {
  return <SupplierPage {...props} />;
}

function mapStateToProps(state) {
  return {
    list: state.reducer.supplier.request,
    add: state.reducer.supplier.add,
    update: state.reducer.supplier.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const supplierContainer = Form.create(mapPropsToFields)(SupplierContainer);

export default connect(mapStateToProps)(supplierContainer);