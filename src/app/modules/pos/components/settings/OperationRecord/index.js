import React from "react";
import List from "../List";
import FormCreate from "../../../containers/settings/OperationRecord/FormCreate";
import FormUpdate from "../../../containers/settings/OperationRecord/FormUpdate";
import Constant from "../../../constants/settings/operationRecord";
import OperationRecordAction from "../../../action/settings/operationRecord";
import OperatinRecordService from "../../../services/settings/OperationRecordService";

export default class OperationRecord extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "operationRecord";
    this.addingProp = "operationRecordAdd";
    this.updatingProp = "operationRecordUpdate";
    this.columnFilterWithKey = ["name"];
    this.service = OperatinRecordService;
    this.action = OperationRecordAction;
    this.RESET_CONSTANT = Constant.RESET_OPERATION_RECORD;
  }
  

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(OperationRecordAction.showForm());
    this.setState({
      modalConten: <FormCreate />
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(OperationRecordAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  render() {
    return super.render();
  }
  
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_operation_record_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: <this.Translate id="col_operation_record_recordfor" />,
        dataIndex: "registerDate",
        key: "registerDate",
        sorter: true,
        render : registerDate => this.Util.formatDate(registerDate)
      },
      { 
        title: <this.Translate id="col_operation_record_type" />,
        dataIndex: "type",
        sorter: true,
        render : (type) => type === 0 ? <this.Translate id="operation_record_income" /> : <this.Translate id="operation_record_expense" />
      },
      {
        title: <this.Translate id="text_amount" />,
        dataIndex: "amount",
        sorter: true,
        render : (amount) => this.formatCurrency(amount)
      },
      this.columnStatus
    ];
  }
}