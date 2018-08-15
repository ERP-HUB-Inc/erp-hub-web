import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormUpdate from "../../../components/settings/PaymentMethod/FormUpdate";

class PaymentMethodForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentMethodUpdate: state.reducer.PaymentMethods.update,
    initialValues: state.reducer.PaymentMethods.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const paymentMethodForm = Form.create(mapPropsToFields)(PaymentMethodForm);

export default connect(mapStateToProps)(paymentMethodForm);