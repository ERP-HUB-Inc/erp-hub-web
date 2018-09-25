import React from "react";
import List from "../List";
import {Doughnut} from "react-chartjs-2";
import Constant from "../../../constants/report/profitAndLost";
import ProfitAndLostReportAction from "../../../action/report/profitAndLostReport";
import ProfitAndLostReportService from "../../../services/report/ProfitAndLostService";
import "./index.css";

export default class InventoryList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "profitAndLostReport";
    this.addingProp = "profitAndLostReportAdd";
    this.updatingProp = "profitAndLostReportUpdate";
    this.service = ProfitAndLostReportService;
    this.action = ProfitAndLostReportAction;
    this.RESET_CONSTANT = Constant.RESET_PROFIT_AND_LOST;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);

    this.doughnutData = 
    {
      labels: [
        "Revenuse",
        "Expense"
      ],
      datasets: [
        {
          data: [10,20],
          backgroundColor: [
            "#57A600",
            "#B90000  "
          ]
        }
      ],   
    };

    this.ColunsList = [
      {
        totalSale: "Total Sale",
        OtherRevenuse: "0.00",
      },
      {
        totalSale: "Other Revenuse",
        OtherRevenuse: "0.00",
      },
      {
        totalSale: "Sale Revenue",
        OtherRevenuse: "0.00",
      }
    ];

  }

  renderTable(){
    return (  
      <div className="main-profit-and-lost-report">
        <this.Row>
          <this.Col md="8">
            <this.Table 
              dataSource={this.ColunsList}
              columns={this.columns}
              // locale={{emptyText: ""}}
              onChange={this.handleTableChange}
              footer={() =>
                <this.Row>
                  <this.Col md="6" className="net-income">
                    NET INCOME
                  </this.Col>
                  <this.Col md="6" className="price">
                      0$.00
                  </this.Col>
                </this.Row>
              }
            />
          </this.Col>
          <this.Col md="4">
            <div style={{position: "relative"}}>
              <Doughnut
                data={this.doughnutData}
                option={
                  {
                    animation: {
                      duration: 0, 
                    },
                    hover: {
                      animationDuration: 0, 
                    },
                    legend: {
                      position: "right",
                      labels: {
                        boxWidth: 10
                      }
                    },
                    responsiveAnimationDuration: 0,
                    responsive: false
                  }
                
                }
              
              />
            </div>
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

            <this.Col md="2" className="reorder-point-button-search">
              <this.Select
                name="status"
                placeholder={this.CATranslate("place_holder_stock_reorder_point_status", locale)}
                dataSource={this.statusList}
                label={<this.Translate id="input_inventory_report_type" />}
                defaultValue={this.Enum.ALL_STATE}
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="reorder-point-button-search">
              <this.DatePickers
                name="datepicker"
                label={<this.Translate id="input_inventory_report_date" />}
                form={form}
              />
            </this.Col>

            <this.Col md="3" className="reorder-point-button-search">
              <this.InputText
                name="key"
                placeholder={this.CATranslate("input_inventory_report_key", locale)}
                label={<this.Translate id="input_inventory_report_label_key" />}
                form={form}
              />
            </this.Col>
            
            <this.Col md="2" className="reorder-point-button-search report-button">
              <this.Button htmlType="submit" type="info" >
                <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="button_stock_reorder_search" />}
              </this.Button> 
            </this.Col>

            <this.Col md="12" className="reorder-point-button-search report-button">
              <this.Button htmlType="submit" type="info" >
                <span className="icon-export icon-padding-right text-uppercase"></span>{<this.Translate id="button_inventory_report_export_to_csv" />}
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
        title: "REVENUS",
        className: "revenuse-report",
        children:[
          {
            dataIndex: "totalSale",
            className: "profit-and-lost-column",
            key: "totalSale",
            render: (text, record, index) => {
              if(index <=1){
                return(
                  <div>{record.totalSale}</div>
                );
              }
            }
          },
          {
            dataIndex: "OtherRevenuse",
            align: "right",
            className: "profit-and-lost-price",
            key: "OtherRevenuse",
            render: (text, record, index) => {
              if(index <=1){
                return(
                  <div>{record.OtherRevenuse}</div>
                );
              }
            }
          }
        ]
      },
      {
        title: "EXPENSE",
        className: "expense-report",
        children: [
          {
            dataIndex: "totalSale",
            className: "profit-and-lost-column",
            key: "totalSale",
          },
          {
            dataIndex: "OtherRevenuse",
            className: "profit-and-lost-price",
            align: "right",
            key: "OtherRevenuse",
          }
        ]
      },
     
    ];
  }
}