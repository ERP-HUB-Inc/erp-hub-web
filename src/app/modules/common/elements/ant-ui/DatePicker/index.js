import React from "react";
import { DatePic } from "./datePicker";
import Element from "../../common/Element";

export class DatePickers extends Element {
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
      <this.Field 
        name={this.props.name}
        type="text"
        placeholder={this.props.placeholder}
        component={ DatePic }
        label={this.props.label}
        data={this.props.data}
      />
    );
  }   
}


