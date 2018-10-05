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
    saleHistory: state.reducer.saleHistory.request,
    saleHistoryAdd: state.reducer.saleHistory.add,
    saleHistoryUpdate: state.reducer.saleHistory.update,
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