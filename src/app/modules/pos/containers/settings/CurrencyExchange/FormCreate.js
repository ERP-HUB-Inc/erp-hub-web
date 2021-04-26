import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormCreate from "../../../components/settings/CurrencyExchange/FormCreate";

class CurrencyExchangeForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    currencyExchangeAdd: state.reducer.currencyExchange.add,
    currency: state.reducer.currency.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const currencyExchangeForm = Form.create(mapPropsToFields)(CurrencyExchangeForm);

export default connect(mapStateToProps)(currencyExchangeForm);