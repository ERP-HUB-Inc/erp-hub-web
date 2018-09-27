import React from "react";
import Input from "./input";
import Element from "../../common/Element";
import "./index.css";


export class InputNumber extends Element {
  constructor(props) {
    super(props);
    this.rules = [
      {
        required: this.props.required,
        message: this.props.errorRequired
        // validator: this.checkPrice
      }
    ];
  }

  // checkPrice(rule, value, callback){
  //   if (value > 0) {
  //     callback();
  //     return;
  //   }
  //   callback("Value should Grather than 0");
  // }

  render() {
    return (
      <Input
        name={this.props.name}
        placeholder={this.props.placeholder}
        label={this.props.label}
        errorLength={this.props.errorLength}
        max={this.props.max}
        isUnsign={this.props.isUnsign}
        data={this.props.data}
        formatter={this.props.formatter}
        step={this.props.step}
        disabled={this.props.disabled}
        rules={this.rules}
        form={this.props.form}
        onChange={this.props.onChange}
        handleKeyDown={this.props.handleKeyDown}
        handleKeyUp={this.props.handleKeyUp}
        handlePressEnter={this.props.handlePressEnter}
        handleOnBlur={this.props.handleOnBlur}
        handleOnFocus={this.props.handleOnFocus}
        className={this.props.className}
        isAutoFocus={this.props.isAutoFocus}
        isHideTool={this.props.isHideTool}/>
    );
  }   
}

Input.defaultProps = {
  name: "name",
  max: 9999999999,
  errorLength: "The number allow maximum 9999 999 999.",
  required: true,
  errorRequired: "This field is required."
};

