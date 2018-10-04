import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import Payment from "../../../components/transactions/RetailSale/Payment";
class PaymentForm extends React.Component {
  render() {
    return (
      <Payment {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
    transaction: state.reducer.transaction.posPay
  };
}
  
function mapPropsToFields(props) {
  return {
    form: props.form
  };
}
  
const paymentForm =  Form.create(mapPropsToFields)(PaymentForm);
  
export default connect(mapStateToProps)(paymentForm);