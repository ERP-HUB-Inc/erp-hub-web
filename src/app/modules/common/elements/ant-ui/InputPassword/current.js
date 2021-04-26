import React from "react";
import Element from "../../common/Element";

export default class Current extends Element {
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
      <this.FormItem
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
