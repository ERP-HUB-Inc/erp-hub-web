import React, { Component } from "react";
import Element from "../../common/Element";
import { Checkbox } from "antd";
import "./index.css";

export class Checkboxs extends Element {
  constructor(props){
    super(props);
    this.state = {
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
    };
  }
  render(){
    return (
      <Checkbox />
    );
  }
} 
