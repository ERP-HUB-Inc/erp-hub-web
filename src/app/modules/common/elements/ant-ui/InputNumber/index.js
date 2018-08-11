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
      },
      {
        max: 2,
        message: this.props.errorLength
      }
    ];
  }

  render() {
    return (
      <Input 
        name={this.props.name}
        type="number"
        // parse={ value => Number(value) }
        defaultValue={ this.props.defaultValue }
        placeholder={this.props.placeholder}
        label={this.props.label}
        data={this.props.data}
        required = {this.props.required}
        form={this.props.form}
      />
    );
  }   
}

Input.defaultProps = {
  max: 1,
  errorRequired: "Field required.",
  errorLength: "Over allow character lenght."
};

