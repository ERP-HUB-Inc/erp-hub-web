import React from "react";
import { connect } from "react-redux";
import List from "../../../components/settings/PaymentMethod";

class PaymentMethod extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return state.reducer.paymentMethod;
}

export default connect(mapStateToProps)(PaymentMethod);