import React from "react";
import List from "../List";
import FormCreate from "../../../containers/stock/Supplier/FormCreate";
import FormUpdate from "../../../containers/stock/Supplier/FormUpdate";
import Constant from "../../../constants/stock/supplier";
import SupplierAction from "../../../actions/stock/supplier";
import SupplierService from "../../../services/stock/SupplierService";

export default class SupplierList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.service = SupplierService;
    this.placeHolderForGeneralSearch = "general_search";
    this.columnFilterWithKey = ["name", "phoneNumber", "email", "description"];
    this.action = SupplierAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
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
        sorter: true
      },
      {
        title: <this.Translate id="text_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="text_email" />,
        dataIndex: "email",
        key: "email",
        sorter: true
      },
      this.columnStatus
    ];
  }
}