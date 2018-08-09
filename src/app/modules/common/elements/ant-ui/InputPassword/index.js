import React from "react";
import Password from "./password";
import Confirm from "./confirm";
import Element, { Form } from "../../common/Element";
import "./index.css";

export  class InputPassword extends Element {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false
    };
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
  }

  validateToNextPassword (rule, value, callback) {
    if (this.props.checkConfirm) {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
    }
    callback();
  }

  compareToFirstPassword (rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent.");
    } else {
      callback();
    }
  }

  handleConfirmBlur (e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Password
          name="password"
          type="password"
          getFieldDecorator={getFieldDecorator}
          validateToNextPassword={this.validateToNextPassword}
          placeholder={this.props.placeholder}
          label={this.props.label}
          required = {this.props.required}
        />
        { 
          this.props.checkConfirm ?
            <Confirm 
              name="confirm"
              type="password"
              getFieldDecorator={getFieldDecorator}
              compareToFirstPassword={this.compareToFirstPassword}
              handleConfirmBlur={this.handleConfirmBlur}
              placeholder={this.props.confirmPlaceholder}
              label={this.props.confirmLabel}
              required = {this.props.required}
            />
            :
            ""
        }
      </div>
    );
  }   
}

InputPassword.defaultProps = {
  min: 8,
  max: 255,
  checkConfirm: true,
  errorRequired: "Please input your password."
};



