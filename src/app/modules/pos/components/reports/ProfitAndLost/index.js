import React from "react";
import List from "../List";
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
      setDefaultDate: [],
      pieDataSource: {
        columns: [],
        type: "donut",
        colors: {
          Revenue: "rgb(76, 182, 76)",
          Expense: "#B90000"
        }
      }
    };

    this.columns = new Column();
    this.ExportheadersCsv = [
      {label: this.CATranslate("text_date", this.props.locale), key: "createdAt"},
      {label: this.CATranslate("text_name", this.props.locale), key: "name"},
      {label: this.CATranslate("text_amount", this.props.locale), key: "amount"},
      {label: this.CATranslate("text_type", this.props.locale), key: "type"}
    ];

    this.exportCsvFileName = "profit_and_lost_report.csv"; 
    this.fetchingProp = "profitAndLostReport";
    this.columnFilterWithKey = ["createdAt"];
    this.reportType = {
      SALE_PROFIT: 0,
      OPERATION_PROFIT: 1
    };
    this.reportTypeList = [
      { value: this.reportType.OPERATION_PROFIT, name: <this.Translate id="text_operation_profit_and_lost" />},
      { value: this.reportType.SALE_PROFIT, name: <this.Translate id="text_sale_profit_and_lost" />}
    ];

    this.service = ProfitAndLostReportService;
    this.action = ProfitAndLostReportAction;
    this.RESET_CONSTANT = Constant.RESET_PROFIT_AND_LOST_REPORT;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.groupIncomeExpenseByType = this.groupIncomeExpenseByType.bind(this);
  }

  componentDidMount(){
    this.loadFilter();
  }

  componentDidUpdate() {
    if (this.props.profitAndLostReport.fetched) {
      const pieDataSource = this.state.pieDataSource;

      if (this.props.profitAndLostReport.list.length > 0) {
        const incomeExpense = this.groupIncomeExpenseByType();
        pieDataSource["columns"].push([this.CATranslate("text_revenue", this.props.locale), incomeExpense.incomeType]);
        pieDataSource["columns"].push([this.CATranslate("text_expense", this.props.locale), incomeExpense.expenseType]);
        pieDataSource["unload"] = [this.CATranslate("text_revenue", this.props.locale), this.CATranslate("text_expense", this.props.locale)];
        this.setState({pieDataSource});
      } else {
        pieDataSource["unload"] = [this.CATranslate("text_revenue", this.props.locale), this.CATranslate("text_expense", this.props.locale)];
        this.setState({
          pieDataSource: {
            columns: [[this.CATranslate("text_empty", this.props.locale), 0.0001]],
            type: "donut",
            colors: {
              Empty: "#f9f9f9"
            }}
        });
      }
      this.props.dispatch(ProfitAndLostReportAction.reset());
    }
  }

  groupIncomeExpenseByType() {
    const income = [];
    const expense = [];
    let netincome= [];
    let noOperationType = 0; // For deafult data when have record occure(blank pie chart)
    let incomeType= 0;
    let expenseType = 0;  
    
    if (Array.isArray(this.props.profitAndLostReport.list)) {

      this.props.profitAndLostReport.list.forEach(operationRecord => {
        if ([this.Enum.OPERATION_TYPE.INCOME, this.Enum.OPERATION_TYPE.SALE_INCOME].includes(operationRecord.type)) {
          const existingAtIndex = income.findIndex(value => value.name === operationRecord.name);
          if (existingAtIndex === -1) {
            income.push({
              id: operationRecord.id,
              name: operationRecord.name,
              amount: operationRecord.amount,
              type: operationRecord.type,
              isSale: operationRecord.isSale 
            });
          } else {
            income[existingAtIndex]["amount"] += operationRecord.amount;
          }

          incomeType += operationRecord.amount;
        } else if ([this.Enum.OPERATION_TYPE.EXPENSE, this.Enum.OPERATION_TYPE.COGS].includes(operationRecord.type)) {
          const existingAtIndex = expense.findIndex(value => value.name === operationRecord.name);
          if (existingAtIndex === -1) {
            expense.push({
              id: operationRecord.id,
              name: operationRecord.name,
              amount: operationRecord.amount,
              type: operationRecord.type,
              isSale: operationRecord.isSale
            });
          } else {
            expense[existingAtIndex]["amount"] += operationRecord.amount;
          }
          expenseType += operationRecord.amount;
        } else if (operationRecord.type === this.Enum.OPERATION_TYPE.NO_OPERATION) {
          noOperationType = 0.0001;
        }
      });
      netincome = this.formatCurrency(incomeType - expenseType);
    }
    return {
      income,
      expense,
      netincome,
      incomeType,
      expenseType,
      noOperationType
    };

  }

  exportCsv(){
    const {profitAndLostReport} = this.props;
    let getIncomeExpenseValue = [];
    let form = this.props.form;
    
    if(form.getFieldValue("reportType") === this.reportType.OPERATION_TYPE){
      this.exportCsvFileName = "Operation-profit-and-lost-report.csv";
    }else if(form.getFieldValue("reportType") === this.reportType.OPERATION_PROFIT){
      this.exportCsvFileName = "Sale-profit-and-lost-report.csv";
    }

    if (profitAndLostReport.list) {
      
      profitAndLostReport.list.forEach(profitReport => {
        if(profitReport.type === this.Enum.OPERATION_TYPE.INCOME || profitReport.type === this.Enum.OPERATION_TYPE.EXPENSE){
          getIncomeExpenseValue.push({
            createdAt: profitReport.createdAt,
            name: profitReport.name,
            amount: this.formatCurrency(profitReport.amount),
            type: profitReport.type === this.Enum.OPERATION_TYPE.INCOME ?  this.CATranslate("text_revenue", this.props.locale) : this.CATranslate("text_expense", this.props.locale)
          });
        }
      });

      getIncomeExpenseValue.push({
        createdAt: this.CATranslate("text_net_income", this.props.locale),
        name:  this.groupIncomeExpenseByType().netincome,
        amount: "",
        type: ""
      });

    }

    return getIncomeExpenseValue;
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
        this.Util.formatDateForMYSQL(getCurrentDate) + " 00:00:00",
        this.Util.formatDateForMYSQL(getCurrentDate) + " 23:59:59"
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
            let filter = {};

            if(values.reportType === this.reportType.OPERATION_PROFIT){
              filter["isSale"] = [this.Enum.IS_SALE_RECORD.NO];
              filter["type"] = [this.Enum.OPERATION_TYPE.INCOME, this.Enum.OPERATION_TYPE.EXPENSE];
            }

            if(values.reportType === this.reportType.SALE_PROFIT){
              filter["isSale"] = [this.Enum.IS_SALE_RECORD.YES];
              filter["type"] = [this.Enum.OPERATION_TYPE.SALE_INCOME, this.Enum.OPERATION_TYPE.COGS];
            }

            let rangFilter = "";
            if (values.createdAt) {
              rangFilter = JSON.stringify({
                column: "registerDate",
                value: [
                  this.Util.formatDateForMYSQL(values.createdAt[0]) + " 00:00:00",
                  this.Util.formatDateForMYSQL(values.createdAt[1]) + " 23:59:59"
                ]});
  
            }

            filter = JSON.stringify(filter);  
            this.props.dispatch(this.action.fetch(filter,rangFilter));
            this.setState({isClickFilter: true});
          }
        
        }); 
      } 
    }); 
  }

  renderSummaryOnPieChar(incomeExpense) {
    return <div className="type">
      <div className="text-uppercase" style={{display: "flex", justifyContent: "space-between"}}>
        <div style={{textAlign: "left", display: "flex", alignItems: "center"}}>
          <div style={{width: 10, height: 10, marginRight: 5, backgroundColor: "#57A600"}}></div>
          <div>
            <this.Translate id="text_revenue" />
          </div>
        </div>
        <div className="type-value">
          {this.formatCurrency(incomeExpense.incomeType)}
        </div>
      </div>
      <div className="text-uppercase" style={{display: "flex", justifyContent: "space-between", marginTop: 10}}>
        <div style={{textAlign: "left", display: "flex", alignItems: "center"}}>
          <div style={{width: 10, height: 10, marginRight: 5, backgroundColor: "#B90000"}}></div>
          <div>
            <this.Translate id="text_expense" />
          </div>
        </div>
        <div className="type-value">
          {this.formatCurrency(incomeExpense.expenseType)}
        </div>
      </div>
    </div>;
  }

  renderTable(){
    const incomeExpense = this.groupIncomeExpenseByType();
    return (  
      <div className="main-profit-and-lost-report">
        <this.Row>
          <this.Col md="8" className="devide-main-profit-layout">
            <this.Table 
              dataSource={incomeExpense.income}
              locale={{emptyText: <this.Translate id="no_peration_revenue" />}}
              columns={new Column(<this.Translate id="text_revenue" />)}
              onChange={this.handleTableChange}/>
            <this.Table 
              dataSource={incomeExpense.expense}
              locale={{emptyText: <this.Translate id="no_peration_expense" />}}
              columns={new Column(<this.Translate id="text_expense" />,"revenuse-report")}
              onChange={this.handleTableChange}/>
            <div className="net-income text-uppercase">
              <this.Translate id="text_net_income" />
            </div>
            <div className="net-income">
              {incomeExpense.netincome}
            </div>
          </this.Col>
          <this.Col md="4">
            <this.C3Chart
              data={this.state.pieDataSource}
              legend={{
                show: false
              }}
              title={this.CATranslate("text_income_expense", this.props.locale)}
              size={{}}
              tooltip={{
                format: {
                  value: value => {
                    return this.formatCurrency(value);
                  }
                }
              }}/>
            {this.renderSummaryOnPieChar(incomeExpense)}
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
          headers={this.ExportheadersCsv}>
          <this.Button type="info" disabled={ this.props.profitAndLostReport.list.length > 0 ? false : true }>
            <span className="icon-export icon-padding-right"></span>{<this.Translate id="text_export_csv" />}
          </this.Button>
        </this.CSVLink>
      </div>
    );
  }

  renderPagination() {}

  renderFilterRecord() {
    const fetchingProps = this.props[this.fetchingProp];
    return(
      this.props.form == null ?
        ""
        :
        <div>
          <this.Form onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout profit-and-lose"> 

              <this.Col md="3">
                <this.Select
                  name="reportType"
                  placeholder={this.CATranslate("sale_report_type", this.props.locale)}
                  dataSource={this.reportTypeList}
                  label={<this.Translate id="text_report_type" />}
                  defaultValue={this.reportType.OPERATION_PROFIT}
                  form={this.props.form}/>
              </this.Col>
              <this.Col md="3">
                <this.DateRangePicker
                  name="createdAt"
                  label={<this.Translate id="text_date_range" />}
                  defaultValue={this.state.setDefaultDate}
                  errorRequired={<this.Translate id="errpr_text_date_range" />}
                  form={this.props.form}
                  ranges={this.dateRangeDataSource()} />
              </this.Col>
            
              <this.Col md="2" className="reorder-point-button-search report-button wrap-btn-search">
                <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                  <label htmlFor="status" className="" title=""></label>
                </div>
                <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                  <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="text_search" />}
                </this.Button> 
              </this.Col>
            
            </this.Row>
          </this.Form>
        </div>
    );

  }

}

class Column extends List {
  constructor(title =  <this.Translate id="text_revenue" />,className) {
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