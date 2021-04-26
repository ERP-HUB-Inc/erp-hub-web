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
    list: state.reducer.paymentMethods.request,
    add: state.reducer.paymentMethods.add,
    update: state.reducer.paymentMethods.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const paymentMethod = Form.create(mapPropsToFields)(PaymentMethod);

export default connect(mapStateToProps)(paymentMethod);