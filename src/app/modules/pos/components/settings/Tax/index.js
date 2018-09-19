import React from "react";
import List from "../List";
import FormCreate from "../../../containers/settings/Tax/FormCreate";
import FormUpdate from "../../../containers/settings/Tax/FormUpdate";
import Constant from "../../../constants/settings/tax";
import TaxAction from "../../../action/settings/tax";
import TaxService from "../../../services/settings/TaxService";

export default class TaxList extends List { 
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "tax";
    this.addingProp = "taxAdd";
    this.updatingProp = "taxUpdate";
    this.columnFilterWithKey = ["name"];
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
        render: (text, record, index) => {
          return <div>
            <span>{record.name}</span>{ record.id === this.getCurrentUser().setting.defaultTaxId  ? <this.TagLabel color="blue" style={{marginLeft: 10}}><this.Translate id="text_is_default" /></this.TagLabel> : "" }
          </div>;
        },
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
      this.columnUpdatedAt,
      this.columnStatus
    ];
  }
}