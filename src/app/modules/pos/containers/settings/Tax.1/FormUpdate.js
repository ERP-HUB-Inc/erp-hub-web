import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormUpdate from "../../../components/settings/PaymentMethod/FormUpdate";

class PaymentMethodForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    formUpdate: state.form.formPaymentMethodUpdate,
    paymentMethodUpdate: state.reducer.PaymentMethods.update,
    initialValues: state.reducer.PaymentMethods.update.data
  };
}

const SelectingPaymentMethodForm = reduxForm({
  form: "formPaymentMethodUpdate",
  enableReinitialize: true
})(PaymentMethodForm);

export default connect(mapStateToProps)(SelectingPaymentMethodForm);