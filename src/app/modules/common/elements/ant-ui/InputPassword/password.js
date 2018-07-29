import React from "react";
import Element, { Form } from "../../common/Element";

export default class Password extends Element {
  render() {
    const { input } = this.props;
    return (
      <this.FormItem label={this.props.label}>
        {
          this.props.getFieldDecorator(this.props.name, {rules: [{
            required: true, message: "Please input your password!",
          }, {
            validator: this.props.validateToNextPassword,
          }]
          })(
            <this.Input {...input} type={this.props.type} placeholder={this.props.placeholder}/>
          )
        }
      </this.FormItem>
    );
  }
}

Password.defaultProps = {
  name: "password",
  type: "password",
  required: true
};
