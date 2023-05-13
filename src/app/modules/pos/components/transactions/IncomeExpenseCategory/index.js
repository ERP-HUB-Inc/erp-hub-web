import React from "react";
import FormCreate from "../../../containers/transactions/IncomeExpenseCategory/FormCreate";
import FormUpdate from "../../../containers/transactions/IncomeExpenseCategory/FormUpdate";
import Constant from "../../../constants/transactions/incomeExpenseCategory";
import Action from "../../../action/transaction/incomeExpenseCategory";
import Service from "../../../services/transactions/IncomeExpenseCategoryService";
import DataTable from "../../../../common/components/shares/List/DataTable";

export default class Lists extends DataTable {
  constructor(props) {
    super(props);
    this.module = "transactions";
    this.columns = [
      {
        title: <this.Translate id="text_category" />,
        dataIndex: "name",
        key: "name"
      }
    ];
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.service = Service;
    this.action = Action;
    this.columnFilterWithKey = ["name"];
    this.RESET_CONSTANT = Constant.RESET_INCOME_EXPENSE_CATEGORY;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added || nextProps.update.updated) {
      this.props.dispatch(Action.reset());
      this.props.dispatch(Action.reset(Constant.RESET_CONDITION));
      this.fetchData();
    }
  }
}
