import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormCreate from "../../../components/settings/Currency/FormCreate";

class CurrencyForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    currencyFormAdd: state.form.formCurrency,
    currencyAdd: state.reducer.currency.add
  };
}

const SelectingCurrency = reduxForm({
  form: "formCurrency"
})(CurrencyForm);

export default connect(mapStateToProps)(SelectingCurrency);