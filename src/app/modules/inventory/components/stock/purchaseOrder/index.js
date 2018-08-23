import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/stock/purchaseOrder/FormCreate";
import FormUpdate from "../../../containers/stock/purchaseOrder/FormUpdate";
import Constant from "../../../constants/stock/purchaseOrder";
import SupplierAction from "../../../actions/stock/purchaseOrder";
import SupplierService from "../../../services/stock/SupplierService";
import "./index.css";

export default class Lists extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "purchaseOrder";
    this.addingProp = "purchaseOrderAdd";
    this.updatingProp = "purchaseOrderUpdate";
    this.service = SupplierService;
    this.columnFilterWithKey = ["name"];
    this.action = SupplierAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
    this.hideActionButton = true;
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

  renderActionButton() {
    return (
      <div>
        <this.Button type="info">
          <span className="icon-export"></span> Export CSV
        </this.Button> 
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
                  label={<this.Translate id="text_status" />}
                  placeholder="Please select status"
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="status"
                  label={<this.Translate id="select_stock_purchase_due_date" />}
                  placeholder="Please select status"
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.DatePickers
                  name="status"
                  label={<this.Translate id="date_picker_purchase_supplier" />}
                  form={form}
                />
              </this.Col>
              <this.Col md="3">
                <this.InputText
                  name="key"
                  label={<this.Translate id="input_stock_purchase_key" />}
                  placeholder="Search for code, name and address"
                  form={form}
                />
              </this.Col>

              <this.Button htmlType="submit" type="info" >
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
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
        title: <this.Translate id="col_stock_purchase_order_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_purchase_order_supplier" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_purchase_order_stock_location" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_purchase_order_due_date" />,
        dataIndex: "email",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_purchase_order_shipping_fee" />,
        dataIndex: "email",
        key: "phoneNumber",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_purchase_order_total" />,
        dataIndex: "email",
        key: "phoneNumber",
        sorter: true
      },
      this.columnStatus
    ];
  }
}