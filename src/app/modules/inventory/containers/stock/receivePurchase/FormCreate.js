import React from "react";
import CreateSupplier from "../../../components/stock/receivePurchase/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class SupplierForm extends React.Component {
  render() {
    return (
      <CreateSupplier {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    receivePurchaseAdd: state.reducer.receivePurchase.add,
    supplier: state.reducer.supplier.request,
    product: state.reducer.product.request,
    storeLocation: state.reducer.storeLocation.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const receivePurchaseForm =  Form.create(mapPropsToFields)(SupplierForm);

export default connect(mapStateToProps)(receivePurchaseForm);