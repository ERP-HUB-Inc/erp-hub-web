import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormCreate from "../../../components/settings/Tax/FormCreate";

class PaymentMethodForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    TaxAdd: state.reducer.tax.add
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const paymentMethodForm = Form.create(mapPropsToFields)(PaymentMethodForm);

export default connect(mapStateToProps)(paymentMethodForm);