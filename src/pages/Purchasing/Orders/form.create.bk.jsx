import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCreatePage from "./form/form.create.bk";

function FormCreateContainer(props) {
  return <FormCreatePage {...props} />;
}
  
function mapStateToProps(state) {
  return {
    purchaseOrderAdd: state.reducer.purchaseOrder.add,
    unit: state.reducer.productsUnit.request,
    productSearch: state.reducer.product.search,
    productVariant: state.reducer.productVariant.request,
    storeLocation: state.reducer.location.request,
    requestOrderNumber: state.reducer.purchaseOrder.requestOrderNumber,
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formCreateContainer =  Form.create(mapPropsToFields)(FormCreateContainer);

export default connect(mapStateToProps)(formCreateContainer);