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
        className={this.props.type + " " + this.props.className}>
        {this.props.children}
      </AntButton>
    );
  }
}