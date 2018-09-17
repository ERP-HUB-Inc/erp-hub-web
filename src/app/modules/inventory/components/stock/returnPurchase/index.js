import React from "react";
import List from "../List";
import Enum from "../../../enums";
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
    this.RESET_CONSTANT = Constant.RESET_RETURN_PURCHASE;
  }


  componentDidMount() {
    const {dispatch} = this.props;
    const filter = JSON.stringify({step: [Enum.PO_STEP.RECEIVED]});
    dispatch(ReturnPurchaseAction.fetch(this.pageSize, 0, "", "", filter));
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(ReturnPurchaseAction.detail(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  renderActionButton(){
    return(
      <div></div>
    );
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
        title: <this.Translate id="col_stock_return_invoice_no" />,
        dataIndex: "invoiceNo",
        key: "invoiceNo",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_return_due_date" />,
        dataIndex: "deliveryDueDate",
        key: "deliveryDueDate",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_return_shipping_fee" />,
        dataIndex: "shippingFee",
        key: "shippingFee",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_return_total" />,
        dataIndex: "returnTotal",
        key: "returnTotal",
        sorter: true,
        render: (returnTotal) => this.formatCurrency(returnTotal) 
      },
      this.columnStatus
    ];
  }
}