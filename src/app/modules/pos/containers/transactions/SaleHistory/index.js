import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import List from "../../../components/transactions/SaleHistory/";

class SaleHistoryList extends React.Component {
  render() {
    return <List {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.transaction.request,
    detail: state.reducer.transaction.detail,
    storeLocation: state.reducer.location.request,
    users: state.reducer.user.request,
    receiptTemplate: state.reducer.receiptTemplate.detail,
    checkPermission: state.reducer.privilege.checkPermission,
    updateReceivePayment: state.reducer.transaction.updateReceivePayment,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const saleHistory = Form.create(mapPropsToFields)(SaleHistoryList);

export default connect(mapStateToProps)(saleHistory);