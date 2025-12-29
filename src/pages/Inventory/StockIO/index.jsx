import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import StockInOutPage from "./form";

function StockInOutContainer(props) {
  return <StockInOutPage {...props} />;
}

function mapStateToProps(state) {
  return {
    purchaseOrder: state.reducer.purchaseOrder.request,
    purchaseOrderAdd: state.reducer.purchaseOrder.add,
    purchaseOrderDetail: state.reducer.purchaseOrder.detail,
    purchaseOrderArchive: state.reducer.purchaseOrder.archive,
    purchaseOrderUpdate: state.reducer.purchaseOrder.update,
    supplier: state.reducer.supplier.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const stockInOutContainer = Form.create(mapPropsToFields)(StockInOutContainer);

export default connect(mapStateToProps)(stockInOutContainer);