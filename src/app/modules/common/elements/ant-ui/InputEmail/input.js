import React from "react";
import Element from "../../common/Element";

export default class InputText extends Element {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <this.FormItem label={this.props.label}>
        {
          getFieldDecorator(this.props.name, {rules: [
            {
              type: "email",
              message: this.props.errorInvalid
            },
            {
              required: this.props.required,
              message: this.props.errorRequired
            },
            {
              min: this.props.min,
              message: this.props.errorLenght
            },
            {
              max: this.props.max,
              message: this.props.errorLenght
            },
            {
              validator: this.props.validator
            }
          ],initialValue: this.props.data})(
            <this.Input
              type={this.props.type}
              placeholder={this.props.placeholder}
              onKeyDown={this.props.handleKeyDown}
            />
          )
        }
      </this.FormItem>
    );
  }
}

InputText.defaultProps = {
  name: "email",
  type: "text",
  required: false
};
