import React from "react";
import Element from "../../common/Element";
export class Line extends Element {
  render() {
    return <this.Line
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
      width={this.props.width} />;
  }
}