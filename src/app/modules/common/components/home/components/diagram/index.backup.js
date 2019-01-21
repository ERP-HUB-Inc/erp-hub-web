import React from "react";
import GraphAction from "../../../../../common/actions/home";
import {Line, Doughnut} from "react-chartjs-2";
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
              label: "Income"
            },
            {
              borderColor: "#06D79C",
              borderWidth: 2,
              label: "Expense"
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
  }

  render() {
    const incomeExpense = this.groupIncomeExpenseType();
    let graphChatDataSource = this.props.graphChat.list;
    if (graphChatDataSource.length === 0) {
      graphChatDataSource = this.state.defaultGraphChatDataSource;
    }
    
    return (
      
      <this.Row>
        <this.Col md="6" className="main-diagram">
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
          <Line
            data={graphChatDataSource}
            borderColor="red"
            options={
              {
                animation: {duration: 0},
                hover: {animationDuration: 0},
                responsiveAnimationDuration: 0,
                responsive: true
              }
            }
            legend= {{position: "top"}}
            height={505}
            width={1700} />
        </this.Col>
        {/* <div className="main-doughnut-chart">
          <this.Row>
            <this.Col md="6" xs="12" className="doughnut-chart doughnut-chart-left">
              <div className="title-pie-chart">
                <this.Translate id="home_page_graph_income" />
              </div>
              {
                incomeExpense.income.length > 0 && incomeExpense.income[0] && incomeExpense.income[0].labels.length > 0 ?
                  <Doughnut
                    data={incomeExpense.income[0] ? incomeExpense.income[0] : [] }
                    option={
                      {
                        animation: {
                          duration: 0, 
                        },
                        hover: {
                          animationDuration: 0, 
                        },
                        responsiveAnimationDuration: 0,
                        responsive: true
                      }
                    }
                    legend= {{position: "left" }}
                  />      
                  : 
                  <div className="no-pie-chart-image text-center">
                    <img src={this.Util.getGeneralImage("storeVein/blank_pipe-01.svg").url} alt="no-chart-data"  />
                  </div>
              }
            </this.Col>
            <this.Col md="6" xs="12" className="doughnut-chart doughnut-chart-right">
              <div className="title-pie-chart">
                <this.Translate id="home_page_graph_expense" />
              </div>
              {
                incomeExpense.expense.length > 0 && incomeExpense.expense[0] && incomeExpense.expense[0].labels.length > 0 ?
                  <Doughnut
                    data={incomeExpense.expense[0] ? incomeExpense.expense[0] : [] }
                    option={
                      {
                        animation: {
                          duration: 0, 
                        },
                        hover: {
                          animationDuration: 0,
                        },
                        responsiveAnimationDuration: 0,
                        responsive: true
                      }
                   
                    }
                    legend= {{position: "left" }}
                  /> 
                  : 
                  <div className="no-pie-chart-image text-center">
                    <img src={this.Util.getGeneralImage("storeVein/blank_pipe-01.svg").url} alt="no-chart-data" />
                  </div>  
              }
            </this.Col>

          </this.Row>
        </div> */}
      </this.Row>
    );
  }
}
