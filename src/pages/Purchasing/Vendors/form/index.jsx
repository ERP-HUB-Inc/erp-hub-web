import React from "react";
import VendorService from "@services/VendorService";
import Datatable from "@layout/Datatable";
import Constant from "../redux/constant";
import VendorAction from "../redux/action";
import FormCreatePage from "../form.create";
import FormUpdatePage from "../form.update";

export default class SupplierList extends Datatable {
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
      }
    ].concat(this.renderActionColumn());
    this.title = "Vendors";
    this.placeholder = "Search vendors...";
    this.formCreate = <FormCreatePage />;
    this.formUpdate = <FormUpdatePage />;
    this.service = VendorService;
    this.action = VendorAction;
    this.placeHolderForGeneralSearch = "general_search";
    this.columnFilterWithKey = ["name", "phoneNumber", "email", "description"];
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
  }
}