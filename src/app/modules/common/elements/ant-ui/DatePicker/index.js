import React from "react";
import Element from "../../common/Element";
import "./index.css";

export class DatePickers extends Element {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem 
        label={this.props.label}
        placeholder={this.props.placeholder}>
        { 
          getFieldDecorator(this.props.name, {rules: [{ type: "object", required: this.props.required, message: this.props.errorRequired }], initialValue: this.props.defaultValue})(
            <this.DatePicker
              format={this.props.dateFormat}
              disabled={this.props.disabled} />  
          )
        }
      </this.FormItem>
    );
  }
}

DatePickers.defaultProps = {
  name: "name",
  dateFormat: "DD MMM YYYY",
  errorRequired: "Please select date",
  required: false,
  disabled: false
};

