import React from "react";
import Input from "./input";
import Element from "../../common/Element";
import "./index.css";

export class InputText extends Element {
  render() {
    return (
      <Input 
        type={ this.props.type }
        name={this.props.name}
        placeholder={this.props.placeholder}
        label={this.props.label}
        data={this.props.data}
        required={this.props.required}
        notation={this.props.notation}
        errorLenght={this.props.errorLenght}
        errorRequired={this.props.errorRequired}
        validator={this.props.validator}
        form={this.props.form}
        min={ this.props.min }
        max={ this.props.max }
        disabled= { this.props.disabled }
      />
    );
  }   
}

Input.defaultProps = {
  max: 255,
  errorRequired: "Field required.",
  errorLenght: "Over allow character lenght.",
  type: "text"
};

