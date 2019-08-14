import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import ReceivePaymentForm from "../../../components/transactions/SaleHistory/ReceivePayment";

class ReceivePayment extends React.Component {
  render() {
    return <ReceivePaymentForm {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    updateReceivePayment: state.reducer.transaction.updateReceivePayment,
    detailTransaction: state.reducer.transaction.detail,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const receivePayment = Form.create(mapPropsToFields)(ReceivePayment);

export default connect(mapStateToProps)(receivePayment);