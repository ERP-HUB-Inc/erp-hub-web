import React from "react";
import List from "../List";
import FormCreate from "../../../containers/settings/Currency/FormCreate";
import FormUpdate from "../../../containers/settings/Currency/FormUpdate";
import Constant from "../../../constants/settings/currency";
import CurrencyAction from "../../../action/settings/currency";
import CurrencyService from "../../../services/settings/CurrencyService";

export default class CurrencyList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["name"];
    this.service = CurrencyService;
    this.action = CurrencyAction;
    this.RESET_CONSTANT = Constant.RESET_CURRENCY;
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
        sorter: true,
        render: (text, record) => {
          return <div>
            <span>{record.name}</span>{ record.isDefault === this.Enum.IS_DEFAULT  ? <this.TagLabel color="blue" style={{marginLeft: 10}}><this.Translate id="text_is_default" /></this.TagLabel> : "" }
          </div>;
        },
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
      this.columnStatus
    ];
  }
}