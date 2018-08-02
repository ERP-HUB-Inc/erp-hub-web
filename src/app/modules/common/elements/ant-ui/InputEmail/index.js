import React from "react";
import TextInput from "./input";
import Element from "../../common/Element";
import "./index.css";

export  class InputEmail extends Element {
  render() {
    return (
      <TextInput 
        name={this.props.name}
        type="text"
        placeholder={this.props.placeholder}
        label={this.props.label}
        required={this.props.required}
        validator={this.props.validator}
        initialValue={this.props.initialValue}
        form={this.props.form}
        data={ this.props.data }
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

