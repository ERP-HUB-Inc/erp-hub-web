import React from "react";
import Element from "../../common/Element";

export default class Current extends Element {
  render() {
    return (
      <this.FormItem label={this.props.label}>
        {
          this.props.getFieldDecorator(this.props.name, {rules: [{
            required: this.props.required, message: this.props.errorRequired,
          },
          {
            validator: this.props.compareToFirstPassword,
          }
          ]})(
            <this.Input
              type="password"
              placeholder={this.props.placeholder}
              onBlur={this.props.handleConfirmBlur} />
          )
        }
      </this.FormItem>
    );
  }
}

Current.defaultProps = {
  name: "current",
  errorRequired: "Please confirm your password.",
  required: true
};
