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
    locale: state.locale,
    supplier: state.reducer.supplier.request,
    product: state.reducer.product.request,
    storeLocation: state.reducer.storeLocation.request,
    supplierDetail: state.reducer.supplier.detail,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formList =  Form.create(mapPropsToFields)(FormList);

export default connect(mapStateToProps)(formList);