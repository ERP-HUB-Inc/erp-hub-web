import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCreate from "../../../components/settings/PaymentMethod/FormCreate";

class PaymentMethodForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentMethodAdd: state.reducer.PaymentMethods.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const paymentMethodForm =  Form.create(mapPropsToFields)(PaymentMethodForm);

export default connect(mapStateToProps)(paymentMethodForm);