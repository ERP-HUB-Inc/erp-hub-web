import React from "react";
import List from "../List";
import FormCreate from "../../../containers/stock/stockTransfer/FormCreate";
import FormUpdate from "../../../containers/stock/stockTransfer/FormUpdate";
import Constant from "../../../constants/stock/stockTransfer";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import StockTransferService from "../../../services/stock/StockTransferService";
import "./index.css";

export default class Lists extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "stockTransfer";
    this.addingProp = "stockTransferAdd";
    this.updatingProp = "stockTransferUpdate";
    this.service = StockTransferService;
    this.columnFilterWithKey = ["name"];
    this.action = StockTransferAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
    this.hideActionButton = true;
    this.data = [
      {firstname: "Ahmed", lastname: "Tomi" , email: "ah@smthing.co.com"},
      {firstname:"Raed", lastname:"Labes" , email:"rl@smthing.co.com"} ,
      {firstname:"Yezzi", lastname:"Min l3b", email:"ymin@cocococo.com"}
    ];
    this.headers = [
      {label: "First Name", key: "firstname"},
      {label: "Last Name", key: "lastname"},
      {label: "Email", key: "email"},
    ];
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(StockTransferAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(StockTransferAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  renderActionButton() {
    return (
      <div>
        <div className="export-csv-button">
          <this.CSVLink data={this.data} headers={this.headers}>
            {<this.Translate id="button_search_stock_transfer_export_csv" />}
          </this.CSVLink>
        </div>
      </div>
    );
  }

  renderFilterRecord() {
    const {form} = this.props;
    return(
      <div>
        { form == null ?
          ""
          :
          <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout form-group"> 
              <this.Col md="2">
                <this.Select
                  name="status"
                  label={<this.Translate id="select_search_stock_transfer_status" />}
                  placeholder="Please select status"
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="status"
                  label={<this.Translate id="select_search_stock_transfer_brand" />}
                  placeholder="Please select status"
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="status"
                  label={<this.Translate id="select_search_stock_transfer_product_type" />}
                  placeholder="Please select status"
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Supplier />
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="status"
                  label={<this.Translate id="select_search_stock_transfer_status" />}
                  placeholder="Please select status"
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Button htmlType="submit" type="info" >
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_search_stock_transfer" />
              </this.Button>
            </this.Row>
          </this.Form>
        }
      </div>
    );
  }


}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_stock_transfer_no" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_transfer_name" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_transfer_form_location" />,
        dataIndex: "stockLocation",
        key: "stockLocation",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_transfer_to_location" />,
        dataIndex: "dueDate",
        key: "dueDate",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_transfer_transfer_by" />,
        dataIndex: "shippingFee",
        key: "shippingFee",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_transfer_received_by" />,
        dataIndex: "total",
        key: "total",
        sorter: true
      },
      this.columnStatus
    ];
  }
}