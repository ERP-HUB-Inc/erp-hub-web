import React from "react";
import TextInput from "./input";
import Element from "../../common/Element";
import "./index.css";

export  class InputEmail extends Element {
  render() {
    return (
      <this.Field 
        name={this.props.name}
        type="text"
        placeholder={this.props.placeholder}
        component={ TextInput }
        label={this.props.label}
        required={this.props.required}
        validator={this.props.validator}
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

