import React from "react";
import { DatePic } from "./datePicker";
import Element from "../../common/Element";

export class DatePickers extends Element {
  constructor(props) {
    super(props);
    this.rules = [
      {
        type: "object",
      },
      {
        required: this.props.required
      }
      // {
      //   message: this.props.message
      // }
    ];
  }

  render() {
    return (
      <DatePic
        type={ this.props.type }
        label={ this.props.label }
        name={ this.props.name }
        rules={ this.rules }
        required = {this.props.required}  
        label={this.props.label}
        data={this.props.data}
        defaultValue={ this.props.defaultValue }
        form={this.props.form}
      />
    );
  }   
}

DatePickers.defaultProps = {
  errorRequired: "Field required.",
  required: true,
  message: "Please select Date!"
};



