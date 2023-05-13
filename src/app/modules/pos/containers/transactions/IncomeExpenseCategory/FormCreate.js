import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormCreate from "../../../components/transactions/IncomeExpenseCategory/FormCreate";

class Container extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    incomeExpenseCategoryAdd: state.reducer.incomeExpenseCategory.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const container =  Form.create(mapPropsToFields)(Container);

export default connect(mapStateToProps)(container);