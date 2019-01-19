import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import PurchaseList from "../../../components/stock/PurchaseOrder";

class List extends React.Component {
  render() {
    return (
      <PurchaseList {...this.props} />
    );
  }
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

const list = Form.create(mapPropsToFields)(List);

export default connect(mapStateToProps)(list);