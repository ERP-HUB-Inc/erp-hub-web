import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormCreate from "../../../components/settings/StoreLanguage/FormCreate";

class PaymentMethodForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    formStoreLanguage: state.form.formStoreLanguage,
    formLanguageAdd: state.reducer.tax.add
  };
}

const SelectingPaymentMethodForm = reduxForm({
  form: "formStoreLanguage"
})(PaymentMethodForm);

export default connect(mapStateToProps)(SelectingPaymentMethodForm);