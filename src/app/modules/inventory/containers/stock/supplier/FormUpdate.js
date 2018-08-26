import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/stock/supplier/FormUpdate";

class SupplierForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
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

const supplierForm = Form.create(mapPropsToFields)(SupplierForm);

export default connect(mapStateToProps)(supplierForm);