import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCreate from "../../../components/stock/PurchaseOrder/FormCreate";

class FormList extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    purchaseOrderAdd: state.reducer.purchaseOrder.add,
    supplier: state.reducer.supplier.request,
    productSearch: state.reducer.product.search,
    productVariant: state.reducer.productVariant.request,
    storeLocation: state.reducer.location.request,
    product: state.reducer.product.request,
    requestOrderNumber: state.reducer.purchaseOrder.requestOrderNumber,
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formList =  Form.create(mapPropsToFields)(FormList);

export default connect(mapStateToProps)(formList);