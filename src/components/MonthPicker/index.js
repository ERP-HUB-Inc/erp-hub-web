import React from "react";
import { DatePicker, Form } from "antd";

const { MonthPicker } = DatePicker;

export class MonthsPicker extends React.Component {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <Form.Item 
        label={this.props.label}
        placeholder={this.props.placeholder}>
        { 
          getFieldDecorator(this.props.name, {rules: [{ type: "object", required: this.props.required, message: this.props.errorRequired }], initialValue: this.props.defaultValue})(
            <MonthPicker 
              format={this.props.dateFormat}
              disabled={this.props.disabled}
            />  
          )
        }
      </Form.Item>
    );
  }
}

MonthsPicker.defaultProps = {
  name: "name"
};

