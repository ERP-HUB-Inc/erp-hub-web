import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
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
    currencyUpdate: state.reducer.currency.update,
    initialValues: state.reducer.currency.update.data
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const currencyUpdateForm = Form.create(mapPropsToFields)(CurrencyUpdateForm);

export default connect(mapStateToProps)(currencyUpdateForm);