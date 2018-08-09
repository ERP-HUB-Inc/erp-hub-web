import React from "react";
// import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/Tax/FormCreate";
import FormUpdate from "../../../containers/settings/Tax/FormUpdate";
import TaxAction from "../../../action/settings/tax";
import TaxService from "../../../services/settings/TaxService";
import Constant from "../../../constants/settings/tax";

export default class TaxList extends List { 
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "tax";
    this.addingProp = "taxAdd";
    this.updatingProp = "taxUpdate";
    this.service = TaxService;
    this.action = TaxAction;
    this.RESET_CONSTANT = Constant.RESET_TAX;
  }
  
  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(TaxAction.showForm());
    this.setState({
      modalConten: <FormCreate />
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(TaxAction.showForm(rowData));
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
        title: <this.Translate id="col_tax_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: <this.Translate id="col_tax_label_on_invoice" />,
        dataIndex: "labelOnInvoice",
        key: "labelOnInvoice",
        sorter: true
      },
      { 
        title: <this.Translate id="col_tax_rate" />,
        dataIndex: "rate",
        sorter: true,
        render: (rate) => rate + "%"
      },
      this.columnStatus
    ];
  }
}