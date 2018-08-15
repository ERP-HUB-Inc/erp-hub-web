import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/settings/Currency/FormCreate";
import FormUpdate from "../../../containers/settings/Currency/FormUpdate";
import Constant from "../../../constants/settings/currency";
import CurrencyAction from "../../../action/settings/currency";
import CurrencyService from "../../../services/settings/CurrencyService";

export default class CurrencyList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.title = "Currency";
    this.fetchingProp = "currency";
    this.addingProp = "currencyAdd";
    this.updatingProp = "currencyUpdate";
    this.columnFilterWithKey = ["name"];
    this.service = CurrencyService;
    this.action = CurrencyAction;
    this.RESET_CONSTANT = Constant.RESET_CURRENCY;
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

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      this.columnNo,
      {
        title: <this.Translate id="col_currency_name" />,
        dataIndex: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_currency_symbol" />,
        dataIndex: "symbol",
        sorter: true
      },
      {
        title: <this.Translate id="col_currency_value" />,
        dataIndex: "value",
        sorter: true
      },
      this.columnUpdatedAt,
      this.columnStatus
    ];
  }
}