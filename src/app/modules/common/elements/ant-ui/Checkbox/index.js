import React, { Component } from "react";
import { Checkbox } from "antd";

const CheckboxGroup = Checkbox.Group;

function onChange(checkedValues) {
  console.log("checked = ", checkedValues);
}

export class Checkboxs extends Component {
  render(){
    const { 
      label,
      defaultValue
    } = this.props;
    return(
      <div className="main-check">
        <CheckboxGroup 
          options={ label } 
          defaultValue={ defaultValue }
          onChange={ onChange } 
        />
      </div>
    );
  }
} 
