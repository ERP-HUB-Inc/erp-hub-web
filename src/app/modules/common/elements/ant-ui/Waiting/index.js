import React, { Component } from "react";
import { Spin } from "antd";

export class Waiting extends Component {
  render(){
    const { 
      tip
    } = this.props;
    return(
      <div className="main-waiting">
        <Spin 
          tip={ tip == null ? "Loading..." : tip  } 
          size="large">
        </Spin>
      </div>
    );
  }
}
