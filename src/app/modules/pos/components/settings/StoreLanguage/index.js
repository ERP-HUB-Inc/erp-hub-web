import React from "react";
import columns from "./column";
import List from "../../List";
import StoreLanguageAction from "../../../action/settings/storeLanguage";

export default class StoreLanguageList extends List {
  constructor(props) {
    super(props);
    this.state = {
      modaltitle: "Language",
      columns
    };

    this.title = "Language";
    this.reducerProp = "storeLanguage";
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(StoreLanguageAction.fetch(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;
    super.onChange(pagination, filters, sorter);
    dispatch(StoreLanguageAction.fetch(...this.filter));
  }

  handleAdd() {
    super.handleAdd();
  }

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(StoreLanguageAction.archive(this.state.selectedListIds));

    this.Message.info(this.messageSuccess);

    dispatch(StoreLanguageAction.fetch(this.pageSize, this.state.current));

    this.setState({selectedRowKeys: []});
  }

  render() {
    return super.render();
  }
}