import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormUpdate from "../../../components/settings/Tax/FormUpdate";

class TaxForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    // formUpdate: state.form.formPaymentMethodUpdate,
    // paymentMethodUpdate: state.reducer.PaymentMethods.update,
    // initialValues: state.reducer.PaymentMethods.update.data
    formUpdate: state.form.formTaxMethod,
    // paymentMethodUpdate: state.reducer.formTaxMethod.update,
    initialValues: state.reducer.tax.update.data
  };
}

const UpdateTax = reduxForm({
  form: "formTaxUpdate",
  enableReinitialize: true
})(TaxForm);

export default connect(mapStateToProps)(UpdateTax);