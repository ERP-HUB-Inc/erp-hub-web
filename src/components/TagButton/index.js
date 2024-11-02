import React from "react";
import { Tag } from "antd"
import "./index.css";

export class TagButton extends React.Component {
  render() {
    return (
      <Tag {...this.props}/>
    );
  }
}