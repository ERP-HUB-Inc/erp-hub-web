import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import List from "../../../components/transactions/IncomeExpenseCategory";

class Condition extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.incomeExpenseCategory.request,
    add: state.reducer.incomeExpenseCategory.add,
    update: state.reducer.incomeExpenseCategory.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const condition = Form.create(mapPropsToFields)(Condition);

export default connect(mapStateToProps)(condition);