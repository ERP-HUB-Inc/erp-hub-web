import React from "react";
import { connect } from "react-redux";
import List from "../../../components/PaymentMethod";
import { fetchPaymentMethods } from "../../../action/paymentMethod";

class PaymentMethod extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPaymentMethods());
  }

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