import React from "react";
import Element from "../../common/Element";

export default class Confirm extends Element {
  render() {
    const { input } = this.props;
    return (
      <this.FormItem label={this.props.label}>
        {
          this.props.getFieldDecorator(this.props.name, {rules: [{
            required: true, message: "Please confirm your password!",
          }, {
            validator: this.props.compareToFirstPassword,
          }]})(
            <this.Input {...input} type={this.props.type} placeholder={this.props.placeholder} onBlur={this.props.handleConfirmBlur} />
          )
        }
      </this.FormItem>
    );
  }
}

Confirm.defaultProps = {
  name: "confirm",
  type: "password",
  required: true
};
