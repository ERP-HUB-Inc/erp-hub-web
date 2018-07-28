import React from "react";
import { NormalRadio } from "./normalRadio";
import Element from "../../common/Element";

export class RadioButton extends Element {
  render() {
    return (
      <this.Field 
        name={this.props.name}
        component={ NormalRadio }
        label={this.props.label}
        data = { this.props.data }
      />
    );
  }   
}


