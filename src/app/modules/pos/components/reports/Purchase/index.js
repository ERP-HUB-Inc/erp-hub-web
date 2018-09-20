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
  }

  renderTable(){
    return (  
      <div>
        Purchase
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

            <this.Col md="3" className="reorder-point-button-search">
              <this.Select
                name="status"
                placeholder={this.CATranslate("place_holder_stock_reorder_point_status", locale)}
                dataSource={this.statusList}
                label="Report Type"
                defaultValue={this.Enum.ALL_STATE}
                form={form}
              />
            </this.Col>
            <this.Col md="3" className="reorder-point-button-search">
              <this.DatePickers
                name="datepicker"
                label="Date"
                form={form}
              />
            </this.Col>
            <this.Col md="3" className="reorder-point-button-search">
              <this.InputText
                name="key"
                label="Search For key"
                placeholder="Search for brand, code and notation"
                form={form}
              />
            </this.Col>

            <this.Col md="2" className="reorder-point-button-search">
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
        width: 350,
        className: "purchase-report",
        align: "center",
        render: value => this.formatDate(value)
      },
      {
        title: <this.Translate id="col_purchase_report_revenuse" />,
        dataIndex: "name",
        align: "center",
        key: "name"
      },
      {
        title: <this.Translate id="col_purchase_report_cost_of_good" />,
        dataIndex: "description",
        align: "center",
        key: "description"
      },
      {
        title: <this.Translate id="col_purchase_report_gross_profit" />,
        dataIndex: "stockLocation",
        align: "center",
        key: "stockLocation"
      },
      {
        title: <this.Translate id="col_purchase_report_margin" />,
        dataIndex: "dueDate",
        align: "center",
        key: "dueDate"
      },
      {
        title: <this.Translate id="col_purchase_report_tax" />,
        dataIndex: "shippingFee",
        align: "center",
        key: "shippingFee"
      }
    ];
  }
}