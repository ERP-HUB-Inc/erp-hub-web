import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/StoreLanguage/FormCreate";
import FormUpdate from "../../../containers/settings/StoreLanguage/FormUpdate";
import StoreLanguageAction from "../../../action/settings/storeLanguage";
import Constant from "../../../constants/settings/storeLanguage";

export default class StoreLanguageList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.title = "Language";
    this.fetchingProp = "storeLanguage";
    this.addingProp = "storeLanguageAdd"; //for change form add 
    this.updatingProp = "storeLanguageUpdate";
    this.RESET_CONSTANT = Constant.RESET_STORE_LANGUAGE;
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

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(StoreLanguageAction.showForm());
    this.setState({
      modalConten: <FormCreate />
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(StoreLanguageAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
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