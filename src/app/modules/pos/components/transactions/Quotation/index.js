import React from "react";
import history from "../../../../../modules/common/router/history";
import List from "../List";
import FormCreate from "../../../containers/transactions/Quotation/FormCreate";
import FormUpdate from "../../../containers/transactions/Quotation/FormUpdate";
import Constant from "../../../constants/transactions/quotation";
import QuotationAction from "../../../action/transaction/quotation";
import QuotationService from "../../../services/transactions/QuotationService";

export default class QuotationList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.generalSearchLabel = "text_name";
    this.placeHolderForGeneralSearch = "text_name";
    this.columnFilterWithKey = ["name"];
    this.service = QuotationService;
    this.action = QuotationAction;
    this.RESET_CONSTANT = Constant.RESET_QUOTATION;
  }

  handleShowFormAdd() {
    history.push("/transactions/quotation-create");
  }

}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        sorter: true
      },
      {
        title: <this.Translate id="text_terms" />,
        dataIndex: "term",
        sorter: true
      },
      {
        title: <this.Translate id="text_deposit" />,
        dataIndex: "deposit",
        sorter: true
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "total",
        sorter: true
      },
      this.columnStatus
    ];
  }
}