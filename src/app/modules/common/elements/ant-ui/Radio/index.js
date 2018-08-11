import React from "react";
import {Radio} from "./Radio";
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
      <Radio 
        name={this.props.name}
        label={this.props.label}
        data={this.props.data }
        rules={this.rules}
        required={this.props.required}
        defaultValue={this.props.defaultValue}
        disabled={this.props.disabled}
        form={this.props.form}
      />
    );
  }   
}




