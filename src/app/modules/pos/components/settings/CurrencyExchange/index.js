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
    this.generalSearchLabel = "text_search";
    this.placeHolderForGeneralSearch = "text_name";
    this.columnFilterWithKey = ["name","value"];
    this.service = CurrencyExchangeService;
    this.action = CurrencyExchangeAction;
    this.RESET_CONSTANT = Constant.RESET_CURRENCY_EXCHANGE;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added) {
      nextProps.dispatch(CurrencyExchangeAction.fetch(this.pageSize));
      this.props.dispatch(CurrencyExchangeAction.reset(Constant.RESET_CURRENCY_EXCHANGE));
    }
  }

  renderFilterStatus() {}

  renderButtonDelete(){}

  handleShowFormEdit(){}
}



class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        sorter: true,
        render: (text, record) => {
          let baseCurrencyName = "";
          let toCurrencyName = "";

          if (record.baseCurrency) {
            baseCurrencyName = record.baseCurrency.name;
          }

          if (record.currency) {
            toCurrencyName = record.currency.name ;
          }

          return <div><span><b>{baseCurrencyName}</b></span> To <span><b>{toCurrencyName}</b></span></div>;
        }
      },
      {
        title: <this.Translate id="text_value" />,
        dataIndex: "value",
        sorter: true,
        render: (text, record) => {
          let symbolBaseCurrency = "";
          let toCurrencySymbol = "";

          if (record.baseCurrency) {
            symbolBaseCurrency = record.baseCurrency.symbol;
          }

          if (record.currency) {
            toCurrencySymbol = record.currency.symbol;
          }

          return `${this.Util.formatCurrency(1, symbolBaseCurrency)} = ${this.Util.formatCurrency(record.value, toCurrencySymbol)}`;
        }
      },
    ];
  }
}