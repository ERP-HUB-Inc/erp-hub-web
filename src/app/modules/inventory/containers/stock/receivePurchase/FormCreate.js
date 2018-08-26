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