import React from "react";
import {Tooltip} from "antd";


export class Tooltips extends React.Component {
  render(){
    return (
      <Tooltip placement={this.props.placement} title={this.props.text}>
        {this.props.children}
      </Tooltip>
    );
  }
}

Tooltips.defaultProps = {
  placement: "rightTop",
  text: "Hello World"
};

