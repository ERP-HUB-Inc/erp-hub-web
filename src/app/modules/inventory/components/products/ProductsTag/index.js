import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/products/ProductsTag/FormCreate";
import FormUpdate from "../../../containers/products/ProductsTag/FormUpdate";
import Constant from "../../../constants/products/productsTag";
import ProductsTagAction from "../../../actions/products/productsTag";
import ProductsTagService from "../../../services/products/ProductsTagService";

export default class ProductsTagList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["tag"];
    this.service = ProductsTagService;
    this.action = ProductsTagAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCTS_TAG;
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "tag",
        key: "tag",
        sorter: true
      },
      this.columnStatus
    ];
  }
}