import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdatePage from "./components/FormUpdate";

function FormUpdateContainer(props) {
  return <FormUpdatePage {...props} />;
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

const formUpdateContainer = Form.create(mapPropsToFields)(FormUpdateContainer);

export default connect(mapStateToProps)(formUpdateContainer);