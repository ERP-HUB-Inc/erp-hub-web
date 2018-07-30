import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormCreate from "../../../components/settings/IncomeAndExpense/FormCreate";

class IncomeAndExpenseForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    incomeAndExpenseAdd: state.reducer.incomeAndExpense.add
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const incomeAndExpenseForm =  Form.create(mapPropsToFields)(IncomeAndExpenseForm);

export default connect(mapStateToProps)(incomeAndExpenseForm);