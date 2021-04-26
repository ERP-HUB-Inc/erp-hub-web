import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/settings/CurrencyExchange/FormUpdate";

class CurrencyUpdateForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    currencyExchangeUpdate: state.reducer.currencyExchange.update,
    currency: state.reducer.currency.request,
    initialValues: state.reducer.currencyExchange.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const currencyUpdateForm = Form.create(mapPropsToFields)(CurrencyUpdateForm);

export default connect(mapStateToProps)(currencyUpdateForm);