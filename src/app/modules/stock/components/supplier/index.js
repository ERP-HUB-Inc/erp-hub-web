import React from "react";
import List from "../List";
import FormCreate from "../../containers/supplier/FormCreate";
import FormUpdate from "../../containers/supplier/FormUpdate";
import Constant from "../../constants/supplier";
import BrandAction from "../../actions/supplier";
import ProductsUnitService from "../../services/supplier";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "supplier";
    this.addingProp = "supplierAdd";
    this.updatingProp = "supplierUpdate";
    this.service = ProductsUnitService;
    this.columnFilterWithKey = ["name"];
    this.action = BrandAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(BrandAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(BrandAction.showForm(rowData));
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