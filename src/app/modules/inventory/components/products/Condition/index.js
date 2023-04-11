import React from "react";
import FormCreate from "../../../containers/products/Condition/FormCreate";
import FormUpdate from "../../../containers/products/Condition/FormUpdate";
import Constant from "../../../constants/products/condition";
import ConditionAction from "../../../actions/products/condition";
import ConditionService from "../../../services/products/ConditionService";
import DataTable from "../../../../common/components/shares/List/DataTable";

export default class Lists extends DataTable {
  constructor(props) {
    super(props);
    this.module = "products";
    this.columns = [
      {
        title: <this.Translate id="text_condition" />,
        dataIndex: "name",
        key: "name"
      }
    ];
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.service = ConditionService;
    this.action = ConditionAction;
    this.columnFilterWithKey = ["name"];
    this.RESET_CONSTANT = Constant.RESET_BRAND;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added || nextProps.update.updated) {
      this.props.dispatch(ConditionAction.reset());
      this.props.dispatch(ConditionAction.reset(Constant.RESET_CONDITION));
      this.fetchData();
    }
  }
}
