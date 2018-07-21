import React from "react";
import { connect } from "react-redux";
import { formValueSelector , reduxForm } from "redux-form";
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
    formAdd: state.form.formPaymentMethod,
    paymentMethod: state.reducer.paymentMethod
  };
}

const SelectingPaymentMethodForm = reduxForm({
  form: "formPaymentMethod"
})(PaymentMethod);

export default connect(mapStateToProps)(SelectingPaymentMethodForm);