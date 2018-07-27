import React from "react";
import Input from "./input";
import Element from "../../common/Element";
import "./index.css";


export class InputNumber extends Element {

  constructor(props) {
    super(props);
    this.rules = [
      // {
      //   required: this.props.required,
      //   message: this.props.errorRequired
      // },
      // {
      //   max: this.props.max,
      //   message: this.props.errorLenght
      // }
    ];
  }

  render() {
    return (
      <this.Field 
        name={this.props.name}
        type={this.props.type}
        parse={ value => Number(value) }
        defaultValue={ this.props.defaultValue }
        placeholder={this.props.placeholder}
        component={ Input }
        label={this.props.label}
        data={this.props.data}
        required = {this.props.required}
        rules = {this.rules}
      />
    );
  }   
}

Input.defaultProps = {
  max: 1,
  errorRequired: "Field required.",
  errorLenght: "Over allow character lenght."
};

