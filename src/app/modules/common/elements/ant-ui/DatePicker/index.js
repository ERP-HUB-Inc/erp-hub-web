import React from "react";
import Element from "../../common/Element";
import "./index.css";

export class DatePickers extends Element {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem label={this.props.label}>
        { 
          getFieldDecorator(this.props.name, {rules: [{ type: "object", required: this.props.required, message: this.props.message }], initialValue: this.props.defaultValue})(
            <this.DatePicker
              disabledDate={this.props.disabledDate}
              format={this.props.dateFormat}
              disabled={this.props.disabled}
            />  
          )
        }
      </this.FormItem>
    );
  }
}

DatePickers.defaultProps = {
  name: "name",
  dateFormat: "YYYY/MM/DD",
  disabledDate: "",
  errorRequired: "Field required.",
  message: "Please select date.",
  required: false,
  disabled: false
};

