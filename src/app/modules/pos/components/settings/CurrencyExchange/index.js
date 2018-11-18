import React from "react";
import List from "../List";
import FormCreate from "../../../containers/settings/CurrencyExchange/FormCreate";
import FormUpdate from "../../../containers/settings/CurrencyExchange/FormUpdate";
import Constant from "../../../constants/settings/currencyExchange";
import CurrencyExchangeAction from "../../../action/settings/currencyExchange";
import CurrencyExchangeService from "../../../services/settings/CurrencyExchangeService";

export default class CurrencyExchangeList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["name","value"];
    this.service = CurrencyExchangeService;
    this.action = CurrencyExchangeAction;
    this.RESET_CONSTANT = Constant.RESET_CURRENCY_EXCHANGE;
  }

  renderFilterStatus() {
    return(<div></div>);
  }

}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_currency_value" />,
        dataIndex: "value",
        sorter: true
      },
    ];
  }
}