import React from "react";
import "./index.css";
import {Line} from "react-chartjs-2";
import Component from "../Component";

export default class Duide extends Component {
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
  }



  
  render() {
    return (
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
        <this.Row>
          <this.Col md="12">
            <canvas id="myChart" width="400" height="400"></canvas>
          </this.Col>
        </this.Row>
      </div>
    );
  }
}
