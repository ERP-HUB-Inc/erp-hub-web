import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import PaymentMethodList from "../../../components/settings/PaymentMethod";

class PaymentMethod extends React.Component {
  render() {
    return (
      <PaymentMethodList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentMethod: state.reducer.paymentMethods.request,
    paymentMethodAdd: state.reducer.paymentMethods.add,
    paymentMethodArchive: state.reducer.paymentMethods.archive,
    paymentMethodUpdate: state.reducer.paymentMethods.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const paymentMethod = Form.create(mapPropsToFields)(PaymentMethod);

export default connect(mapStateToProps)(paymentMethod);