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
      }
    ];
  }

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
        rules={this.rules}
        form={this.props.form}
        className={this.props.className} 
      />
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

