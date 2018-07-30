import React from "react";
import { NormalRadio } from "./normalRadio";
import Element from "../../common/Element";

export class RadioButton extends Element {
  render() {
    return (
      <NormalRadio 
        name={this.props.name}
        label={this.props.label}
        data = { this.props.data }
      />
    );
  }   
}


