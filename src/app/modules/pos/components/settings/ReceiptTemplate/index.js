import React from "react";
import List from "../List";
import FormCreate from "../../../containers/settings/ReceiptTemplate/FormCreate";
import FormUpdate from "../../../containers/settings/ReceiptTemplate/FormUpdate";
import Constant from "../../../constants/settings/receiptTemplate";
import ReceiptTemplateAction from "../../../action/settings/receiptTemplate";
import ReceiptService from "../../../services/settings/ReceiptTemplateService";

export default class ReceiptTemplateList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "receipt";
    this.columnFilterWithKey = ["name"];
    this.service = ReceiptService;
    this.action = ReceiptTemplateAction;
    this.RESET_CONSTANT = Constant.RESET_RECEIPT;
  }

  componentWillUpdate(nextProps) {
    const {receiptAdd, receiptUpdate} = nextProps;
    if (receiptAdd.added || receiptUpdate.updated) {
      this.props.dispatch(ReceiptTemplateAction.fetch(this.pageSize));
      this.props.dispatch(ReceiptTemplateAction.reset());
    }
  }

  handleShowFormAdd() {
    this.props.dispatch(ReceiptTemplateAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    this.props.dispatch(ReceiptTemplateAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      this.columnNo,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        render: (text, record, index) => {
          return <div>
            <span>{record.name}</span>{ record.isDefault === this.Enum.IS_DEFAULT  ? <this.TagLabel color="blue" style={{marginLeft: 10}}><this.Translate id="text_is_default" /></this.TagLabel> : "" }
          </div>;
        },
        sorter: true,
      },
      this.columnUpdatedAt,
      this.columnStatus
    ];
  }
}