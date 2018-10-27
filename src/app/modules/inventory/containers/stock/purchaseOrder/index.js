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
    purchaseOrderArchive: state.reducer.purchaseOrder.archive,
    purchaseOrderUpdate: state.reducer.purchaseOrder.update,
    purchaseOrderPushToSupplier: state.reducer.purchaseOrder.pushToSupplier,
    supplier: state.reducer.supplier.request,
    storeLocation: state.reducer.storeLocation.request,
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const list = Form.create(mapPropsToFields)(List);

export default connect(mapStateToProps)(list);