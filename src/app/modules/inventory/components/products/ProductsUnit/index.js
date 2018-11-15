import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/products/ProductsUnit/FormCreate";
import FormUpdate from "../../../containers/products/ProductsUnit/FormUpdate";
import Constant from "../../../constants/products/productsUnit";
import ProductsUnitAction from "../../../actions/products/productsUnit";
import ProductsUnitService from "../../../services/products/ProductsUnitService";

export default class Lists extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["name"];
    this.service = ProductsUnitService;
    this.action = ProductsUnitAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCTS_UNIT;
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
        key: "name",
        render: (text, record, index) => {
          return <div>
            <span>{record.name}</span>{ record.isDefault === this.Enum.IS_DEFAULT  ? <this.TagLabel color="blue" style={{marginLeft: 10}}><this.Translate id="text_is_default" /></this.TagLabel> : "" }
          </div>;
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_number_in_unit" />,
        dataIndex: "multiple",
        key: "multiple",
        sorter: true
      },
      this.columnStatus
    ];
  }
}