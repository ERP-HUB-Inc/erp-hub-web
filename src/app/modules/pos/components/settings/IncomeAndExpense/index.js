import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/IncomeAndExpense/FormCreate";
import FormUpdate from "../../../containers/settings/IncomeAndExpense/FormUpdate";
import Constant from "../../../constants/settings/incomeAndExpense";
import IncomeEXpenseAction from "../../../action/settings/incomeAndExpense";
import IncomeEXpenseService from "../../../services/settings/IncomeExpense";

export default class IncomeAndExpenseList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "incomeAndExpense";
    this.addingProp = "incomeAndExpenseAdd";
    this.updatingProp = "incomeAndExpenseUpdate";
    this.service = IncomeEXpenseService;
    this.action = IncomeEXpenseAction;
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;

  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(IncomeEXpenseAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(IncomeEXpenseAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  render() {
    return super.render();
  }
}
