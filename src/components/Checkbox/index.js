import React from "react";
import { Form } from "antd";
import "./index.css";

export class Checkboxs extends React.PureComponent {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <Form.Item style={this.props.style}>
        {getFieldDecorator(this.props.name, {
          valuePropName: "checked",
          initialValue: this.props.defaultValue,
        })(
          <this.Checkbox onChange={this.props.onChange}>{this.props.label}</this.Checkbox>
        )}
      </Form.Item>
    );
  }
}

Checkboxs.defaultProps = {
  name: "checkbox",
  defaultValue: false 
};
