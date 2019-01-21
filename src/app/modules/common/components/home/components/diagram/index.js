import React from "react";
import GraphAction from "../../../../../common/actions/home";
import SaleReportAction from "../../../../../pos/action/report/sale";
import {Line} from "react-chartjs-2";
import Component from "../../../Component";
import "./index.css";

export default class Diagram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      defaultGraphChatDataSource: 
        {
          datasets: [
            {
              borderColor: "#398BF7",
              borderWidth: 2.5,
              label: "Income",
              data: []
            },
            {
              borderColor: "#06D79C",
              borderWidth: 2,
              label: "Expense",
              data: []
            }
          ],
          labels: []
        }
    };
    this.statusList = [
      {name: <this.Translate id="select_text_active"/>, value: this.Enum.ACTIVE},
      {name: <this.Translate id="select_text_deactive"/>, value: this.Enum.DEACTIVE},
      {name: <this.Translate id="select_text_all_status"/>, value: this.Enum.ALL_STATE}
    ];
    this.groupIncomeExpenseType = this.groupIncomeExpenseType.bind(this);
  }

  groupIncomeExpenseType(){
    const income = [];
    const expense = [];
    if (Array.isArray(this.props.pipeChat.list)) {
      this.props.pipeChat.list.forEach(incomeExpense => {
        if (incomeExpense.type === this.Enum.OPERATION_TYPE.INCOME) {
          income.push(incomeExpense);
        } else if (incomeExpense.type === this.Enum.OPERATION_TYPE.EXPENSE) {
          expense.push(incomeExpense);
        }
      });
    }
    return {
      income,
      expense
    };
  }

  componentDidMount(){
    this.props.dispatch(GraphAction.fetchGraph());
    this.props.dispatch(GraphAction.fetchPipe());
    this.loadTodaySaleSummary();
  }

  loadTodaySaleSummary() {
    let getCurrentDate = new Date().toISOString().slice(0, 10);

    let filter = {};
    let rangFilter = {};

    rangFilter = JSON.stringify({
      column: "registerDate",
      value: [
        this.Util.formatDateForMYSQL(getCurrentDate) + " 00:00:00",
        this.Util.formatDateForMYSQL(getCurrentDate) + " 23:59:59"
      ]});

    filter["type"] = [0, 1];
    
    filter = JSON.stringify(filter);
      
    this.props.dispatch(SaleReportAction.fetch(filter, rangFilter));
  }

  render() {
    let graphChatDataSource = this.props.graphChat.list;
    if (graphChatDataSource.length === 0) {
      graphChatDataSource = this.state.defaultGraphChatDataSource;
    }
    
    return (
      <div className="main-diagram">
        {
          this.props.graphChat.fetching ?
            <div style={{
              position: "absolute",
              width: 100,
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
              margin: "auto",
              height: 50
            }}>
              <this.Spin />
            </div>
            :
            ""
        }
        <div className="wrap-header-diagram">
          <div className="dashboard-report-title">
            <this.Translate id="text_weekly_operation" />
          </div>
        </div>
        <Line
          data={graphChatDataSource}
          options={
            {
              animation: {duration: 5},
              hover: {animationDuration: 0},
              responsiveAnimationDuration: 0,
              responsive: true
            }
          }
          height={85} />
      </div>
    );
  }
}
