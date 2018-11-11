import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import List from "../../../components/transactions/OpenSaleRegistration/";

class OpenSaleRegistrationList extends React.Component {
  render() {
    return <List {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    openSaleRegistration: state.reducer.openSaleRegistration.request,
    open: state.reducer.openSaleRegistration.open,
    close: state.reducer.openSaleRegistration.close,
    todaySaleSummary: state.reducer.transaction.todaySaleSummary,
    paymentMethodList: state.reducer.paymentMethods.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const openSaleRegistrationList = Form.create(mapPropsToFields)(OpenSaleRegistrationList);

export default connect(mapStateToProps)(openSaleRegistrationList);