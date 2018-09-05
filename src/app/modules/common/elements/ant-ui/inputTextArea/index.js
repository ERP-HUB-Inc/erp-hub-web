import React from "react";
import TextAreas from "./textArea";
import "./index.css";
import Element from "../../common/Element";

export class InputTextArea extends Element {
  render() {
    return (
      <TextAreas 
        name={this.props.name}
        label={this.props.label}
        form={this.props.form}
        placeholder={ this.props.placeholder }
        errorLenght={this.props.errorLenght}
        errorRequired={this.props.errorRequired}
        validator={this.props.validator}
        data={this.props.data}
        min={this.props.min}
        max={this.props.max}
        onChange={this.props.handleOnChange}
      />
    );
  }   
}


