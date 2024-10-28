import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import InvoicePage from "../../../components/transactions/Invoice";

function InvoiceContainer(props) {
  return <InvoicePage {...props} />;
}

export function mapStateToProps(state) {
  return {
    list: state.reducer.transaction.request,
    detail: state.reducer.transaction.detail,
    storeLocation: state.reducer.location.request,
    users: state.reducer.user.request,
    receiptTemplate: state.reducer.receiptTemplate.detail,
    checkPermission: state.reducer.privilege.checkPermission,
    updateReceivePayment: state.reducer.transaction.updateReceivePayment,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const invoiceContainer = Form.create(mapPropsToFields)(InvoiceContainer);

export default connect(mapStateToProps)(invoiceContainer);