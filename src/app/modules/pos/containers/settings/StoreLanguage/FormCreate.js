import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormCreate from "../../../components/settings/StoreLanguage/FormCreate";

class StoreLanguageForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    storeLanguageFormAdd: state.form.formStoreLanguage,
    storeLanguageAdd: state.reducer.storeLanguage.add
  };
}

const SelectingPaymentMethodForm = reduxForm({
  form: "formStoreLanguage"
})(StoreLanguageForm);

export default connect(mapStateToProps)(SelectingPaymentMethodForm);