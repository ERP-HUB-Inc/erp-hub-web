import React from "react";
import Create from "../../../components/stock/purchaseOrder/FormCreate";
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
    locale: state.locale,
    supplier: state.reducer.supplier.request,
    productSearch: state.reducer.product.search,
    product: state.reducer.product.request,
    storeLocation: state.reducer.storeLocation.request,
    requestOrderNumber: state.reducer.purchaseOrder.requestOrderNumber
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formList =  Form.create(mapPropsToFields)(FormList);

export default connect(mapStateToProps)(formList);