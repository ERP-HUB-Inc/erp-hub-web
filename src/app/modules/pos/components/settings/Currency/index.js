import React from "react";
import columns from "./column";
import FormAdd from "./FormAdd";
import List from "../../List";
import CurrencyAction from "../../../action/settings/currency";

export default class CurrencyList extends List {
  constructor(props) {
    super(props);
    this.state = {
      modaltitle: "Currency",
      columns
    };

    this.title = "Currency";
    this.reducerProp = "currency";
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

  handleAdd() {
    super.handleAdd();
    this.setState({
      modalConten: <FormAdd/>
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