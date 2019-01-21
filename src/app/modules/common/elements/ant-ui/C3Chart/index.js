import React, {Component} from "react";
import C3 from "react-c3js";
import "c3/c3.css";
import "./index.css";
export class C3Chart extends Component {
  render() {
    return <C3
      data={this.props.data}
      size={this.props.size}
      legend={this.props.legend}
      donut={{
        title: this.props.title,
        label: {
          show: false
        },
        width: this.props.width
      }}
      tooltip={this.props.tooltip} />;    
  }
}

C3Chart.defaultProps = {
  data: {
    columns: [
      ["Data 1", 1],
      ["Data 2", 1]
    ],
    type : "donut"
  },
  width: 40,
  legend: {
    show: false
  },
  title: "Summary Report",
  size: {
    height: 260
  },
  tooltip: {
    format: {
      value: value => {
        return value;
      }
    }
  }
};