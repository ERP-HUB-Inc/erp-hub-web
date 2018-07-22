import React from "react";
import Element from "../../common/Element";
import "./index.css";

export default class InputEmail extends Element {

  constructor(props) {
    super(props);
    this.rules = [
    ];
  }

  render() {
    return (
      <this.Field 
        component={ Select }
        {...this.props}
      />
    );
  }   
}


class Select extends Element {
  handleChange(value) {
    console.log(`selected ${value}`);
  }
      
  handleBlur() {
    console.log("blur");
  }
      
  handleFocus() {
    console.log("focus");
  }
      
  render() {
    return (
      <this.FormItem label={this.props.label}>
        <this.Select
          defaultValue={this.props.defaultValue}
          style={{ width: "100%" }}
          label={this.props.label}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        >
          {
            this.props.dataSource.map((value, index) => <this.Option key={index} value={value.value}>{value.name}</this.Option>)
          }
        </this.Select>
      </this.FormItem>
    );
  }
}