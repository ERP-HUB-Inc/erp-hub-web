import React from "react";
import { Doughnut as DoughnutChart } from "react-chartjs-2";
export class Doughnut extends React.PureComponent {
  render() {
    return <DoughnutChart
      data={this.props.dataSource}
      legend= {{position: this.props.position}}/>;
  }
}

Doughnut.defaultProps = {
  position: "none",
  dataSource: []
};