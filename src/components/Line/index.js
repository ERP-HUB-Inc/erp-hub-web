import React from "react";
import {Line as LineChart} from "react-chartjs-2";

export class Line extends React.Component {
  render() {
    return <LineChart
      data={this.props.dataSource}
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
      legend = {{
        position: this.props.legendPosition
      }}
      height={this.props.height}
      width={this.props.width}/>;
  }
}