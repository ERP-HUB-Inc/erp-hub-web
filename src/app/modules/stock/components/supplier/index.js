import React from "react";
import List from "../List";
import FormCreate from "../../containers/supplier/FormCreate";
import FormUpdate from "../../containers/supplier/FormUpdate";
import Constant from "../../constants/supplier";
import SupplierAction from "../../actions/supplier";
import SupplierService from "../../services/supplier";
import "./index.css";

export default class SupplierList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "supplier";
    this.addingProp = "supplierAdd";
    this.updatingProp = "supplierUpdate";
    this.service = SupplierService;
    this.columnFilterWithKey = ["name"];
    this.action = SupplierAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(SupplierAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(SupplierAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_stock_supplier_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_supplier_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_supplier_phonenumber" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_supplier_email" />,
        dataIndex: "email",
        key: "phoneNumber",
        sorter: true
      },
      this.columnStatus
    ];
  }
}