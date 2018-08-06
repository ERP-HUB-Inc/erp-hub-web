import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/IncomeAndExpense/FormCreate";
import FormUpdate from "../../../containers/settings/IncomeAndExpense/FormUpdate";
import Constant from "../../../constants/settings/incomeAndExpense";
import IncomeExpenseAction from "../../../action/settings/incomeAndExpense";
import IncomeExpenseService from "../../../services/settings/IncomeExpense";
// import "./index.css";

export default class IncomeAndExpenseList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "incomeAndExpense";
    this.addingProp = "incomeAndExpenseAdd";
    this.updatingProp = "incomeAndExpenseUpdate";
    this.service = IncomeExpenseService;
    this.action = IncomeExpenseAction;
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(IncomeExpenseAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(IncomeExpenseAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  render() {
    return super.render();
  }
}
