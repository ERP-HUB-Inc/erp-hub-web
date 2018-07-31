import React, { Component } from "react";
import Element from "../../common/Element";
import { Checkbox } from "antd";
import "./index.css";

export class Checkboxs extends Element {
  render(){
    return (
      // <this.Field 
      //   name={this.props.name}
      //   type="checkbox"
      //   component={ Checkbox }
      //   label={this.props.label}
      //   placeholder={this.props.placeholder}
      //   required = {this.props.required}
      //   rules = {this.rules}
      // />
      <Checkbox />
    );
  }
} 
