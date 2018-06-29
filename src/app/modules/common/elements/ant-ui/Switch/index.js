import React, { Component } from "react";
import { Switch } from "antd";

export class Switchs extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(checked) {
    console.log(`switch to ${checked}`);
  }

  render(){
    return(
      <div>
        <Switch defaultChecked onChange={ this.props.onChange } />
      </div>
    );
  }
}