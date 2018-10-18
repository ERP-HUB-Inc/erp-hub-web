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
        help={this.props.help}
        validateStatus={this.props.validateStatus}
        required={this.props.required}
        errorRequired={this.props.errorRequired}
        errorInvalid={this.props.errorInvalid}
        validator={this.props.validator}
        initialValue={this.props.initialValue}
        handleKeyDown={this.props.handleKeyDown}
        className={this.props.className}
        form={this.props.form}
        data={ this.props.data }
      />
    );
  }   
}

InputEmail.defaultProps = {
  name: "email",
  required: false,
  min: 3,
  max: 100,
  errorInvalid: "Invalid email address",
  errorRequired: "Email required",
  errorLenght: "Over allow character lenght"
};

