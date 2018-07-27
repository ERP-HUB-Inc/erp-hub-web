import React from "react";
import { connect } from "react-redux";
import PaymentMethodList from "../../../components/settings/PaymentMethod";

class PaymentMethod extends React.Component {
  render() {
    return (
      <PaymentMethodList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentMethod: state.reducer.PaymentMethods.request,
    paymentMethodAdd: state.reducer.PaymentMethods.add,
    paymentMethodArchive: state.reducer.PaymentMethods.archive,
    paymentMethodUpdate: state.reducer.PaymentMethods.update
  };
}

export default connect(mapStateToProps)(PaymentMethod);