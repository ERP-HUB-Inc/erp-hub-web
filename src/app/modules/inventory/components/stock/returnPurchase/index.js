import React from "react";
import List from "../List";
import FormCreate from "../../../containers/stock/returnPurchase/FormCreate";
import FormUpdate from "../../../containers/stock/returnPurchase/FormUpdate";
import Constant from "../../../constants/stock/returnPurchase";
import ReturnPurchaseAction from "../../../actions/stock/returnPurchase";
import ReturnPurchaseService from "../../../services/stock/ReturnPurchaseService";
import "./index.css";

export default class SupplierList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "returnPurchase";
    this.addingProp = "returnPurchaseAdd";
    this.updatingProp = "returnPurchaseUpdate";
    this.service = ReturnPurchaseService;
    this.columnFilterWithKey = ["name"];
    this.action = ReturnPurchaseAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(ReturnPurchaseAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(ReturnPurchaseAction.showForm(rowData));
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
        title: <this.Translate id="col_stock_return_purchase_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_return_purchase_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_return_purchase_phonenumber" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_return_purchase_email" />,
        dataIndex: "email",
        key: "phoneNumber",
        sorter: true
      },
      this.columnStatus
    ];
  }
}