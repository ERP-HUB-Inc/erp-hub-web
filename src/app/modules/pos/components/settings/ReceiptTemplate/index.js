import React from "react";
import List from "../List";
import FormCreate from "../../../containers/settings/ReceiptTemplate/FormCreate";
import FormUpdate from "../../../containers/settings/ReceiptTemplate/FormUpdate";
import Constant from "../../../constants/settings/receiptTemplate";
import ReceiptTemplateAction from "../../../action/settings/receiptTemplate";
import ReceiptService from "../../../services/settings/ReceiptService";

export default class ReceiptTemplateList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "receipt";
    this.addingProp = "receiptAdd";
    this.updatingProp = "receiptUpdate";
    this.columnFilterWithKey = ["name"];
    this.service = ReceiptService;
    this.action = ReceiptTemplateAction;
    this.RESET_CONSTANT = Constant.RESET_RECEIPT;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(ReceiptTemplateAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(ReceiptTemplateAction.showForm(rowData));
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
      this.columnNo,
      {
        title: <this.Translate id="col_receipt_template_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      this.columnUpdatedAt,
      this.columnStatus
    ];
  }
}