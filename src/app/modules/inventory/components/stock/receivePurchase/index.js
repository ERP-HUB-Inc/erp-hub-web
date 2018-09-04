import React from "react";
import List from "../List";
import FormCreate from "../../../containers/stock/receivePurchase/FormCreate";
import FormUpdate from "../../../containers/stock/receivePurchase/FormUpdate";
import Constant from "../../../constants/stock/receivePurchase";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";
import ReceivePurchaseService from "../../../services/stock/ReceivePurchaseService";
import "./index.css";

export default class ReceivePurchaseList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "receivePurchase";
    this.addingProp = "receivePurchaseAdd";
    this.updatingProp = "receivePurchaseUpdate";
    this.service = ReceivePurchaseService;
    this.columnFilterWithKey = ["name"];
    this.action = ReceivePurchaseAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(ReceivePurchaseAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(ReceivePurchaseAction.showForm(rowData));
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
        title: <this.Translate id="col_stock_receive_purchase_name" />,
        dataIndex: "brand",
        key: "brand",
        sorter: true,
        render: (brand) => brand.name 
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_phonenumber" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_email" />,
        dataIndex: "email",
        key: "email",
        sorter: true
      },
      this.columnStatus
    ];
  }
}