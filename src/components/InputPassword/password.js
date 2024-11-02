import React from "react";
import { Form, Input} from "antd";

export default class Password extends React.Component {
  render() {
    return (
      <Form.Item label={this.props.label}>
        {
          this.props.getFieldDecorator(this.props.name, {rules: [{
            required: this.props.required, message: this.props.errorRequired,
          }, {
            validator: this.props.validateToNextPassword,
          }]
          })(
            <Input type="password" placeholder={this.props.placeholder}/>
          )
        }
      </Form.Item>
    );
  }
}

Password.defaultProps = {
  name: "password",
  errorRequired: "Please input your password.",
  required: true
};
