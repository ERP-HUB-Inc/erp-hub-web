import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormCreate from "../../../components/settings/PaymentMethod/FormCreate";

class PaymentMethodForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    formAdd: state.form.formPaymentMethod,
    paymentMethodAdd: state.reducer.PaymentMethods.add
  };
}

const SelectingPaymentMethodForm = reduxForm({
  form: "formPaymentMethod"
})(PaymentMethodForm);

export default connect(mapStateToProps)(SelectingPaymentMethodForm);