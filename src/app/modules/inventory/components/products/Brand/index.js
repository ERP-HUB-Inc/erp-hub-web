import React from "react";
import List from "../../List";
import Enum from "../../../enums";
import FormCreate from "../../../containers/products/Brand/FormCreate";
import FormUpdate from "../../../containers/products/Brand/FormUpdate";
import Constant from "../../../constants/products/brand";
import BrandAction from "../../../actions/products/brand";
import BrandService from "../../../services/products/BrandService";

export default class Lists extends List {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="text_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      this.columnStatus
    ];
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.service = BrandService;
    this.localStorageKey = Enum.LOCAL_SCHEMA.BRAND;
    this.columnFilterWithKey = ["name"];
    this.action = BrandAction;
    this.RESET_CONSTANT = Constant.RESET_BRAND;
  }
}
