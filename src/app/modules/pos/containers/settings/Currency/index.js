import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import List from "../../../components/settings/Currency";

class Currency extends React.Component {

  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    formAdd: state.form.formCurrency,
    currency: state.reducer.currency.request,
    currencyAdd: state.reducer.currency.add,
    currencyUpdate: state.reducer.currency.update
  };
}

const SelectingCurrency = reduxForm({
  form: "formCurrency"
})(Currency);

export default connect(mapStateToProps)(SelectingCurrency);