import React from "react";
import { Icon, Spin } from "antd"

export class Loading extends React.Component {
  render () {
    return <Spin indicator={<Icon type="loading" style={{ fontSize: 40 }} spin />} />;
  }
}