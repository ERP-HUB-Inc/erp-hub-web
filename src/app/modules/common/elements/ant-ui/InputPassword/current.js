import React from "react";
import Element from "../../common/Element";

export default class Current extends Element {
  render() {
    return (
      <this.FormItem label={this.props.label}>
        {
          this.props.getFieldDecorator(this.props.name, {rules: [
            {
              required: this.props.required,
              message: this.props.errorRequired
            }]
          })(
            <this.Input
              type="password"
              placeholder={this.props.placeholder}
              onChange={this.props.handleMakePasswordToRequired} />
          )
        }
      </this.FormItem>
    );
  }
}

Current.defaultProps = {
  name: "current",
  errorRequired: "Please input your current password."
};
