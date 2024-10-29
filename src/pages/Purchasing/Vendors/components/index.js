import React from "react";
import FormCreatePage from "../FormCreate";
import FormUpdatePage from "../FormUpdate";
import Constant from "../redux/constant";
import SupplierAction from "../redux/action";
import SupplierService from "../../../../services/VendorService";
import Datatable from "../../../../layout/Datatable";

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
      },
      this.columnStatus
    ];
    this.formCreate = <FormCreatePage />;
    this.formUpdate = <FormUpdatePage />;
    this.service = SupplierService;
    this.placeHolderForGeneralSearch = "general_search";
    this.columnFilterWithKey = ["name", "phoneNumber", "email", "description"];
    this.action = SupplierAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
  }
}