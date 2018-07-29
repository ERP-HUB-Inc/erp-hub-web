import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/ReceiptTemplate/FormCreate";
import FormUpdate from "../../../containers/settings/ReceiptTemplate/FormUpdate";
import Constant from "../../../constants/settings/receiptTemplate";
import ReceiptTemplateAction from "../../../action/settings/receiptTemplate";

export default class ReceiptTemplateList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "receipt";
    this.addingProp = "receiptAdd";
    this.updatingProp = "receiptUpdate";
    this.RESET_CONSTANT = Constant.RESET_RECEIPT;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    
    dispatch(ReceiptTemplateAction.fetch(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;

    super.onChange(pagination, filters, sorter);
    
    dispatch(ReceiptTemplateAction.fetch(...this.filter));
  }

  onChangePagination(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      (current - 1) * pageSize,
    ];

    dispatch(ReceiptTemplateAction.fetch(...this.filter));

    this.setState({ current});
  }

  onShowSizeChange(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      current,
    ];

    dispatch(ReceiptTemplateAction.fetch(...this.filter));
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

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(ReceiptTemplateAction.archive(this.state.selectedListIds));

    this.Message.info(this.messageSuccess);

    dispatch(ReceiptTemplateAction.fetch(this.pageSize, this.state.current));
    
    this.setState({selectedRowKeys: []});
  }

  render() {
    return super.render();
  }
}