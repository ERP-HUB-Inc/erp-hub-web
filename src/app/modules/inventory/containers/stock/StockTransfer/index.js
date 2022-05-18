import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import StockTransfer from "../../../components/stock/StockTransfer";

function StockTransferContainer(props) {
  return <StockTransfer {...props} />;
}

function mapStateToProps(state) {
  return {
    list: state.reducer.stockTransfer.request,
    add: state.reducer.stockTransfer.add,
    update: state.reducer.stockTransfer.update,
    detail: state.reducer.stockTransfer.detail,
    cancel: state.reducer.stockTransfer.cancel,
    approve: state.reducer.stockTransfer.approve,
    storeLocation: state.reducer.location.request,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const stockTransferContainer = Form.create(mapPropsToFields)(StockTransferContainer);

export default connect(mapStateToProps)(stockTransferContainer);