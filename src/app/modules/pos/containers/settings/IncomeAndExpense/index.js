import React from "react";
import { connect } from "react-redux";
import IncomeAndExpenseList from "../../../components/settings/IncomeAndExpense";

class IncomeAndExpense extends React.Component {
  render() {
    return (
      <IncomeAndExpenseList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    incomeAndExpense: state.reducer.incomeAndExpense.request,
    incomeAndExpenseAdd: state.reducer.incomeAndExpense.add,
    incomeAndExpenseArchive: state.reducer.incomeAndExpense.archive,
    incomeAndExpenseUpdate: state.reducer.incomeAndExpense.update
  };
}

export default connect(mapStateToProps)(IncomeAndExpense);