import React from "react";
import InputText from "./input";
import Element from "../../common/Element";
import "./index.css";

export default class Input extends Element {

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
      }
    ];
  }

  render() {
    return (
      <this.Field 
        name={this.props.name}
        type="text"
        placeholder={this.props.placeholder}
        component={ InputText }
        label={this.props.label}
        notation={ this.props.notation }
        required = {this.props.required}
        rules = {this.rules}
      />
    );
  }   
}

Input.defaultProps = {
  max: 3,
  errorRequired: "Field required.",
  errorLenght: "Over allow character lenght."
};

