import React from "react";
import { DatePicker, Form } from "antd";
const { WeekPicker  } = DatePicker;

export class WeekPickers extends React.Component {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <Form.Item 
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
      </Form.Item>
    );
  }
}

WeekPickers.defaultProps = {
  name: "name"
};

