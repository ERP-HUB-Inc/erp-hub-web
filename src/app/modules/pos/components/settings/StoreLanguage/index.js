import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/settings/StoreLanguage/FormCreate";
import FormUpdate from "../../../containers/settings/StoreLanguage/FormUpdate";
import StoreLanguageAction from "../../../action/settings/storeLanguage";
import StoreLanguageService from "../../../services/settings/StoreLanguage";
import Constant from "../../../constants/settings/storeLanguage";

export default class StoreLanguageList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.title = "Language";
    this.fetchingProp = "storeLanguage";
    this.addingProp = "storeLanguageAdd"; //for change form add 
    this.updatingProp = "storeLanguageUpdate";
    this.service = StoreLanguageService;
    this.action = StoreLanguageAction;
    this.RESET_CONSTANT = Constant.RESET_STORE_LANGUAGE;
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
        title: <this.Translate id="col_language_name" />,
        dataIndex: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_language_code" />,
        dataIndex: "code",
        sorter: true
      },
      this.columnUpdatedAt,
      this.columnStatus
    ];
  }
}