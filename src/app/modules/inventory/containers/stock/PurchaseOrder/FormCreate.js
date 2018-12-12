import React from "react";
import Create from "../../../components/stock/PurchaseOrder/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class FormList extends React.Component {
  render() {
    return (
      <Create {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    purchaseOrderAdd: state.reducer.purchaseOrder.add,
    productUpdate: state.reducer.purchaseOrder.update,
    supplier: state.reducer.supplier.request,
    productSearch: state.reducer.product.search,
    product: state.reducer.product.request,
    productVariant: state.reducer.productVariant.request,
    storeLocation: state.reducer.storeLocation.request,
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