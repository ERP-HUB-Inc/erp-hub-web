import React from "react";
import Element from "../../common/Element";
import "./index.css";

export class DatePic extends Element {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem label={this.props.label}>
        { 
          getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.defaultValue})(
            <this.DatePicker
              format={this.props.dateFormat}
              disabled={this.props.disabled}
            />  
          )
        }
      </this.FormItem>
    );
  }
}

DatePic.defaultProps = {
  name: "name",
  dateFormat: "YYYY/MM/DD",
  required: false,
  disabled: false
};

