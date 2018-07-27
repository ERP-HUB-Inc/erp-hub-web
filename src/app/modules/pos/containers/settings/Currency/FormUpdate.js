import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormUpdate from "../../../components/settings/Currency/FormUpdate";

class CurrencyUpdateForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    formUpdate: state.form.formCurrencyUpdate,
    currencyUpdate: state.reducer.currency.update,
    initialValues: state.reducer.currency.update.data
  };
}

const UpdateTax = reduxForm({
  form: "formCurrencyUpdate",
  enableReinitialize: true
})(CurrencyUpdateForm);

export default connect(mapStateToProps)(UpdateTax);