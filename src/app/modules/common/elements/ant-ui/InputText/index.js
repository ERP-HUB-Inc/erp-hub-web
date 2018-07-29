import React from "react";
import Input from "./input";
import Element from "../../common/Element";
import "./index.css";

export class InputText extends Element {

  constructor(props) {
    super(props);
    this.rules = [
      {
        required: this.props.required,
        message: this.props.errorRequired
      },
      {
        max: this.props.max,
        message: this.props.errorLenght
      },
      {
        min: this.props.min,
        message: this.props.errorLenght
      }
    ];
  }

  render() {
    return (
      <Input 
        type="text"
        name={this.props.name}
        placeholder={this.props.placeholder}
        label={this.props.label}
        data={this.props.data}
        required={this.props.required}
        notation={this.props.notation}
        errorLenght={this.props.errorLenght}
        errorRequired={this.props.errorRequired}
        form={this.props.form}
        rules={this.rules}
      />
    );
  }   
}

Input.defaultProps = {
  max: 3,
  errorRequired: "Field required.",
  errorLenght: "Over allow character lenght."
};

