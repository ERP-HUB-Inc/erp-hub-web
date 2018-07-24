import React from "react";
import columns from "./column";
import List from "../../List";
import CurrencyAction from "../../../action/settings/currency";

export default class CurrencyList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.title = "Currency";
    this.fetchingProp = "currency";
    this.addingProp = "currencyAdd";
    this.updatingProp = "currencyUpdate";
  }

  componentDidMount() {
    const { dispatch } = this.props;
    
    dispatch(CurrencyAction.fetch(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;

    super.onChange(pagination, filters, sorter);

    dispatch(CurrencyAction.fetch(...this.filter));
  }

  onChangePagination(pageNumber, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      (pageNumber - 1) * pageSize,
    ];

    dispatch(CurrencyAction.fetch(...this.filter));

    this.setState({ current: pageNumber});
  }

  onShowSizeChange(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      current,
    ];

    dispatch(CurrencyAction.fetch(...this.filter));
  }

  handleAdd() {
    super.handleAdd();
    this.setState({
      modalConten: <div></div>
    });
  }

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(CurrencyAction.archive(this.state.selectedListIds));

    this.Message.info(this.messageSuccess);

    dispatch(CurrencyAction.fetch(this.pageSize, this.state.current));

    this.setState({selectedRowKeys: []});
  }

  render() {
    return super.render();
  }
}