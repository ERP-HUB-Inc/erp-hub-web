import React from "react";
import Datatable from "@layout/Datatable";
import Enum from "@enums/index";
import FormCreate from "../FormCreate";
import FormUpdate from "../FormUpdate";
import Constant from "../redux/constant";
import TaxAction from "../redux/action";
import TaxService from "@services/TaxService";

export default class TaxPage extends Datatable { 
  constructor(props) {
    super(props);
    this.columns = [
      this.columnNo,
      {
        title: <this.Translate id="text_name" />,
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
        render: rate => rate + "%"
      },
      this.columnStatus
    ];
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["name"];
    this.service = TaxService;
    this.action = TaxAction;
    this.RESET_CONSTANT = Constant.RESET_TAX;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added && nextProps.add.response) {
      if(nextProps.add.response.data){
        const newAddedTax = nextProps.add.response.data;
        let existingTaxes = localStorage.getItem(Enum.LOCAL_SCHEMA.TAX);
        existingTaxes = JSON.parse(existingTaxes);
        existingTaxes.push(newAddedTax);
        localStorage.setItem(Enum.LOCAL_SCHEMA.TAX, JSON.stringify(existingTaxes));
      }
     
    }
  }
}