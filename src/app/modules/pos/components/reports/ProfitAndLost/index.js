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
    this.state = {
      listProfitAndLost: [],
      isNotYetLoadComponentDidUpdated: true
    };

    this.columns = new Column();
    this.ExportheadersCsv = [{label: "Date", key: "createdAt"},
      {label: "Name", key: "name"},
      {label: "Amount", key: "amount"},
      {label: "Type", key: "type"}
    ];
    this.exportCsvFileName = "profit_and_lost_report.csv"; 
    this.fetchingProp = "profitAndLostReport";
    this.addingProp = "profitAndLostReportAdd";
    this.updatingProp = "profitAndLostReportUpdate";
    this.columnFilterWithKey = ["type"];
    this.reportType = [
      {name: <this.Translate id="select_profit_and_lost_operation_report_type" />, value: this.Enum.OPERATION_TYPE.INCOME},
      {name: <this.Translate id="select_profit_and_lost_sale_report_type" />, value: this.Enum.OPERATION_TYPE.EXPENSE}
    ];

    this.service = ProfitAndLostReportService;
    this.action = ProfitAndLostReportAction;
    this.RESET_CONSTANT = Constant.RESET_PROFIT_AND_LOST;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.groupIncomeExpenseByType = this.groupIncomeExpenseByType.bind(this);

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


  }


  groupIncomeExpenseByType() {
    const income = [];
    const expense = [];
    let netincome= [];
    let total = 0;

    if (Array.isArray(this.props.profitAndLostReport.list)) {
  
      this.props.profitAndLostReport.list.forEach(incomeExpense => {
        total += incomeExpense.amount * incomeExpense.amount;
        if (incomeExpense.type === this.Enum.OPERATION_TYPE.INCOME) {
          income.push(incomeExpense);
        } else if (incomeExpense.type === this.Enum.OPERATION_TYPE.EXPENSE) {
          expense.push(incomeExpense);
        }

      });
      netincome = this.formatCurrency(total);
    }
    return {
      income,
      expense,
      netincome
    };

  }

  doughuntChat(){
    const data = [];
    if (Array.isArray(this.props.profitAndLostReport.list)) {
      this.props.profitAndLostReport.list.forEach(doughuntdata => {
        data.push({
          data: [10,20]
        });
      });
    }

    console.log("data",data);
    // return{data};

  }

  handleSubmitFilter(e){
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (this.action != null) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const {dispatch} = this.props;
            let filter = {};
            let rangFilter = {};
  
            if (values.deliveryDueDate) {
              values.deliveryDueDate = this.Util.formatDate(values.deliveryDueDate, "YYYY-MM-DD");
              rangFilter = JSON.stringify({column: "createdAt", value: [values.deliveryDueDate, values.deliveryDueDate]});
            }

            filter["status"] = [1,0]; 

            filter = JSON.stringify(filter);

  
            const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.type });
            dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter,searchKey, rangFilter));
            this.setState({isClickFilter: true});
          }
        
        }); 
      } 
    }); 
  }




  renderTable(){
    const incomeExpense = this.groupIncomeExpenseByType();
    console.log("doughuntChat",this.doughuntChat());
    return (  
      <div className="main-profit-and-lost-report">
        <this.Row>
          <this.Col md="8" className="devide-main-profit-layout">

            <this.Table 
              dataSource={incomeExpense.income}
              columns={new Column(<this.Translate id="col_profit_and_lost_revenus" />)}
              onChange={this.handleTableChange}
            />
            <this.Table 
              dataSource={incomeExpense.expense}
              columns={new Column(<this.Translate id="col_profit_and_lost_expense" />,"revenuse-report")}
              onChange={this.handleTableChange}
            />
            <div className="net-income">
              <this.Translate id="col_profit_and_lost_net_income" />
            </div>
            <div className="net-income">
              {incomeExpense.netincome}
            </div>
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
                    responsiveAnimationDuration: 0,
                    responsive: false
                  }
                
                }

                legend= {
                  {
                    position: "bottom"
                  }  
                }

              />
            </div>
          </this.Col>
        </this.Row>
      </div>
    );
  }

  renderActionButton(){
    return(
      <div className="reorder-point-button-search report-button">
        { this.renderButtonExportCSV() }  
      </div> 
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
                name="type"
                placeholder={this.CATranslate("place_holder_profit_and_lost_report_type", locale)}
                dataSource={this.reportType}
                label={<this.Translate id="input_inventory_report_type" />}
                // defaultValue={-1}
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="reorder-point-button-search">
              <this.DatePickers
                name="deliveryDueDate"
                label={<this.Translate id="input_inventory_report_date" />}
                form={form}
              />
            </this.Col>
            
            <this.Col md="2" className="reorder-point-button-search report-button">
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
  constructor(title = "REVENUS",className) {
    super();
    return [
      {
        title: title,
        className: className,
        children:[
          {
            dataIndex: "name",
            className: "profit-and-lost-column",
            key: "name",
          },
          {
            dataIndex: "amount",
            align: "right",
            className: "profit-and-lost-price",
            key: "amount",
            render: (text,record,index) => {
              return(this.formatCurrency(record.amount));
            }
          }
        ]
      },
    
    ];
  }
}