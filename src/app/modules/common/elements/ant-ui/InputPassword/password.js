import React from "react";
import Element from "../../common/Element";

export default class Password extends Element {
  render() {
    return (
      <this.FormItem label={this.props.label}>
        {
          this.props.getFieldDecorator(this.props.name, {rules: [{
            required: this.props.required, message: this.props.errorRequired,
          }, {
            validator: this.props.validateToNextPassword,
          }]
          })(
            <this.Input type="password" placeholder={this.props.placeholder}/>
          )
        }
      </this.FormItem>
    );
  }
}

Password.defaultProps = {
  name: "password",
  errorRequired: "Please input your password.",
  required: true
};
