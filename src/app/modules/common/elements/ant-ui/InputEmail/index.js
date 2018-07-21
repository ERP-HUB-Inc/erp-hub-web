import React from "react";
import Element, { ReduxForm } from "../../common/Element";
import TextInput from "./input";

export default class InputEmail extends Element {

  constructor(props) {
    super(props);
    this.rules = [
      {
        type: "email",
        message: this.props.errorInvalid
      },
      {
        required: this.props.required,
        message: this.props.errorRequired
      },
      {
        min: this.props.min,
        message: this.props.errorLenght
      },
      {
        max: this.props.max,
        message: this.props.errorLenght
      }
    ];
  }

  render() {
    return (
      <this.Field 
        name={this.props.name}
        type="text"
        placeholder={this.props.placeholder}
        component={ TextInput }
        label={this.props.label}
        required = {this.props.required}
        rules = {this.rules}
      />
    );
  }   
}

InputEmail.defaultProps = {
  name: "email",
  label: "Email",
  required: false,
  min: 3,
  max: 100,
  errorInvalid: "Invalid email",
  errorRequired: "Email required",
  errorLenght: "Over allow character lenght"
};

