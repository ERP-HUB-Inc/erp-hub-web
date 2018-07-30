import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/IncomeAndExpense/FormCreate";
import FormUpdate from "../../../containers/settings/IncomeAndExpense/FormUpdate";
import Constant from "../../../constants/settings/incomeAndExpense";
import IncomeEXpenseAction from "../../../action/settings/incomeAndExpense";
// import "./index.css";

export default class IncomeAndExpenseList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "incomeAndExpense";
    this.addingProp = "incomeAndExpenseAdd";
    this.updatingProp = "incomeAndExpenseUpdate";
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    
    dispatch(IncomeEXpenseAction.fetch(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;

    super.onChange(pagination, filters, sorter);
    
    dispatch(IncomeEXpenseAction.fetch(...this.filter));
  }

  onChangePagination(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      (current - 1) * pageSize,
    ];

    dispatch(IncomeEXpenseAction.fetch(...this.filter));

    this.setState({ current});
  }

  onShowSizeChange(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      current,
    ];

    dispatch(IncomeEXpenseAction.fetch(...this.filter));
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

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(IncomeEXpenseAction.archive(this.state.selectedListIds));

    dispatch(IncomeEXpenseAction.fetch(this.pageSize, this.state.current));
    
    this.setState({selectedRowKeys: []});

    super.handleDelete();

    this.Message.info(this.messageSuccess);
  }

  render() {
    return super.render();
  }
}
