import React from "react";
import { Button as AntButton } from "antd";
import "./index.css";

export class Button extends React.Component {
  render() {
    return (
      <AntButton
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        loading={this.props.loading}
        className={this.props.type + " " + this.props.className}
        id={this.props.id}
        style={{width: this.props.width}}
        htmlType={this.props.htmlType}>
        {this.props.children}
      </AntButton>
    );
  }
}