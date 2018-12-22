import React from "react";
import Element from "../../common/Element";
export  class Doughnut extends Element {
  render() {
    return <this.Doughnut
      data={this.props.dataSource}
      option={
        {
          animation: {duration: 0},
          hover: {animationDuration: 0},
          responsiveAnimationDuration: 0,
          responsive: false,
        }
      }
      legend= {{position: "none"}}/>;
  }
}

Doughnut.defaultProps = {
  dataSource: []
};