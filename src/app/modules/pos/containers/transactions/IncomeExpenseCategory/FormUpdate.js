import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/transactions/IncomeExpenseCategory/FormUpdate";

class Container extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    incomeExpenseCategoryUpdate: state.reducer.incomeExpenseCategory.update,
    initialValues: state.reducer.incomeExpenseCategory.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const container = Form.create(mapPropsToFields)(Container);

export default connect(mapStateToProps)(container);