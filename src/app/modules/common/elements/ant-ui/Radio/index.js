import React from "react";
import { NormalRadio } from "./normalRadio";
import Element from "../../common/Element";


export class RadioButton extends Element {

  constructor(props){
    super(props);
    this.rules = [
      {
        required: this.props.required,
        message: this.props.errorRequired
      }
    ];
  }

  render() {
    return (
      <NormalRadio 
        name={this.props.name}
        label={this.props.label}
        data = {this.props.data }
        rules= { this.rules }
        form={ this.props.form }
      />
    );
  }   
}




