import React from "react";
import List from "../List";
import Constant from "../../../constants/report/purchase";
import PurchaseReportAction from "../../../action/report/purchaseReport";
import PurchaseReportService from "../../../services/report/PurchaseService";
import "./index.css";

export default class InventoryList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "purchaseReport";
    this.addingProp = "purchaseReportAdd";
    this.updatingProp = "purchaseReportUpdate";
    this.service = PurchaseReportService;
    this.action = PurchaseReportAction;
    this.RESET_CONSTANT = Constant.RESET_PURCHASE_REPORT;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.supplierList = [{name: <this.Translate id="text_all_supplier"/>, id: 0}];
    
    this.purchaseReport = this.purchaseReport.bind(this);
  }

  purchaseReport(){
    const {purchaseReport} = this.props;
    return purchaseReport.list;
  }

  renderTable(){
    const purchaseReport = this.purchaseReport();
    return (  
      <div className="main-purchase">
        <this.Row>
          <this.Col md="12">
            <this.Table 
              dataSource={ purchaseReport }
              columns= { this.columns }
              locale={{emptyText: <this.Translate id="table_empty_data"/>}}
              footer={() => 
                <div className="float-right">
                  <div className="totals">
                    TOTALS
                  </div>
                </div>
              }
            />
          </this.Col>
        </this.Row>
      </div>
    );
  }

  handleSubmitFilter(e){
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("values",values);
      }
    }); 
  }

  renderActionButton(){
    return(
      <div></div>
    );
  }

  renderPagination(){
    return(<div></div>);
  }

  renderFilterRecord() {

    const {form,locale} = this.props;
    return(
      <div>
        <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout form-group"> 

            <this.Col md="3">
              <this.Select
                name="status"
                placeholder={this.CATranslate("place_holder_stock_reorder_point_status", locale)}
                dataSource={this.statusList}
                label="Report Type"
                defaultValue={this.Enum.ALL_STATE}
                form={form}
              />
            </this.Col>

            <this.Col md="3">
              <this.DatePickers
                name="datepicker"
                label="Date"
                form={form}
              />
            </this.Col>

            <this.Col md="3">
              <this.InputText
                name="key"
                label="Search For key"
                placeholder="Search for brand, code and notation"
                form={form}
              />
            </this.Col>

            <this.Col md="2" className="wrap-btn-search">
              <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                <label htmlFor="status" className="" title=""></label>
              </div>
              <this.Button htmlType="submit" type="info" >
                <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="button_stock_reorder_search" />}
              </this.Button> 
            </this.Col>

          </this.Row>
        </this.Form>
      </div>
    );

  }

}


class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: "",
        dataIndex: "createdAt",
        key: "createdAt",
        className: "purchase-report",
        align: "center",
        render: value => this.formatDate(value)
      },
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="text_number" />,
        dataIndex: "number",
        align: "center",
        key: "number"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_reference" />,
        dataIndex: "referenceId",
        align: "center",
        key: "referenceId"
      },
      {
        title: <this.Translate id="text_receiver" />,
        dataIndex: "text_receiver",
        align: "center",
        key: "text_receiver"
      },
      {
        title: <this.Translate id="text_supplier" />,
        dataIndex: "supplier",
        align: "center",
        key: "supplier"
      },
      {
        title: <this.Translate id="text_location" />,
        dataIndex: "location",
        align: "center",
        key: "location"
      },
      {
        title: <this.Translate id="text_due_date" />,
        dataIndex: "deliveryDueDate",
        align: "center",
        key: "deliveryDueDate"
      },
      {
        title: <this.Translate id="text_step" />,
        dataIndex: "text_step",
        align: "center",
        key: "text_step"
      },
      {
        title: <this.Translate id="col_stock_purchase_order_shipping_fee" />,
        dataIndex: "shippingFee",
        align: "center",
        key: "shippingFee"
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "requestTotal",
        align: "center",
        key: "requestTotal"
      }
    ];
  }
}