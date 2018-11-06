import React from "react";
import Element from "../../common/Element";
import { DatePicker } from "antd";
const { WeekPicker  } = DatePicker;

export class WeekPickers extends Element {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem 
        label={this.props.label}
        placeholder={this.props.placeholder}>
        { 
          getFieldDecorator(this.props.name, {rules: [{ type: "object", required: this.props.required, message: this.props.errorRequired }], initialValue: this.props.defaultValue})(
            <WeekPicker  
              format={this.props.dateFormat}
              disabled={this.props.disabled}
            />  
          )
        }
      </this.FormItem>
    );
  }
}

WeekPickers.defaultProps = {
  name: "name"
};

