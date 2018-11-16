import React from "react";
import GraphAction from "../../../../../common/actions/home";
import {Line,Doughnut} from "react-chartjs-2";
import Component from "../../../Component";
import "./index.css";

export default class Diagram extends Component {
  constructor(props) {
    super(props);
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
    const { graphChat, pipeChat } = this.props;
    const incomeExpense = this.groupIncomeExpenseType();

    console.log("expense diagram",incomeExpense.expense[0] ? incomeExpense.expense[0] : [] );

    return (
      pipeChat.fetching ? 
        <div className="text-center">
          <this.Spin/>
        </div> 
        :
        <div>
          <div className="main-diagram">
            <Line
              data={ graphChat.list }
              option={
                {
                  animation: {
                    duration: 0, // general animation time
                  },
                  hover: {
                    animationDuration: 0, // duration of animations when hovering an item
                  },
                  responsiveAnimationDuration: 0,
                  responsive: true,
                }
              }
              legend= {{position: "top" }}
              height={520}
              width={1700}
            />

          </div>
          <div className="main-doughnut-chart">
            <this.Row>
              <this.Col md="6" xs="12" className="doughnut-chart doughnut-chart-left">
                <this.Row>
                  <this.Col md="8">
                    <this.Translate id="home_page_graph_expense" />
                  </this.Col>
                </this.Row>
            
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
              </this.Col>
              <this.Col md="6" xs="12" className="doughnut-chart doughnut-chart-right">
                <this.Row>
                  <this.Col md="8">
                    <this.Translate id="home_page_graph_income" />
                  </this.Col>
                </this.Row>
             
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
             
              </this.Col>

            </this.Row>
          </div>
        
        </div>
    );
  }
}
