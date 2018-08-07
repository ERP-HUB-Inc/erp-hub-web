import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/Currency/FormCreate";
import FormUpdate from "../../../containers/settings/Currency/FormUpdate";
import Constant from "../../../constants/settings/currency";
import CurrencyAction from "../../../action/settings/currency";
import CurrencyService from "../../../services/settings/CurrencyService";

export default class CurrencyList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.title = "Currency";
    this.fetchingProp = "currency";
    this.addingProp = "currencyAdd";
    this.updatingProp = "currencyUpdate";
    this.service = CurrencyService;
    this.action = CurrencyAction;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(CurrencyAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(CurrencyAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  render() {
    return super.render();
  }
}