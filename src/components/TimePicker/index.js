import React from "react";
import { Form, TimePicker } from "antd";

export class TimePickers extends React.Component {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <Form.Item 
        label={this.props.label}
        style={this.props.style}
        placeholder={this.props.placeholder}>
        { 
          getFieldDecorator(this.props.name, {rules: [{ type: "object", required: this.props.required, message: this.props.errorRequired }], initialValue: this.props.defaultValue})(
            <TimePicker
              format={this.props.timeFormat}
              onChange={this.props.onChange}
              allowClear={this.props.allowClear}
              placeholder={this.props.placeholder}
              style={this.props.inputStyle}
              use12Hours={this.props.use12Hours}
              disabled={this.props.disabled} />  
          )
        }
      </Form.Item>
    );
  }
}

TimePickers.defaultProps = {
  name: "name",
  timeFormat: "hh:mm A",
  errorRequired: "Please select time",
  required: false,
  disabled: false
};

