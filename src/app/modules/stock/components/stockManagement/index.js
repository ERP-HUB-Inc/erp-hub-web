import React from "react";
import List from "../List";
import FormCreate from "../../containers/stockManagement/FormCreate";
import FormUpdate from "../../containers/stockManagement/FormUpdate";
import Constant from "../../constants/stockManagement";
import StockManagementAction from "../../actions/stockManagement";
import StockManagementService from "../../services/stockManagement";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "stockManagement";
    this.addingProp = "stockManagementAdd";
    this.updatingProp = "stockManagementUpdate";
    this.service = StockManagementService;
    this.columnFilterWithKey = ["name"];
    this.action = StockManagementAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(StockManagementAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(StockManagementAction.showForm(rowData));
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
        title: <this.Translate id="col_stock_management_id" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_sold_by" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_customer" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_deposit" />,
        dataIndex: "email",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_payment_method" />,
        dataIndex: "email",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_notation" />,
        dataIndex: "email",
        key: "phoneNumber",
        sorter: true
      },
      this.columnStatus
    ];
  }
}