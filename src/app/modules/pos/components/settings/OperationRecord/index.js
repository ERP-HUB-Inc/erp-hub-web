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
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["name"];
    this.service = OperatinRecordService;
    this.action = OperationRecordAction;
    this.RESET_CONSTANT = Constant.RESET_OPERATION_RECORD;
  }
  renderFilterStatus() {
    
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    this.colorOperationType = ["#4cb64c", "#c72727"];

    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: <this.Translate id="col_operation_record_recordfor" />,
        dataIndex: "registerDate",
        key: "registerDate",
        width: 160,
        sorter: true,
        render : registerDate => this.Util.formatDate(registerDate)
      },
      { 
        title: <this.Translate id="col_operation_record_type" />,
        dataIndex: "type",
        width: 100,
        sorter: true,
        render : type => type === this.Enum.OPERATION_TYPE.INCOME ? <this.Translate id="operation_record_income" /> : <this.Translate id="operation_record_expense" />
      },
      {
        title: <this.Translate id="text_amount" />,
        dataIndex: "amount",
        width: 150,
        align: "right",
        sorter: true,
        render: (text, record) => {
          let colorIndex = 0;
          if (record.type === this.Enum.OPERATION_TYPE.EXPENSE) {
            colorIndex = 1;
          }
          return <this.Tag color={this.colorOperationType[colorIndex]} style={{marginRight: 0}} className="text-center label-stock-status">{this.Util.formatCurrency(record.amount, "")}</this.Tag>;
        }
      }
    ];
  }
}