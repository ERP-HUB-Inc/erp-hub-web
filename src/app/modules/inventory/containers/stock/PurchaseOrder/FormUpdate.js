import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/stock/PurchaseOrder/FormUpdate";

class Forms extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    purchaseOrderUpdate: state.reducer.purchaseOrder.update,
    purchaseOrderDetail: state.reducer.purchaseOrder.detail, 
    pushToSupplier: state.reducer.purchaseOrder.pushToSupplier,
    supplier: state.reducer.supplier.request,
    unit: state.reducer.productsUnit.request,
    productVariant: state.reducer.productVariant.request,
    productSearch: state.reducer.product.search,
    storeLocation: state.reducer.location.request,
    requestOrderNumber: state.reducer.purchaseOrder.requestOrderNumber,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const form = Form.create(mapPropsToFields)(Forms);

export default connect(mapStateToProps)(form);