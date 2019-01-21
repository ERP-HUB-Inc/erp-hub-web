import React from "react";
import Element from "../../common/Element";
export  class Doughnut extends Element {
  render() {
    return <this.Doughnut
      data={this.props.dataSource}
      legend= {{position: this.props.position}}/>;
  }
}

Doughnut.defaultProps = {
  position: "none",
  dataSource: []
};