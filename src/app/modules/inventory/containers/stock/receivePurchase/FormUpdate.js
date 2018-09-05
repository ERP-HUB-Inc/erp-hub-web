import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/stock/receivePurchase/FormUpdate";

class SupplierForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    receivePurchaseUpdate: state.reducer.receivePurchase.update,
    storeLocation: state.reducer.storeLocation.request,
    receivePurchase: state.reducer.receivePurchase.request,
    supplier: state.reducer.supplier.request,
    initialValues: state.reducer.receivePurchase.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const receivePurchaseForm = Form.create(mapPropsToFields)(SupplierForm);

export default connect(mapStateToProps)(receivePurchaseForm);