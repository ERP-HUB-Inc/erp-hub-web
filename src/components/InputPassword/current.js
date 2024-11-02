import React from "react";
import { Form, Input } from "antd";

export default class Current extends React.Component {
  constructor(props) {
    super(props);
    this.validateStatus = "";
    this.help = "";
  }
  render() {

    // HADLE ERROR FROM API CHECK
    this.validateStatus = this.props.validateStatus;
    this.help = this.props.help;

    // IF KEY DOWN CHANGE ON INPUT CLEAR ERROR
    // if (this.props.isUserInputCurrentPWD) {
    //   this.validateStatus = "";
    //   this.help = "";
    // }

    return (
      <Form.Item
        label={this.props.label}
        validateStatus={this.validateStatus}
        help={this.help}>
        {
          this.props.getFieldDecorator(this.props.name, {rules: [
            {
              required: this.props.required,
              message: this.props.errorRequired
            }]
          })(
            <Input
              type="password"
              placeholder={this.props.placeholder}
              onChange={this.props.handleMakePasswordToRequired} />
          )
        }
      </Form.Item>
    );
  }
}

Current.defaultProps = {
  name: "current",
  errorRequired: "Please input your current password."
};
