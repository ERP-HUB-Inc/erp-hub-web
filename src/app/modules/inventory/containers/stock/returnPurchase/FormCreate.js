import React from "react";
import CreateSupplier from "../../../components/stock/returnPurchase/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class ReturnPurchaseForm extends React.Component {
  render() {
    return (
      <CreateSupplier {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    returnPurchaseAdd: state.reducer.returnPurchase.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const returnPurchaseForm =  Form.create(mapPropsToFields)(ReturnPurchaseForm);

export default connect(mapStateToProps)(returnPurchaseForm);