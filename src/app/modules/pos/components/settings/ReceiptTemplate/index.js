import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/ReceiptTemplate/FormCreate";
import FormUpdate from "../../../containers/settings/ReceiptTemplate/FormUpdate";
import Constant from "../../../constants/settings/receiptTemplate";
import ReceiptTemplateAction from "../../../action/settings/receiptTemplate";
import ReceiptService from "../../../services/settings/ReceiptService";

export default class ReceiptTemplateList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "receipt";
    this.addingProp = "receiptAdd";
    this.updatingProp = "receiptUpdate";
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