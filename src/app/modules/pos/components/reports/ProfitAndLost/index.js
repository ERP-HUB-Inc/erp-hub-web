import React from "react";
import List from "../List";
import {Doughnut} from "react-chartjs-2";
import Constant from "../../../constants/report/profitAndLost";
import ProfitAndLostReportAction from "../../../action/report/profitAndLost";
import ProfitAndLostReportService from "../../../services/report/ProfitAndLostService";
import "./index.css";

export default class ProfitAndLostList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      listProfitAndLost: [],
      isNotYetLoadComponentDidUpdated: true,
      setDefaultDate:  []
    };

    this.columns = new Column();
    this.ExportheadersCsv = [
      {label: this.CATranslate("text_date", this.props.locale), key: "createdAt"},
      {label: this.CATranslate("text_name", this.props.locale), key: "name"},
      {label: this.CATranslate("col_operation_record_amount", this.props.locale), key: "amount"},
      {label: this.CATranslate("text_type", this.props.locale), key: "type"}
    ];

    this.exportCsvFileName = "profit_and_lost_report.csv"; 
    this.fetchingProp = "profitAndLostReport";
    this.columnFilterWithKey = ["createdAt"];
    this.reportType = [
      { value: 2 ,name: <this.Translate id="select_profit_and_lost_operation_report_type" />},
      { value: this.Enum.OPERATION_TYPE.EXPENSE,name: <this.Translate id="select_profit_and_lost_sale_report_type" />}
    ];

    this.service = ProfitAndLostReportService;
    this.action = ProfitAndLostReportAction;
    this.RESET_CONSTANT = Constant.RESET_PROFIT_AND_LOST_REPORT;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.groupIncomeExpenseByType = this.groupIncomeExpenseByType.bind(this);

  }

  componentDidMount(){
    super.componentDidMount();
    this.loadFilter();
  }

  groupIncomeExpenseByType() {
    const income = [];
    const expense = [];
    let netincome= [];
    let totalNetIncome= [];
    let incomeType= 0;
    let expenseType = 0;  
    
    if (Array.isArray(this.props.profitAndLostReport.list)) {
  
      this.props.profitAndLostReport.list.forEach(incomeExpense => {
  
        if (incomeExpense.type === this.Enum.OPERATION_TYPE.INCOME) {

          income.push({
            name:  incomeExpense.name,
            amount: incomeExpense.amount,
            type: incomeExpense.type,
            isSale: incomeExpense.isSale 
          });

          incomeType += incomeExpense.amount;
        } else if (incomeExpense.type === this.Enum.OPERATION_TYPE.EXPENSE) {

          expense.push({
            name: incomeExpense.name,
            amount: incomeExpense.amount,
            type: incomeExpense.type,
            isSale: incomeExpense.isSale
          });

          expenseType += incomeExpense.amount;

        }
        

      });

      totalNetIncome = incomeType - expenseType;
      netincome.push(this.formatCurrency(totalNetIncome));

    }

    return {
      income,
      expense,
      netincome,
      incomeType,
      expenseType
    };

  }
  

  exportCsv(){
    const { profitAndLostReport } = this.props;
    let getIncomeExpenseValue = [];
    if (profitAndLostReport.list) {
      
      profitAndLostReport.list.forEach(profitReport => {
        if(profitReport.type === this.Enum.OPERATION_TYPE.INCOME || profitReport.type === this.Enum.OPERATION_TYPE.EXPENSE){
          getIncomeExpenseValue.push({
            createdAt: profitReport.createdAt,
            name: profitReport.name,
            amount: this.formatCurrency(profitReport.amount),
            type: profitReport.type === this.Enum.OPERATION_TYPE.INCOME ? "Revenus" : "Expense"
          });
        }
      });

      getIncomeExpenseValue.push({
        createdAt: "Net Income",
        name:  this.groupIncomeExpenseByType().netincome,
        amount: "",
        type: ""
      });

    }

    return getIncomeExpenseValue;
  }

  doughuntChat(){
    const incomeExpense = this.groupIncomeExpenseByType();
    return(
      {
        labels: [
          this.CATranslate("col_profit_and_lost_revenus", this.props.locale),
          this.CATranslate("col_profit_and_lost_expense", this.props.locale)
        ],
        datasets: [
          {
            data: [incomeExpense.incomeType,incomeExpense.expenseType],
            backgroundColor: [
              "#57A600",
              "#B90000"
            ]
          }
        ],   
      }
    );

  }

  loadFilter(){
    let getCurrentDate = new Date().toISOString().slice(0,10); 

    this.setState({
      setDefaultDate : [this.Util.formatDatePicker(getCurrentDate),this.Util.formatDatePicker(getCurrentDate)]
    });

    const {dispatch} = this.props;

    let filter = {};

    filter["isSale"] = [this.Enum.OPERATION_TYPE.NONE_SALE];
    filter["type"] = [this.Enum.OPERATION_TYPE.INCOME,this.Enum.OPERATION_TYPE.EXPENSE];


    let rangFilter = "";
   
    rangFilter = JSON.stringify({
      column: "registerDate",
      value: [
        this.Util.formatDateForMYSQL(getCurrentDate),
        this.Util.formatDateForMYSQL(getCurrentDate)
      ]});

    filter = JSON.stringify(filter);
    dispatch(this.action.fetch(filter,rangFilter));
    this.setState({isClickFilter: true});

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
            filter["type"] = [values.reportType];

            if(values.reportType === 2){
              filter["isSale"] = [this.Enum.OPERATION_TYPE.NONE_SALE];
              filter["type"] = [this.Enum.OPERATION_TYPE.INCOME,this.Enum.OPERATION_TYPE.EXPENSE];
            }

            if(values.reportType === this.Enum.OPERATION_TYPE.EXPENSE){
              filter["isSale"] = [this.Enum.OPERATION_TYPE.SALE];
              filter["type"] = [this.Enum.OPERATION_TYPE.INCOME,this.Enum.OPERATION_TYPE.EXPENSE];
            }

            let rangFilter = "";
            if (values.createdAt) {
              rangFilter = JSON.stringify({
                column: "registerDate",
                value: [
                  this.Util.formatDateForMYSQL(values.createdAt[0]),
                  this.Util.formatDateForMYSQL(values.createdAt[1])
                ]});
  
            }

            filter = JSON.stringify(filter);
          
            dispatch(this.action.fetch(filter,rangFilter));

            this.setState({isClickFilter: true});
            
          }
        
        }); 
      } 
    }); 
  }

  renderTable(){
    const incomeExpense = this.groupIncomeExpenseByType();
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
                data={this.doughuntChat()}
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
                    position: "none"
                  }  
                }

              />
              <div className="type">
                <div><this.Translate id="col_profit_and_lost_revenus" />&nbsp;<span className="type-value">{incomeExpense.incomeType}</span></div>
                <div><this.Translate id="col_profit_and_lost_expense" />&nbsp;&nbsp;<span className="type-value">{incomeExpense.expenseType}</span></div>
              </div>

            </div>
          </this.Col>
        </this.Row>
      </div>
    );
  }

  renderActionButton(){
    return(
      <div className="btn-profit-and-lost">
        <this.CSVLink
          filename={this.exportCsvFileName}
          data={this.exportCsv()}
          headers={this.ExportheadersCsv}
        >
          <this.Button type="info">
            <span className="icon-export icon-padding-right"></span>{<this.Translate id="text_export_csv" />}
          </this.Button>
        </this.CSVLink>
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
        <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout profit-and-lose"> 

            <this.Col md="3">
              <this.Select
                name="reportType"
                placeholder={this.CATranslate("place_holder_profit_and_lost_report_type", locale)}
                dataSource={this.reportType}
                label={<this.Translate id="input_inventory_report_type" />}
                defaultValue={2}
                required={true}
                form={form}/>
            </this.Col>
            <this.Col md="3">
              <this.DateRangePicker
                name="createdAt"
                label={<this.Translate id="text_date_range" />}
                defaultValue={this.state.setDefaultDate}
                required={true}
                errorRequired={<this.Translate id="errpr_text_date_range" />}
                form={form}/>
            </this.Col>
            
            <this.Col md="2" className="reorder-point-button-search report-button wrap-btn-search">
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
  constructor(title =  <this.Translate id="col_profit_and_lost_revenus" />,className) {
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