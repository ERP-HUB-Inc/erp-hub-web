import React from "react";
import { Form, Input } from "antd"

export default class Current extends React.Component {
  render() {
    return (
      <Form.Item label={this.props.label}>
        {
          this.props.getFieldDecorator(this.props.name, {rules: [{
            required: this.props.required, message: this.props.errorRequired,
          },
          {
            validator: this.props.compareToFirstPassword,
          }
          ]})(
            <Input
              type="password"
              placeholder={this.props.placeholder}
              onBlur={this.props.handleConfirmBlur} />
          )
        }
      </Form.Item>
    );
  }
}

Current.defaultProps = {
  name: "current",
  errorRequired: "Please confirm your password.",
  required: true
};
