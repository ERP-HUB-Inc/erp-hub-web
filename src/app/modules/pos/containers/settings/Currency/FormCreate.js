import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
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
    currencyAdd: state.reducer.currency.add
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const currencyForm = Form.create(mapPropsToFields)(CurrencyForm);

export default connect(mapStateToProps)(currencyForm);