import React from "react";
import "./index.css";
import {Line,Doughnut} from "react-chartjs-2";
import Component from "../../../Component";

export default class Diagram extends Component {
  constructor(props) {
    super(props);
    this.chartData = 
      {
        labels: ["January", "February", "March", "April", "May", "June", "July", "Aquest", "September", "November", "December"],
        datasets: [{
          label: "Products sold",
          backgroundColor: "rgba(32, 162, 219, 0.1)",
          data: [0, 10, 5, 2, 20, 30, 45, 81, 30, 32, 34, 88],
        },
        {
          label: "Total views",
          backgroundColor: "rgba(196, 93, 105, 0.1)",
          data: [0, 10, 35, 24, 20, 30, 45, 12, 81, 30, 32, 34],
        },
        ]
      };

    this.doughnutData = 
      {
        labels: [
          "France",
          "Italy",
          "Spain"
        ],
        datasets: [
          {
            data: [10,20,30],
            backgroundColor: [
              "red",
              "blue",
              "green"
            ]
          }
        ],   
      };

    this.statusList = [
      {name: <this.Translate id="select_text_active"/>, value: this.Enum.ACTIVE},
      {name: <this.Translate id="select_text_deactive"/>, value: this.Enum.DEACTIVE},
      {name: <this.Translate id="select_text_all_status"/>, value: this.Enum.ALL_STATE}
    ];

  }



  
  render() {
    const {form,locale} = this.props;
    return (
      <div>
        <div className="main-diagram">
          <Line
            data={this.chartData}
            option={
              {
                animation: {
                  duration: 0, // general animation time
                },
                hover: {
                  animationDuration: 0, // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0,
                responsive: true
              }
            }
            height={500}
            width={1700}
          />

          
        </div>
        <div class="main-doughnut-chart">
          <this.Row>
            <this.Col md="6" xs="12" className="doughnut-chart doughnut-chart-left">
              <this.Row>
                <this.Col md="8">
                  Title
                </this.Col>
                <this.Col md="4">
                  <this.Select
                    name="status"
                    placeholder={this.CATranslate("place_holder_stock_reorder_point_status", locale)}
                    dataSource={this.statusList}
                    defaultValue={this.Enum.ALL_STATE}
                    form={form}
                  />
                </this.Col>
              </this.Row>
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
                    responsive: true
                  }
                }
              />
            </this.Col>
            <this.Col md="6" xs="12" className="doughnut-chart doughnut-chart-right">
              <this.Row>
                <this.Col md="8">
                  Title
                </this.Col>
                <this.Col md="4">
                  <this.Select
                    name="status"
                    placeholder={this.CATranslate("place_holder_stock_reorder_point_status", locale)}
                    dataSource={this.statusList}
                    defaultValue={this.Enum.ALL_STATE}
                    form={form}
                  />
                </this.Col>
              </this.Row>
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
                    responsive: true
                  }
                }
              />
            </this.Col>
          </this.Row>
          
        </div>
      </div>
    );
  }
}
