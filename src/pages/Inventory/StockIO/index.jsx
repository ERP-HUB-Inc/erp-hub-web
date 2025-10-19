import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import StockInOutPage from "./form";

function PurchaseOrderContainer(props) {
  return <StockInOutPage {...props} />;
}

function mapStateToProps(state) {
  return {
    purchaseOrder: state.reducer.purchaseOrder.request,
    purchaseOrderAdd: state.reducer.purchaseOrder.add,
    purchaseOrderDetail: state.reducer.purchaseOrder.detail,
    purchaseOrderArchive: state.reducer.purchaseOrder.archive,
    purchaseOrderUpdate: state.reducer.purchaseOrder.update,
    purchaseOrderPushToSupplier: state.reducer.purchaseOrder.pushToSupplier,
    supplier: state.reducer.supplier.request,
    mail: state.reducer.mail.send,
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

const purchaseOrderContainer = Form.create(mapPropsToFields)(PurchaseOrderContainer);

export default connect(mapStateToProps)(purchaseOrderContainer);