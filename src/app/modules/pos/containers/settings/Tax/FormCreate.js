import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormCreate from "../../../components/settings/Tax/FormCreate";

class PaymentMethodForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    formAdd: state.form.formTaxMethod,
    paymentMethodAdd: state.reducer.tax.add
  };
}

const SelectingPaymentMethodForm = reduxForm({
  form: "formTaxMethod"
})(PaymentMethodForm);

export default connect(mapStateToProps)(SelectingPaymentMethodForm);