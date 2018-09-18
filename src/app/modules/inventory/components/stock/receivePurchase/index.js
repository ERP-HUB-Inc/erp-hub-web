import React from "react";
import List from "../List";
import Enum from "../../../enums";
import FormUpdate from "../../../containers/stock/receivePurchase/FormUpdate";
import Constant from "../../../constants/stock/receivePurchase";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";
import ReceivePurchaseService from "../../../services/stock/ReceivePurchaseService";
import "./index.css";

export default class ReceivePurchaseList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.ExportheadersCsv = [{label: "Date", key: "createdAt"},
      {label: "Name", key: "name"},
      {label: "Invoice No", key: "invoiceNo"},
      {label: "Due Date", key: "deliveryDueDate"},
      {label: "Shipping", key: "shippingFee"},
      {label: "Total", key: "requestTotal"},
      {label: "Status", key: "status"}
    ];
    this.fetchingProp = "receivePurchase";
    this.addingProp = "receivePurchaseAdd";
    this.updatingProp = "receivePurchaseUpdate";
    this.service = ReceivePurchaseService;
    this.columnFilterWithKey = ["name"];
    this.action = ReceivePurchaseAction;
    this.showExport = true;
    this.RESET_CONSTANT = Constant.RESET_RECEIVE_PURCHASE;
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const filter = JSON.stringify({step: [Enum.PO_STEP.PROCESS]});
    dispatch(ReceivePurchaseAction.fetch(this.pageSize, 0, "", "", filter));
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(ReceivePurchaseAction.detail(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  renderActionButton(){
    return(
      this.renderButtonExportCSV()    
    );
  }


}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_stock_receive_purchase_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_invoice_no" />,
        dataIndex: "invoiceNo",
        key: "invoiceNo",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_due_date" />,
        dataIndex: "deliveryDueDate",
        key: "deliveryDueDate",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_shipping_fee" />,
        dataIndex: "shippingFee",
        key: "shippingFee",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_total" />,
        dataIndex: "requestTotal",
        key: "requestTotal",
        sorter: true, 
        render: (requestTotal) => this.formatCurrency(requestTotal) 
      },
      this.columnStatus
    ];
  }
  
}