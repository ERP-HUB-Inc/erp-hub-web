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
      {label: "Total", key: "receiveTotal"}
    ];
    this.exportCsvFileName = "receive_purchase.csv";  
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

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {dispatch} = this.props;
          let filter = {};
          let rangFilter = {};

          if (values.step !== -1) {
            filter["step"] = [Enum.PO_STEP.PROCESS];
          }
      
          if (values.deliveryDueDate) {
            values.deliveryDueDate = this.Util.formatDate(values.deliveryDueDate, "YYYY-MM-DD");
            rangFilter = JSON.stringify({column: "deliveryDueDate", value: [values.deliveryDueDate, values.deliveryDueDate]});
          }
    
          filter = JSON.stringify(filter);

          console.log("due date",values.deliveryDueDate);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, rangFilter));
          this.setState({isClickFilter: true});
        }
      
      }); 
    } 
  }

  renderFilterRecord() {
    const {form, locale } = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    return(
      <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
        <this.Row className="main-search-layout form-group">
          <this.Col md="2">
            <this.InputText
              name="key"
              label={<this.Translate id="input_stock_purchase_key" />}
              placeholder={this.CATranslate("stock_receive_purchase_search_key_place_holder", locale)}
              form={form}
            />
          </this.Col>
          <this.Col md="2">
            <this.DatePickers
              name="deliveryDueDate"
              label={<this.Translate id="datepicker_stock_purchase_due_date" />}
              form={form}
            />
          </this.Col>
          <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
            <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
          </this.Button>
        </this.Row>
      </this.Form>);

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
        width: 233,
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_invoice_no" />,
        dataIndex: "invoiceNo",
        width: 336,
        key: "invoiceNo",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_due_date" />,
        dataIndex: "deliveryDueDate",
        key: "deliveryDueDate",
        width: 305,
        sorter: true,
        render: (text, record, index) => {
          return(this.formatDate(record.deliveryDueDate));
        }
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_shipping_fee" />,
        dataIndex: "shippingFee",
        width: 358,
        key: "shippingFee",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_receive_purchase_total" />,
        dataIndex: "receiveTotal",
        key: "receiveTotal",
        sorter: true, 
        render: (receiveTotal) => this.formatCurrency(receiveTotal) 
      }
    ];
  }
  
}